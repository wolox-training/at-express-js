'use strict';
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first-name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last-name'
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
