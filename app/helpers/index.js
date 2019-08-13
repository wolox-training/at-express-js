const bcrypt = require('bcryptjs');
const { encryptionError } = require('../errors');
const saltRounds = 10;
exports.hashPassword = obj =>
  bcrypt
    .hash(obj.password, saltRounds)
    .then(password => ({ ...obj, password }))
    .catch(error => {
      throw encryptionError(error.message);
    });
