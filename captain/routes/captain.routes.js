const express = require("express");
const router = express.Router();
const captainController = require("../controller/captain.controller");
const authMiddleWare = require("../middleware/authMiddleware");

router.post("/register", captainController.register); //Assign the controller on the router '/register'
router.post("/login", captainController.login); //Assign the controller on the router '/login'
router.get("/logout", captainController.logout); //Assign the controller on the router '/logout'
router.get("/profile", authMiddleWare.userAuth, captainController.profile); //Assign the controller on the router '/profile'
router.put(
  "/toggle-availbilty",
  authMiddleWare.userAuth,
  captainController.toggleAvailbilty
); // update the captain availbilty status

module.exports = router;
