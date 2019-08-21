const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('./constants');
const { encryptionError, authenticationError } = require('../errors');
const { authenticationErrorMessage } = require('../helpers/constants');

exports.hashPassword = user =>
  bcrypt
    .hash(user.password, SALT_ROUNDS)
    .then(password => ({ ...user, password }))
    .catch(error => {
      throw encryptionError(error.message);
    });

exports.comparePassword = ({ user, sentUser }) =>
  bcrypt
    .compare(user.password, sentUser.password)
    .then(arePasswordEql => {
      if (arePasswordEql) {
        return user;
      }
      throw authenticationError(authenticationErrorMessage);
    })
    .catch(error => {
      if (error.message === authenticationErrorMessage) {
        throw authenticationError(authenticationErrorMessage);
      }
      throw encryptionError(error.message);
    });
