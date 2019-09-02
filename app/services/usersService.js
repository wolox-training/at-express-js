const moment = require('moment');
const { User } = require('../models');
const { notFoundError } = require('../errors');
const { userNotFoundErrorMessage, ADMIN_ROLE } = require('../helpers');
const { handleError } = require('./commons/errorHandler');
const { createToken } = require('../helpers');
const { sessionExpiration } = require('../../config').common.session;

exports.getAllUsers = (getPage, pageSize, offset, limit) =>
  User.getAll({ offset, limit }).catch(handleError('Unable to get users'));

exports.getUserById = id =>
  User.findBy({ id })
    .then(user => {
      if (!user) {
        throw notFoundError(userNotFoundErrorMessage);
      }
      return user;
    })
    .catch(handleError('Unable to find user'));

exports.getUserByEmail = email =>
  User.findBy({ email })
    .then(user => {
      if (!user) {
        throw notFoundError(userNotFoundErrorMessage);
      }
      return user;
    })
    .catch(handleError('Unable to find user'));
exports.createUser = user => User.create(user).catch(handleError('Unable to create new user'));

exports.createAdminUser = hashedUser =>
  User.createAdmin(hashedUser).catch(handleError(`Unable to create ${ADMIN_ROLE} user`));

exports.invalidateUserSessions = userId =>
  User.invalidateSessions(userId).catch(handleError('Unable to invalidate user sessions'));

exports.createSessionToken = user => {
  const today = new Date();
  const expirationDate = moment(today)
    .add(sessionExpiration)
    .toDate();

  return [
    createToken({
      userId: user.id,
      role: user.role,
      createdAt: today,
      expires: expirationDate
    }),
    expirationDate
  ];
};
