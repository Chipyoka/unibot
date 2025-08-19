const router = require('express').Router();
const { validate } = require('../middleware/validation');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { register, login, me, logout } = require('../controllers/authController');
const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().min(2).max(120).required(),
  role: Joi.string().valid('student', 'counsellor', 'admin').default('student')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', auth, me);
router.post('/logout', auth, logout);


module.exports = router;
