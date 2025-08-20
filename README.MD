# Depression Detection AI System for Zambian University Students

### Tech Stack

* **Runtime**: Node.js with Express.js
* **Database**: MySQL 8.0+
* **Authentication**: Custom JWT-based auth
* **Sentiment Analysis**: Hugging Face Transformers + TextBlob fallback

* * *

## Project Structure

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

* * *