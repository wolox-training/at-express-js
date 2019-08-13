'use strict';
const logger = require('../logger');
const { databaseError } = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
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
    {}
  );

  User.createUser = user =>
    User.create(user).catch(error => {
      const { message } = error.errors[0];
      logger.error(message);
      throw databaseError(`Unable to create new user. ${message}`);
    });

  return User;
};
