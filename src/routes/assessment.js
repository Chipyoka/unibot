const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.post('/submit', assessmentController.submitAssessment);
router.get('/history', assessmentController.getAssessments);

module.exports = router;
