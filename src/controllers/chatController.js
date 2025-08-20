const { ChatSession, Message } = require('../models');
const { analyzeSentiment } = require('../services/sentimentService');
const { generateReply } = require('../services/chatbotService');

module.exports = {
  // Start a new chat session
  async startSession(req, res) {
    try {
      const session = await ChatSession.create({ userId: req.user.sub });
      return res.status(201).json({ message: 'Chat session started', session });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to start chat session' });
    }
  },

  // Send a message and get bot reply
  async sendMessage(req, res) {
    try {
      const { sessionId, text } = req.body;

      // Find active session
      const session = await ChatSession.findOne({
        where: { id: sessionId, userId: req.user.sub, status: 'active' }
      });
      if (!session) return res.status(404).json({ error: 'Active session not found' });



      // Analyze sentiment
      const sentimentResult = await analyzeSentiment(text);

      console.log("Raw sentiment result:", sentimentResult);

      // Directly use it (since it's already one object)
      const sentimentLabel = sentimentResult.label.toLowerCase();
      const sentimentScore = sentimentResult.score;

      // Save student message
      const studentMsg = await Message.create({
        sessionId: session.id,
        sender: 'student',
        text,
        sentiment: sentimentLabel,
        sentimentScore
      });

      // Generate bot reply using label
      const botReplyText = await generateReply(text, sentimentLabel);

      // Save bot message
      const botMsg = await Message.create({
        sessionId: session.id,
        sender: 'bot',
        text: botReplyText,
        sentiment: 'neutral',
        sentimentScore: 0
      });


      return res.status(201).json({
        message: 'Message sent',
        student: studentMsg,
        bot: botMsg
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to send message' });
    }
  },

 // Fetch all chat sessions with their messages for a user
// Fetch all chat sessions with optimized query
async getHistory(req, res) {
  try {
    const sessions = await ChatSession.findAll({
      where: { userId: req.user.sub },
      order: [['createdAt', 'DESC']],
    });

    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        // Get first student message for title
        const firstMessage = await Message.findOne({
          where: { 
            sessionId: session.id,
            sender: 'student'
          },
          order: [['createdAt', 'ASC']]
        });

        // Get message count
        const messageCount = await Message.count({
          where: { sessionId: session.id }
        });

        let title = `Session #${session.id}`;
        if (firstMessage) {
          const words = firstMessage.text.split(' ');
          title = words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
        }

        return {
          id: session.id,
          userId: session.userId,
          status: session.status,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          title,
          messageCount
        };
      })
    );

    return res.json({ sessions: sessionsWithDetails });
  } catch (err) {
    console.error('Error fetching chat history:', err);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
},

// Fetch messages for a specific session
async getSessionMessages(req, res) {
  try {
    const { sessionId } = req.params;

    // Verify the session belongs to the user
    const session = await ChatSession.findOne({
      where: { id: sessionId, userId: req.user.sub }
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const messages = await Message.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']]
    });

    return res.json({ 
      session: {
        id: session.id,
        status: session.status,
        startedAt: session.startedAt,
        endedAt: session.endedAt
      },
      messages 
    });
  } catch (err) {
    console.error('Error fetching session messages:', err);
    return res.status(500).json({ error: 'Failed to fetch session messages' });
  }
},

  // End chat session
  async endSession(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await ChatSession.findOne({
        where: { id: sessionId, userId: req.user.sub, status: 'active' }
      });
      if (!session) return res.status(404).json({ error: 'Active session not found' });

      session.status = 'closed';
      session.endedAt = new Date();
      await session.save();

      return res.json({ message: 'Chat session ended', session });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to end session' });
    }
  }
};
