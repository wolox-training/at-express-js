const { decodeToken } = require('../helpers');
const logger = require('../logger');
const { authenticationError } = require('../errors');

exports.validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = decodeToken(authorization);
    req.locals = { ...req.locals, ...token };
    next();
  } catch (e) {
    logger.error(e);
    next(authenticationError('Invalid token'));
  }
};
