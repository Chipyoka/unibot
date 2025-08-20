const { DepressionAssessment } = require('../models');

// Map total PHQ-9 score to severity
function getSeverity(score) {
  if (score <= 4) return 'none';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  if (score <= 19) return 'moderately severe';
  return 'severe';
}

module.exports = {
  // Submit a new assessment
  async submitAssessment(req, res) {
    try {
      const { answers } = req.body; // array of 9 numbers (0-3)
      if (!answers || answers.length !== 9) {
        return res.status(400).json({ error: 'PHQ-9 requires 9 answers' });
      }

      const score = answers.reduce((sum, val) => sum + val, 0);
      const severity = getSeverity(score);

      const assessment = await DepressionAssessment.create({
        userId: req.user.id,
        score,
        severity,
        completedAt: new Date()
      });

      return res.status(201).json({ message: 'Assessment submitted', assessment });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to submit assessment' });
    }
  },

  // Get past assessments
  async getAssessments(req, res) {
    try {
      const assessments = await DepressionAssessment.findAll({
        where: { userId: req.user.id },
        order: [['completedAt', 'DESC']]
      });

      return res.json({ assessments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  }
};
