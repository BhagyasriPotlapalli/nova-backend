'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Topics",
      "codeBase",
      {
        type: Sequelize.TEXT("long"),
        allowNull: true, // optional but recommended
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "Topics",
      "codeBase"
    );
  }
};