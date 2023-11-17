const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

// register and login
router.post("/login", AuthController.login.bind(AuthController));
router.post("/register", AuthController.register.bind(AuthController));

// refresh token
router.get("/verifytoken", AuthController.verifyToken.bind(AuthController));

module.exports = router;
