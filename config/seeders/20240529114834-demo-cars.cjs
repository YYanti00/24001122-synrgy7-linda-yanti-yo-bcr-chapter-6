"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("cars", [
      {
        name: "Toyota",
        size: "Small",
        rentPerDay: 150000,
        status: "Available",
        image: "car01.min.jpg",
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
        isDelete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Suzuki",
        size: "Medium",
        rentPerDay: 150000,
        status: "Available",
        image: "car02.min.jpg",
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
        isDelete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Avanza",
        size: "Small",
        rentPerDay: 150000,
        status: "Available",
        image: "car03.min.jpg",
        createdBy: null,
        updatedBy: null,
        deletedBy: null,
        isDelete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("cars", null, {});
  },
};
