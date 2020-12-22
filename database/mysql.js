// const knex = require("knex")({
//   client: "mysql",
//   connection: {
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "angulardemo",
//     // timezone: "UTC",
//     // dateStrings: true,
//   },
// });

var mysql = require("mysql");
var mysql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "angulardemo",
});

module.exports = mysql;
