const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('./constants');
const { encryptionError } = require('../errors');

exports.hashPassword = obj =>
  bcrypt
    .hash(obj.password, SALT_ROUNDS)
    .then(password => ({ ...obj, password }))
    .catch(error => {
      throw encryptionError(error.message);
    });
