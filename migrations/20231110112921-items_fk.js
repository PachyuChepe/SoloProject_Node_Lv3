"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Items", "user_id", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addConstraint("Items", {
      fields: ["user_id"],
      type: "foreign key",
      name: "user_id_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Items", "user_id");
  },
};
