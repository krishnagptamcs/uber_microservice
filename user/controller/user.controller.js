const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blaclisttoken.model");

//USER REGISTER CONTROLLER
module.exports.register = async (req, res) => {
  try {
    //Extracting the name , email , password from body
    // console.log("request body:", req.body);
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

    //it delete the passoword key from user , while send in response
    delete newUser._doc.password;

    //After creating entry send in the response
    res.status(200).json({
      success: true,
      message: "User register succesfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//USER LOGIN CONTROLLER
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user in DB, and take the password using 'select' method
    const user = await userModel.findOne({ email }).select("+password");

    //User not found return error message
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user name or password" });
    }

    //Match the body password with DB saved password
    //Decrypt the password and match
    const isMatch = await bcrypt.compare(password, user.password);

    //If password not matched , return invalid message
    if (!isMatch) {
      return res.status(400).json({
        sucees: false,
        message: "Invalid email or password",
      });
    }

    //If user found make token to send in the response
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //it delete the passoword key from user , while send in response
    delete user._doc.password;

    res.cookie("token", token);

    //After Login send in the response
    res.status(200).json({
      success: true,
      message: "Login Succesfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//USER LOGOUT CONTROLLER
module.exports.logout = async (req, res) => {
  try {
    //getting token value from header cookie
    const token = req.cookies.token;

    //Creating the token in blacklist table entry
    await blacklistTokenModel.create({ token });

    res.clearCookie("token");
    res.send({ success: true, message: "User logout succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//USER PROFILE CONTROLLER
module.exports.profile = async (req, res) => {
  try {
    //Deleting password before sending in response
    delete req.user._doc.password;
    res.send(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
