const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('./constants');
const { encryptionError, authenticationError, AUTHENTICATION_ERROR } = require('../errors');
const { authenticationErrorMessage } = require('../helpers');

const sendError = error => {
  if (error.internalCode === AUTHENTICATION_ERROR) {
    throw authenticationError(error.message);
  }
  throw encryptionError(error.message);
};

exports.hashPassword = user =>
  bcrypt
    .hash(user.password, SALT_ROUNDS)
    .then(password => ({ ...user, password }))
    .catch(sendError);

exports.comparePassword = ({ user, sentUser }) =>
  bcrypt
    .compare(sentUser.password, user.password)
    .then(arePasswordEql => {
      if (arePasswordEql) {
        return user;
      }
      throw authenticationError(authenticationErrorMessage);
    })
    .catch(sendError);
