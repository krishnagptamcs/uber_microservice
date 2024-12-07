const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const authMiddleWare = require("../middleware/authMiddleware");

router.post("/register", userController.register); //Assign the controller on the router '/register'
router.post("/login", userController.login); //Assign the controller on the router '/login'
router.get("/logout", userController.logout); //Assign the controller on the router '/logout'
router.get("/profile", authMiddleWare.userAuth, userController.profile); //Assign the controller on the router '/profile'

module.exports = router;
