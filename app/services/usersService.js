const { User } = require('../models');
const { notFoundError } = require('../errors');
const { userNotFoundErrorMessage, getUserFields } = require('../helpers');
const { port, host, pageSize } = require('../../config').common.api;

exports.getAllUsers = (getPage = 1) => () => {
  const page = parseInt(getPage);
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  return User.getAll({ offset, limit }).then(response => {
    const areNext = offset + limit < response.count;

    return {
      count: response.count,
      result: getUserFields(response.rows),
      prev: page > 1 ? `${host}:${port}/users?page=${page - 1}` : null,
      next: areNext ? `${host}:${port}/users?page=${page + 1}` : null
    };
  });
};

exports.getUserByEmail = email =>
  User.findByEmail(email).then(user => {
    if (!user) {
      throw notFoundError(userNotFoundErrorMessage);
    }
    return getUserFields(user);
  });
