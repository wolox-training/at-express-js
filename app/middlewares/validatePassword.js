const logger = require('../logger');
const { User } = require('../models');
const { comparePassword, usernameNotFoundErrorMessage } = require('../helpers');
const { authenticationError } = require('../errors');

exports.validatePassword = (req, res, next) => {
  const { email, password } = req.body;

  return User.findByEmail(email)
    .then(user => {
      if (!user) {
        throw authenticationError(usernameNotFoundErrorMessage);
      }
      return Promise.all([comparePassword({ user, password }), user]);
    })
    .then(([arePasswordsEqual, user]) => {
      if (arePasswordsEqual) {
        req.locals = { ...req.locals, role: user.role };
        next();
      }
    })
    .catch(error => {
      logger.error(error);
      next(error);
    });
};
