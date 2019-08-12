'use strict';
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
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
