const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "angulardemo",
    // timezone: "UTC",
    // dateStrings: true,
  },
});

module.exports = knex;
