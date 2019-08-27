const { decodeToken } = require('../helpers');
const logger = require('../logger');
const { authenticationError } = require('../errors');

exports.validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = decodeToken(authorization);
    req.locals = { ...req.locals, role: token.role, userId: token.userId };
    next();
  } catch (e) {
    logger.error(e);
    next(authenticationError('Invalid token'));
  }
};
