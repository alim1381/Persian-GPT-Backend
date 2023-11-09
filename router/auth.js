const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/login", AuthController.login.bind(AuthController));
router.post("/register", AuthController.register.bind(AuthController));

module.exports = router;
