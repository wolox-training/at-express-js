const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('./constants');
const { encryptionError } = require('../errors');
const logger = require('../logger');

exports.hashPassword = user =>
  bcrypt
    .hash(user.password, SALT_ROUNDS)
    .then(password => ({ ...user, password }))
    .catch(error => {
      logger.error(error.message);
      throw encryptionError(error.message);
    });

exports.comparePassword = ({ user, password }) =>
  bcrypt.compare(password, user.password).catch(error => {
    logger.error(error.message);
    throw encryptionError(error.message);
  });
