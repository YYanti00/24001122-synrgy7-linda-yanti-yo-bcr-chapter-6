"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = 10;
    return await queryInterface.bulkInsert("users", [
      {
        name: "Tom Key",
        email: "tom@gmail.com",
        password: await bcrypt.hash("tom", salt),
        role: "user",
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Christian Holder",
        email: "christian@gmail.com",
        password: await bcrypt.hash("christian", salt),
        role: "admin",
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "superadmin",
        email: "superadmin@gmail.com",
        password: await bcrypt.hash("superadmin", salt),
        role: "superadmin",
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
