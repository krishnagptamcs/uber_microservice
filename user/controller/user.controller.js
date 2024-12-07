const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//USER REGISTER CONTROLLER
module.exports.register = async (req, res) => {
  try {
    //Extracting the name , email , password from body
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });

    //Checking in our DB that email already not exsist
    if (user) {
      return res.status(400).json({ message: "User already present" });
    }

    //To create new user , hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    //Save the new user to DB
    const newUser = new userModel({ name, email, password: hashPassword });

    await newUser.save();

    //Creating the JWT token to be send in response
    //To  creat token , take and DB entries id and JWT secret and set the expire time of 1hr ,

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    res
      .status(200)
      .json({ success: true, message: "User register succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
