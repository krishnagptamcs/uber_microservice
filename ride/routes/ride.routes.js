const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const rideController = require("../controller/ride.controller");
const router = express.Router();

//since ride is always taken by user ,
//so we need an authentication when ride booking comes
router.post("/create-ride", authMiddleware.userAuth, rideController.createRide);

module.exports = router;
