const express = require("express");
const router = express.Router();

//since ride is always taken by user ,
//so we need an authentication when ride booking comes
router.post("/create-ride");

module.exports = router;
