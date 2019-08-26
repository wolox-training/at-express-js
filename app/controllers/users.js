const logger = require('../logger');
const { User } = require('../models');
const { hashPassword, createToken } = require('../helpers');
const { getAllUsers, getUserByEmail } = require('../services/usersService');
const { comparePassword, usernameNotFoundErrorMessage, authenticationErrorMessage } = require('../helpers');
const { authenticationError } = require('../errors');

exports.signUp = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  return hashPassword({ firstName, lastName, email, password })
    .then(hashedUser => User.createUser(hashedUser))
    .then(result => {
      logger.info(`A user '${result.firstName}' has been created`);
      res.status(201).end();
    })
    .catch(error => {
      logger.error(error.message);
      next(error);
    });
};

exports.signIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findBy({ email })
    .then(user => {
      if (!user) {
        throw authenticationError(usernameNotFoundErrorMessage);
      }
      return comparePassword({ user, password });
    })
    .then(arePasswordEql => {
      if (!arePasswordEql) {
        throw authenticationError(authenticationErrorMessage);
      }
      const token = createToken(req.body.email);
      res.set('authorization', token).end();
    })
    .catch(error => {
      logger.error(error);
      next(error);
    });
};

exports.getUsers = (req, res, next) => {
  const { email } = req.params;
  const { page } = req.query;
  const selectGetFn = email ? getUserByEmail : getAllUsers(page);
  return selectGetFn(email)
    .then(response => res.send(response))
    .catch(next);
};
