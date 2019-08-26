const { User } = require('../models');
const { notFoundError } = require('../errors');
const { userNotFoundErrorMessage } = require('../helpers');
const { extractFields, paginatedResponse } = require('../serializers');
const { userSchema } = require('../schemas/userSchema');

const getUserFields = extractFields(userSchema, 'password');

exports.getAllUsers = (getPage = 1, pageSize = 10) => () => {
  const page = parseInt(getPage);
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  const prepareResponse = paginatedResponse({ resource: 'users', offset, limit, page });

  return User.getAll({ offset, limit }).then(prepareResponse);
};

exports.getUserById = id =>
  User.findBy({ id }).then(user => {
    if (!user) {
      throw notFoundError(userNotFoundErrorMessage);
    }
    return getUserFields(user);
  });
