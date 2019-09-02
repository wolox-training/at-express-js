'use strict';

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    { underscored: true }
  );

  Session.remove = userId => Session.destroy({ where: { userId } });
  Session.createSession = userId => Session.create({ userId });
  Session.findBy = userId => Session.findOne({ where: { userId } });
  Session.removeAttribute('id');
  return Session;
};
