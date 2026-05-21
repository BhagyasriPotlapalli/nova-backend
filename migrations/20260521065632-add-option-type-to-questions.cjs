'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      "Questions",
      "type",
      {
        type: Sequelize.ENUM("TEXT", "IMAGE"),
        defaultValue: "TEXT",
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      "Questions",
      "type"
    );

  }

};