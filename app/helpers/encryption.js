const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('./constants');

exports.hashPassword = user =>
  bcrypt.hash(user.password, SALT_ROUNDS).then(password => ({ ...user, password }));

exports.comparePassword = ({ user, password }) => bcrypt.compare(password, user.password);
