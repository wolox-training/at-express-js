'use strict';
const logger = require('../logger');
const { databaseError } = require('../errors');
const { dbErrorCodes } = require('../helpers');

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
      }
    },
    { underscored: true }
  );

  User.createUser = user =>
    User.create(user).catch(error => {
      logger.error(error);
      const { message, errorFn } = dbErrorCodes[error.name] || { message: 'Unable to create new user.' };
      if (errorFn) {
        throw errorFn(`Unable to create new user. ${message}`);
      }
      logger.error(message);
      throw databaseError('Unable to create new user.');
    });

  return User;
};
