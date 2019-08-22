const { User } = require('../models');
const { notFoundError } = require('../errors');
const { userNotFoundErrorMessage, getUserFields } = require('../helpers');
const { port, host } = require('../../config').common.api;
const { api } = require('../../config').common;
const logger = require('../logger');

exports.getAllUsers = (getPage = 1) => () => {
  const page = parseInt(getPage);
  const offset = (page - 1) * api.pageSize;
  const limit = parseInt(api.pageSize);
  logger.info(api);
  logger.info(api.pageSize);

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
