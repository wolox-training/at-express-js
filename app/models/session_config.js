'use-strict';
module.exports = (sequelize, DataTypes) => {
  const SessionsConfig = sequelize.define(
    'SessionsConfig',
    {
      duration: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      config: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      }
    },
    { underscored: true }
  );

  SessionsConfig.update = (duration, config) => SessionsConfig.upsert({ duration, config });

  SessionsConfig.removeAttribute('id');
  return SessionsConfig;
};
