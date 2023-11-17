const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// connecting to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/testgpt")
  .then((res) => console.log("db connect"))
  .catch((err) => console.log(err));

// static files folder
app.use(express.static("./public"));

// add body in requests
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// apis
app.use("/api", require("./router/api"));

// listen
app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
