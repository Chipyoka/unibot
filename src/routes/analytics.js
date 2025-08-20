const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/sessions', analyticsController.sessionOverview);
router.get('/sessions/:sessionId/messages', analyticsController.messageCounts);
router.get('/sessions/:sessionId/sentiment', analyticsController.sentimentSummary);

module.exports = router;
