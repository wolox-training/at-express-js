const logger = require('../logger');
const { User } = require('../models');
const { createToken } = require('../helpers');
const { hashPassword, comparePassword } = require('../services/encryption');
const { usernameNotFoundErrorMessage, authenticationErrorMessage } = require('../helpers');
const { authenticationError } = require('../errors');
const { getAllUsers, getUserById } = require('../services/usersService');

exports.signUp = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  return hashPassword({ firstName, lastName, email, password })
    .then(hashedUser => User.createUser(hashedUser))
    .then(result => {
      logger.info(`A user '${result.firstName}' has been created`);
      res.status(201).send({ userId: result.id });
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
      return Promise.all([comparePassword({ user, password }), user]);
    })
    .then(([arePasswordEql, user]) => {
      if (!arePasswordEql) {
        throw authenticationError(authenticationErrorMessage);
      }
      const token = createToken({ userId: user.id, role: user.role });
      res.set('authorization', token).end();
    })
    .catch(error => {
      logger.error(error);
      next(error);
    });
};

exports.getUsers = (req, res, next) => {
  const { id } = req.params;
  const { page, pageSize } = req.query;
  const selectGetFn = id ? getUserById : getAllUsers(page, pageSize);
  return selectGetFn(id)
    .then(response => res.send(response))
    .catch(next);
};

exports.createAdmin = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const userCreatedResponse = name => {
    logger.info(`A user '${name}' has been created`);
    res.status(201).end();
  };
  const userUpdatedResponse = name => {
    logger.info(`A user '${name}' has been updated`);
    res.end();
  };

  const setAdmin = hashedUser => User.createAdmin(hashedUser);
  const respond = created => (created ? userCreatedResponse() : userUpdatedResponse());

  return hashPassword({ firstName, lastName, email, password })
    .then(setAdmin)
    .then(respond)
    .catch(next);
};
