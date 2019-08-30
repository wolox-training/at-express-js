'use strict';

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        }
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { underscored: true }
  );

  Session.remove = query => Session.destroy({ where: { ...query } });
  Session.createSession = ({ token, userId }) => Session.findOrCreate({ where: { userId, token } });
  Session.findBy = query => Session.findOne({ where: { ...query } });
  Session.removeAttribute('id');
  return Session;
};
