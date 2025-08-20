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

  // Fetch chat history
  async getHistory(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await ChatSession.findOne({
        where: { id: sessionId, userId: req.user.sub }
      });
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const messages = await Message.findAll({
        where: { sessionId },
        order: [['createdAt', 'ASC']]
      });

      return res.json({ session, messages });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch history' });
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
