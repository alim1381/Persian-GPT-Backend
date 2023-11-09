const express = require("express");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

// connecting to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/testgpt")
  .then((res) => console.log("db connect"))
  .catch((err) => console.log(err));

// static files folder
app.use(express.static("./public"));

// add body in requests
app.use(express.urlencoded({ extended: false }));

// apis
app.use("/api", require("./router/api"));

// listen
app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
