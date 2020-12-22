const express = require("express");
const { route } = require("../app");
const router = express.Router();

const knex = require("../database/knex");

// router.post("/login", (req, res) => {
//   knex("user")
//     .where("name", "=", req.body.username)
//     .then((err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: "Incorrect user." });
//       }
//       if (!user.isValid(req.body.password)) {
//         return done(null, false, { message: "Incorrect password." });
//       }
//       return done(null, user);
//     });
// });

router.post("/new", (req, res) => {
  knex("candidates")
    .max("inEnd as maxTime")
    .then((data) => {
      var minutesToAdd = 30;
      var minutesToNextDay = 900;
      var minutesToNextTomow = 540;
      var dateTime = new Date(data[0].maxTime);
      var tomorrow = new Date();
      tomorrow.setDate(dateTime.getDate() + 1);

      console.log("Last Recod :" + dateTime.toString());

      console.log("Tomorrow Date :" + tomorrow.toString());

      var timeNew =
        tomorrow.getHours() +
        ":" +
        tomorrow.getMinutes() +
        ":" +
        tomorrow.getSeconds();

      var time =
        dateTime.getHours() +
        ":" +
        dateTime.getMinutes() +
        ":" +
        dateTime.getSeconds();
      console.log("Time : " + time);
      if (dateTime.getHours() < "17") {
        var dateTimeNew = dateTime;
        var futureDate = new Date(dateTime.getTime() + minutesToAdd * 60000);

        // console.log("Today Start:" + dateTimeNew.toString("YYYY-MM-dd"));
        // console.log("Today End:" + futureDate.toString("YYYY-MM-dd"));
      } else {
        var dateTimeNew = new Date(
          dateTime.getTime() + minutesToNextDay * 60000
        );
        var futureDate = new Date(dateTimeNew.getTime() + minutesToAdd * 60000);
        // console.log("Tomorrow Start:" + dateTimeNew.toString("YYYY-MM-dd"));
        // console.log("Tomorrow END :" + futureDate.toString("YYYY-MM-dd"));
      }

      knex("candidates")
        .insert({
          name: req.body.name,
          email: req.body.email,
          contact: req.body.contact,
          inStart: dateTimeNew,
          inEnd: futureDate,
          status: "1",
        })
        .then((data) => {
          res.status(200).json({
            Message: "asdsad",
          });
        });
    });
});

router.get("/all", (req, res, next) => {
  knex
    .select()
    .from("candidates")
    .where({ status: "1" })
    .then((data) => {
      res.send({ data });
    });
});

router.get("/login", (req, res, next) => {
  knex("user")
    .where("name", "=", req.body.username)
    .then((err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect user." });
      }
      if (!user.isValid(req.body.password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
});

router.get("/:id", (req, res, next) => {
  knex
    .select()
    .from("candidates")
    .where("id", req.params.id)
    .then((data) => {
      res.status(200).json(data[0]);
    });
});

router.put("/update", (req, res) => {
  knex("candidates")
    .where({ id: req.body.id })
    .update(req.body)
    .then((data) => {
      res.status(200).json({
        message: "Candidates updated",
      });
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  // knex("candidates")
  //   .where({ id: id })
  //   .del()
  //   .then((data) => {
  //     res.status(200).json({
  //       message: "Candidate Deleted",
  //     });
  //   });
  knex("candidates")
    .where({ id: req.params.id })
    .update({ status: "0" })
    .then((data) => {
      res.status(200).json({
        message: "Candidates updated",
      });
    });
});

module.exports = router;
