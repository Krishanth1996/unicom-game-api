const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const candidateRoute = require("./api/candidate");
const userRoute = require("./api/user");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Request-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT");
    return res.status(200).json({});
  }
  next();
});

app.use("/candidate", candidateRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  res.status(200).json({
    message: "demo app api Working",
  });
});

module.exports = app;
