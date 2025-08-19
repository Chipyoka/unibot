const { RevokedToken, User, sequelize } = require('../models');
const { hash, compare } = require('../utils/encryption');
const { signAccessToken } = require('../config/auth');
const { ok, created, badRequest, serverError } = require('../utils/responseHelper');

async function register(req, res) {
  const t = await sequelize.transaction();
  try {
    const { email, password, fullName, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) { await t.rollback(); return badRequest(res, 'Email already registered'); }

    const passwordHash = await hash(password);
    const user = await User.create({ email, passwordHash, fullName, role }, { transaction: t });
    await t.commit();
    return created(res, user.toSafeJSON());
  } catch (e) {
    await t.rollback();
    return serverError(res, e.message);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) return badRequest(res, 'Invalid credentials');

    const okPass = await compare(password, user.passwordHash);
    if (!okPass) return badRequest(res, 'Invalid credentials');

    const token = signAccessToken({ sub: user.id, role: user.role });
    return ok(res, { token, user: user.toSafeJSON() });
  } catch (e) {
    return serverError(res, e.message);
  }
}

async function me(req, res) {
  try {
    const user = await User.findByPk(req.user.sub);
    return ok(res, user ? user.toSafeJSON() : null);
  } catch (e) {
    return serverError(res, e.message);
  }
}

async function logout(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return badRequest(res, 'Token required');

    const decoded = req.user; // set by middleware
    if (!decoded) return badRequest(res, 'Invalid token');

    const expiresAt = new Date(decoded.exp * 1000);

    await RevokedToken.create({ token, expiresAt });
    return ok(res, { message: 'Logged out successfully' });
  } catch (e) {
    return serverError(res, e.message);
  }
}

module.exports = { register, login, me, logout };
