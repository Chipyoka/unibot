const { ChatSession, Message } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // 1. Session overview
  async sessionOverview(req, res) {
    try {
      const total = await ChatSession.count({ where: { userId: req.user.sub } });
      const active = await ChatSession.count({ where: { userId: req.user.sub, status: 'active' } });
      const closed = total - active;

      return res.json({ total, active, closed });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to get session overview' });
    }
  },

  // 2. Message counts per session
  async messageCounts(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await ChatSession.findOne({
        where: { id: sessionId, userId: req.user.sub }
      });
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const studentCount = await Message.count({ where: { sessionId, sender: 'student' } });
      const botCount = await Message.count({ where: { sessionId, sender: 'bot' } });

      return res.json({ sessionId, studentCount, botCount });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to get message counts' });
    }
  },

  // 3. Sentiment summary
  async sentimentSummary(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await ChatSession.findOne({
        where: { id: sessionId, userId: req.user.sub }
      });
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const messages = await Message.findAll({ where: { sessionId } });

      const summary = messages.reduce(
        (acc, msg) => {
          if (msg.sentiment === 'positive') acc.positive++;
          else if (msg.sentiment === 'negative') acc.negative++;
          else acc.neutral++;
          return acc;
        },
        { positive: 0, negative: 0, neutral: 0 }
      );

      return res.json({ sessionId, summary });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to get sentiment summary' });
    }
  }
};
