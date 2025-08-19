# Backend Implementation Strategy

## Depression Detection AI System for Zambian University Students

### Tech Stack

- **Runtime**: Node.js with Express.js
- **Database**: MySQL 8.0+
- **Authentication**: Custom JWT-based auth
- **Sentiment Analysis**: Hugging Face Transformers + TextBlob fallback

---

## Project Structure

```
depression-detection-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── environment.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ChatSession.js
│   │   ├── Message.js
│   │   └── DepressionAssessment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── sentimentController.js
│   │   └── assessmentController.js
│   ├── services/
│   │   ├── sentimentAnalysis.js
│   │   ├── chatbotLogic.js
│   │   ├── depressionDetection.js
│   │   └── emailService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rateLimiter.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── assessment.js
│   │   └── analytics.js
│   ├── utils/
│   │   ├── responseHelper.js
│   │   ├── encryption.js
│   │   └── logger.js
│   └── app.js
├── database/
│   ├── migrations/
│   └── seeds/
├── tests/
├── package.json
├── .env.example
└── README.md
```

---

## Database Schema Design

### Users Table

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    university VARCHAR(200),
    year_of_study INT,
    age INT,
    gender ENUM('male', 'female'),
    consent_given BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Chat Sessions Table

```sql
CREATE TABLE chat_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_name VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    total_messages INT DEFAULT 0,
    average_sentiment DECIMAL(3,2) DEFAULT 0.00,
    depression_risk_score DECIMAL(3,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Messages Table

```sql
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chat_session_id INT NOT NULL,
    sender ENUM('user', 'bot') NOT NULL,
    message_text TEXT NOT NULL,
    sentiment_score DECIMAL(3,2),
    sentiment_label VARCHAR(20),
    confidence_score DECIMAL(3,2),
    depression_indicators JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);
```

### Depression Assessments Table

```sql
CREATE TABLE depression_assessments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    assessment_type VARCHAR(50) DEFAULT 'PHQ-9',
    responses JSON NOT NULL,
    total_score INT NOT NULL,
    risk_level ENUM('minimal', 'mild', 'moderate', 'moderately_severe', 'severe') NOT NULL,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Implementation Phases

### Phase 1: Core Backend Setup (Week 1-2)

#### 1.1 Project Initialization

```bash
npm init -y
npm install express mysql2 bcryptjs jsonwebtoken cors helmet morgan dotenv
npm install --save-dev nodemon jest supertest
```

#### 1.2 Basic Server Setup

- Express server with middleware
- MySQL connection setup
- Environment configuration
- Basic error handling

#### 1.3 Authentication System

- User registration with validation
- Login with JWT token generation
- Session management
- Password hashing with bcryptjs

### Phase 2: Database & Models (Week 2-3)

#### 2.1 Database Connection

```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

#### 2.2 Model Implementation

- User model with CRUD operations
- Chat session management
- Message handling
- Assessment tracking

### Phase 3: Sentiment Analysis Integration (Week 3-4)

#### 3.1 Sentiment Analysis Service

```javascript
// services/sentimentAnalysis.js
const axios = require('axios');

class SentimentAnalysisService {
  constructor() {
    this.huggingFaceEndpoint = 'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest';
    this.apiKey = process.env.HUGGING_FACE_API_KEY;
  }

  async analyzeSentiment(text) {
    try {
      const response = await axios.post(
        this.huggingFaceEndpoint,
        { inputs: text },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return this.processSentimentResult(response.data);
    } catch (error) {
      // Fallback to TextBlob or rule-based analysis
      return this.fallbackSentimentAnalysis(text);
    }
  }

  processSentimentResult(data) {
    // Process Hugging Face response
    const sentiment = data[0];
    return {
      label: sentiment.label,
      score: sentiment.score,
      confidence: sentiment.score
    };
  }
}
```

#### 3.2 Depression Detection Logic

- Keyword analysis for depression indicators
- Sentiment trend analysis
- Risk score calculation
- Alert system for high-risk cases

### Phase 4: Chatbot Logic (Week 4-5)

#### 4.1 Rule-Based Response System

```javascript
// services/chatbotLogic.js
class ChatbotService {
  constructor() {
    this.responses = {
      greeting: [
        "Hello! I'm here to listen and support you. How are you feeling today?",
        "Hi there! Welcome to our safe space. What's on your mind?"
      ],
      sadness: [
        "I hear that you're going through a difficult time. Can you tell me more about what's troubling you?",
        "It sounds like you're feeling down. Remember, it's okay to feel this way, and you're not alone."
      ],
      anxiety: [
        "I understand you're feeling anxious. Let's try some breathing exercises together. Would that help?",
        "Anxiety can be overwhelming. What specific thoughts are causing you worry right now?"
      ]
    };
  }

  generateResponse(message, sentimentData, userHistory) {
    // Analyze sentiment and user history
    // Generate appropriate response
    // Include educational content when relevant
    // Suggest professional help when needed
  }
}
```

#### 4.2 Educational Content Integration

- Depression awareness content
- Coping strategies
- Resource recommendations
- Gamification elements (progress tracking)

### Phase 5: API Endpoints (Week 5-6)

#### 5.1 Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/profile
PUT /api/auth/profile
```

#### 5.2 Chat Endpoints

```
POST /api/chat/sessions          # Start new chat session
GET /api/chat/sessions           # Get user's chat sessions
GET /api/chat/sessions/:id       # Get specific session
POST /api/chat/sessions/:id/messages  # Send message
GET /api/chat/sessions/:id/messages   # Get session messages
```

#### 5.3 Assessment Endpoints

```
POST /api/assessments           # Submit assessment
GET /api/assessments            # Get user assessments
GET /api/assessments/latest     # Get latest assessment
```

#### 5.4 Analytics Endpoints

```
GET /api/analytics/dashboard    # User dashboard data
GET /api/analytics/progress     # Progress tracking
GET /api/analytics/insights     # Personal insights
```

---

## Environment Configuration

### .env.example

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=depression_detection_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
SESSION_EXPIRE=86400000

# External APIs
HUGGING_FACE_API_KEY=your-hugging-face-api-key

# Email Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

---

## Deployment Strategy

### 3. Deployment Configuration

```json
// package.json scripts
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "migrate": "node database/migrate.js",
    "seed": "node database/seed.js",
    "test": "jest"
  }
}
```

---

## Security Considerations

### 1. Data Protection

- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper CORS policies
- Rate limiting on API endpoints

### 2. Authentication Security

- Strong password requirements
- JWT token expiration
- Secure session management
- Account lockout after failed attempts

### 3. Privacy Compliance

- Data anonymization options
- Consent management
- Data retention policies
- GDPR-like privacy controls

---

## Testing Strategy

### 1. Unit Tests

- Authentication functions
- Sentiment analysis accuracy
- Database operations
- Chatbot response logic

### 2. Integration Tests

- API endpoint testing
- Database connectivity
- Third-party service integration
- End-to-end user flows

### 3. Load Testing

- Concurrent user handling
- Database performance
- API response times
- Memory usage optimization

---

## Monitoring & Analytics

### 1. Application Monitoring

- Error tracking and logging
- Performance metrics
- API usage statistics
- Database query optimization

### 2. Mental Health Metrics

- Depression risk score trends
- User engagement patterns
- Intervention effectiveness
- Referral success rates


