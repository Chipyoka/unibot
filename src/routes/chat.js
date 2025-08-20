const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/start', chatController.startSession);
router.post('/send', chatController.sendMessage);
router.get('/history', authMiddleware, chatController.getHistory); // Get all sessions
router.get('/history/:sessionId', authMiddleware, chatController.getSessionMessages); // Get messages for a specific session
router.post('/end/:sessionId', chatController.endSession);

module.exports = router;
