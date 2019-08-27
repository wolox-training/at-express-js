'use strict';
const { REGULAR_ROLE, ADMIN_ROLE } = require('../helpers');
const { handleError, prepareResponse } = require('../helpers/modelHelpers');

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
        defaultValue: REGULAR_ROLE
      }
    },
    { underscored: true }
  );

  User.createUser = user =>
    User.create(user)
      .then(prepareResponse)
      .catch(handleError('Unable to create new user'));

  User.createAdmin = user =>
    User.upsert({ ...user, role: ADMIN_ROLE }).catch(handleError(`Unable to create ${ADMIN_ROLE} user`));

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
