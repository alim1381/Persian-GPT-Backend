const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const tokenSeparator = require("./tokenSeparator");
const User = require("../models/user");

router.use(tokenSeparator, (req, res, next) => {
  jwt.verify(req.token, process.env.TOKEN_SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403).json({
        message: "توکن منقضی شده",
        success: false,
      });
    } else {
      let user = await User.findById(authData.id);
      req.userData = user;
      next();
    }
  });
});

module.exports = router;
