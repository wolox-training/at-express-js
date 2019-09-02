const { createToken } = require('../helpers');
const { comparePassword } = require('../services/encryption');
const { authenticationErrorMessage } = require('../helpers');
const { authenticationError, NOT_FOUND_ERROR } = require('../errors');
const { getUserByEmail } = require('../services/usersService');
const logger = require('../logger');
const { createSession, invalidateAllSessions } = require('../services/sessions');

exports.signIn = (req, res, next) => {
  const { email, password } = req.body;

  return getUserByEmail(email)
    .then(user => Promise.all([comparePassword({ user, password }), user]))
    .then(([arePasswordEql, user]) => {
      if (!arePasswordEql) {
        throw authenticationError(authenticationErrorMessage);
      }
      const token = createToken({ userId: user.id, role: user.role });
      return Promise.all([createSession(user.id), token]);
    })
    .then(result => res.set('authorization', result[1]).end())
    .catch(error => {
      logger.error(error);
      if (error.internalCode === NOT_FOUND_ERROR) {
        return next(authenticationError(authenticationErrorMessage));
      }
      return next(error);
    });
};

exports.invalidateSessions = (req, res, next) =>
  invalidateAllSessions(req.locals.userId)
    .then(() => res.status(204).end())
    .catch(next);
