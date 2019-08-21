const { User } = require('../models');
const { comparePassword, usernameNotFoundErrorMessage, invalidPasswordMessage } = require('../helpers');
const { authenticationError } = require('../errors');

exports.validatePassword = (req, res, next) => {
  const { email, password } = req.body;

  return User.findByEmail(email)
    .then(user => {
      if (!user) {
        throw authenticationError(usernameNotFoundErrorMessage);
      }
      return comparePassword({ user, password });
    })
    .then(passwordCheck => {
      if (passwordCheck) {
        next();
      }
      next(authenticationError(invalidPasswordMessage));
    });
};
