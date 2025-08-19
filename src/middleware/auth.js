const { RevokedToken } = require('../models');
const { unauthorized } = require('../utils/responseHelper');
const { verifyAccessToken } = require('../config/auth');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return unauthorized(res, 'No token provided');

    // Verify JWT first
    const decoded = await verifyAccessToken(token);

    // Check if token is revoked
    const revoked = await RevokedToken.findOne({ where: { token } });
    if (revoked) return unauthorized(res, 'Token revoked. Please login again.');

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message || err);
    return unauthorized(res, 'Invalid or expired token');
  }
};
