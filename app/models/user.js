'use strict';
const logger = require('../logger');
const { databaseError } = require('../errors');
const { dbErrorCodes } = require('../helpers');
const { extractField } = require('../serializers');

const handleError = genericMessage => error => {
  logger.error(error.message);
  const { message, errorFn } = dbErrorCodes[error.name] || { message: genericMessage };
  if (errorFn) {
    throw errorFn(`${genericMessage}. ${message}`);
  }
  logger.error(message);
  throw databaseError(genericMessage);
};

const prepareResponse = extractField('dataValues');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'regular'
      }
    },
    { underscored: true }
  );

  User.createUser = user =>
    User.create(user)
      .then(prepareResponse)
      .catch(handleError('Unable to create new user'));

  User.createAdmin = user =>
    User.upsert({ ...user, role: 'admin' }).catch(handleError('Unable to create admin'));

  User.findBy = query =>
    User.findOne({ where: { ...query } })
      .then(prepareResponse)
      .catch(handleError('Unable to find user'));

  User.getAll = ({ offset, limit }) =>
    User.findAndCountAll({ offset, limit })
      .then(result => ({
        count: result.count,
        rows: prepareResponse(result.rows)
      }))
      .catch(handleError('Unable to get users'));

  return User;
};
