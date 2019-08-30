const { decodeToken } = require('../helpers');
const { authenticationError, sessionExpiredError } = require('../errors');
const { Session } = require('../models');

exports.validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const findSession = sessionData =>
    Promise.all([Session.findBy({ userId: sessionData.userId, token: authorization }), sessionData]);
  const checkSession = ([session, sessionData]) => {
    if (!session) {
      throw sessionExpiredError('Your session has been closed');
    }
    return { role: sessionData.role, userId: sessionData.userId };
  };

  return decodeToken(authorization)
    .then(findSession)
    .then(checkSession)
    .then(({ role, userId }) => {
      req.locals = { ...req.locals, role, userId };
      next();
    })
    .catch(error => {
      if (error.internalCode) {
        return next(error);
      }
      return next(authenticationError('Invalid token'));
    });
};
