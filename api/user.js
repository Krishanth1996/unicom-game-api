const express = require("express");
const { route } = require("../app");
const router = express.Router();

const mysql = require("../database/mysql");
const knex = require("../database/knex");

router.post("/login", (req, res, next) => {
  knex
    .select()
    .from("user")
    .where({ name: req.body.name, pass: req.body.pass })
    .then((data) => {
      res.send(data);
    });
});

//to get total items

itemCount = 0;
knex("item")
  .count("id as total")
  .then((data) => {
    itemCount = data[0].total;
    // console.log(itemCount);
  });

router.post("/itemPrimary", (req, res, next) => {
  unique = [];
  while (unique.length < itemCount) {
    x = Math.floor(Math.random() * itemCount) + 1;
    if (unique.includes(x)) {
      //do nothing
    } else {
      unique.push(x);
      console.log(unique);
    }
  }
  for (let index = 0; index <= itemCount; index++) {
    if (unique.length == itemCount) {
      knex("user")
        .where({ id: index + 1 })
        .update({ itemPrimary: unique[index] })
        .then((data) => {
          res.status(200).json({
            message: "Primary Item Allocated",
          });
        });
    }
  }
});

router.post("/exchange", (req, res, next) => {
  mysql.query(
    "UPDATE user as u1,  user as u2 SET u1.itemPrimary = u2.itemPrimary, u2.itemPrimary = u1.itemPrimary WHERE u1.id =" +
      req.body.from +
      " AND u2.id =" +
      req.body.to,
    function (error, data, fields) {
      res.send({
        Message: "Item Exchanged",
      });
    }
  );
});

router.post("/finish", (req, res, next) => {
  knex("user")
    .update({ itemPrimary: null, item2: null, item3: null, battle: 5 })
    .then((data) => {
      mysql.query("update item set battle=3", function (error, data, fields) {
        res.send(data);
      });
    });
});

router.get("/all", (req, res, next) => {
  knex
    .select()
    .from("user")
    .then((data) => {
      res.send(data);
    });
});

router.post("/battle/itemChance", (req, res, next) => {
  enemy = req.body.enemy;
  allies = req.body.allies;
  mysql.query(
    "SELECT (select battle from user where id=" +
      allies +
      ") as userBattle, item.battle FROM user u LEFT JOIN item ON u.itemPrimary = item.id WHERE u.id=" +
      enemy,
    function (error, data, fields) {
      res.send(data);
    }
  );
});

router.post("/battle", (req, res, next) => {
  var allies = req.body.allies;
  var enemy = req.body.enemy;
  var winner = req.body.winner;

  if (winner != enemy) {
    knex
      .select()
      .from("user")
      .where({ id: enemy })
      .then((data) => {
        mysql.query(
          "update user set battle=battle-1, item3 =  (case when ( item2 is not null and item3 is null ) then '" +
            data[0].itemPrimary +
            "' else item3 end  ) , item2 = (case when (item2 is null ) then '" +
            data[0].itemPrimary +
            "' else item2 end) WHERE battle>0 AND id=" +
            allies,
          function (error, data, fields) {}
        );
        mysql.query(
          "update item set battle=battle-1 WHERE battle>0 AND id=" +
            data[0].itemPrimary,
          function (error, data, fields) {}
        );
      });
  } else {
    mysql.query(
      "update user set battle=battle-1 WHERE battle>0 AND id=" + allies,
      function (err, data, fields) {}
    );

    console.log("Defeated");
  }
});

router.post("/newuser", (req, res, next) => {
  knex("user")
    .insert({
      name: req.body.name,
      pass: req.body.pass,
      battle: "5",
    })
    .then((data) => {
      res.send({
        Message: "User Created",
      });
    });
});

router.post("/newitem", (req, res, next) => {
  knex("item")
    .insert({
      name: req.body.name,
      imgUrl: req.body.url,
      battle: "3",
    })
    .then((data) => {
      res.send({
        Message: "Item Created",
      });
    });
});

router.get("/cards", (req, res, next) => {
  mysql.query(
    "SELECT u.id,u.name,u.battle,u.isAdmin,(SELECT name FROM item WHERE id = u.itemPrimary) AS primaryItem,(SELECT image FROM item WHERE id = u.itemPrimary) AS primaryItemImage,(SELECT image FROM item WHERE id = u.item2) AS Item2Image,(SELECT image FROM item WHERE id = u.item3) AS Item3Image,(SELECT name FROM item WHERE id = u.item2) AS item2,(SELECT name FROM item WHERE id = u.item3) AS item3,(SELECT imgUrl FROM item WHERE id = u.itemPrimary) as imgUrlPrimary,(SELECT imgUrl FROM item WHERE id = u.item2) as imgUrlItem2,(SELECT imgUrl FROM item WHERE id = u.item3) as imgUrlItem3 FROM user u WHERE u.itemPrimary IS NOT NULL",
    function (error, data, fields) {
      res.send(data);
    }
  );
});

module.exports = router;
