const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blaclisttoken.model");

//User authorisation  middle ware
module.exports.userAuth = async (req, res, next) => {
  try {
    //Extract token from cookies / header authorisation
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    //Token not found return error
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    //Find the incoming token in blacklist table ,
    //Check the token entry is  not present in blacklist table
    const isBlacklisted = await blacklistTokenModel.find({ token });

    // console.log("isblacklist:", isBlacklisted);
    //If token is found in blacklist table ,
    //then user try to hit the api with the same token , which were logout
    if (isBlacklisted.length) {
      return res.status(401).json({ success: false, message: "Unauhtorized" });
    }

    //Decoding the incoming token , and extracting id  becasue we make encrypted token with database entries id
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    //find the if in user table
    const user = await userModel.findById(decode.id);

    //If somehow id not found in table , then the user is not present in out DB
    //return the error
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
