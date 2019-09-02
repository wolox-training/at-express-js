'use strict';

module.exports = {
  up: queryInterface => queryInterface.removeColumn('Sessions', 'token'),
  down: queryInterface => queryInterface.addColumn('Sessions', 'token')
};
