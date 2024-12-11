const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports.userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //If token found then we decode it
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    //after decode , we will get the _id , of a user
    //coz in decode with bcrypt the _id with jwt_secret

    //*Microservice synchronus communication
    //Since here we are using micro service architecture , so every server has it own db also ,
    //therefore the user servcie have seperate db of user ,
    //so the id we are getting we can not use here in  "ride" db ,
    //we need to make a api call to user server , to get the user profile
    //this is synchronus way of communication in microservice

    //Making an api call to profile , by sending token in the headers
    const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response.data;

    if (!user) {
      // if user not found
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //if user found then return
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
