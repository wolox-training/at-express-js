'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Albums', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      album_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      }
    }),

  down: queryInterface => queryInterface.dropTable('Albums')
};
