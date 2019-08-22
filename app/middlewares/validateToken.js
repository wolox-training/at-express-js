const { decodeToken } = require('../helpers');
const logger = require('../logger');
const { authenticationError } = require('../errors');

exports.validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    decodeToken(authorization);
    next();
  } catch (e) {
    logger.error(e);
    next(authenticationError('Invalid token'));
  }
};
