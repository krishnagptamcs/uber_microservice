const express = require("express");

const router = express.Router();
const userController = require("../controller/user.controller");

//Assign the controller on the router '/register'
router.post("/register", userController.register);

module.exports = router;
