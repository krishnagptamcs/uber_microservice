const captainModel = require("../models/captain.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blaclisttoken.model");

//CAPTAIN REGISTER CONTROLLER
module.exports.register = async (req, res) => {
  try {
    //Extracting the name , email , password from body
    // console.log("request body:", req.body);
    const { name, email, password } = req.body;
    const user = await captainModel.findOne({ email });

    //Checking in our DB that email already not exsist
    if (user) {
      return res.status(400).json({ message: "Captain already present" });
    }

    //To create new user , hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    //Save the new user to DB
    const newCaptain = new captainModel({
      name,
      email,
      password: hashPassword,
    });

    await newCaptain.save();

    //Creating the JWT token to be send in response
    //To  creat token , take and DB entries id and JWT secret and set the expire time of 1hr ,

    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    //it delete the passoword key from user , while send in response
    delete newCaptain._doc.password;

    //After creating entry send in the response
    res.status(200).json({
      success: true,
      message: "Captain register succesfully",
      captain: newCaptain,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//CAPTAIN LOGIN CONTROLLER
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user in DB, and take the password using 'select' method
    const captain = await captainModel.findOne({ email }).select("+password");

    //captain not found return error message
    if (!captain) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid captain name or password" });
    }

    //Match the body password with DB saved password
    //Decrypt the password and match
    const isMatch = await bcrypt.compare(password, captain.password);

    //If password not matched , return invalid message
    if (!isMatch) {
      return res.status(400).json({
        sucees: false,
        message: "Invalid email or password",
      });
    }

    //If captain found make token to send in the response
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //it delete the passoword key from captain , while send in response
    delete captain._doc.password;

    res.cookie("token", token);

    //After Login send in the response
    res.status(200).json({
      success: true,
      message: "Login Succesfully",
      captain,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//CAPTAIN LOGOUT CONTROLLER
module.exports.logout = async (req, res) => {
  try {
    //getting token value from header cookie
    const token = req.cookies.token;

    //Creating the token in blacklist table entry
    await blacklistTokenModel.create({ token });

    res.clearCookie("token");
    res.send({ success: true, message: "Captain logout succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//CAPTAIN PROFILE CONTROLLER
module.exports.profile = async (req, res) => {
  try {
    //Deleting password before sending in response
    delete req.captain._doc.password;
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//CAPTAIN AVAILIBILTY
module.exports.toggleAvailbilty = async (req, res) => {
  try {
    //Find the captain in db
    const captain = await captainModel.findById(req.captain._id);

    //Captian not found throw the error
    if (!captain) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Captain" });
    }
    //if captain found then change its availbilty option
    captain.isAvailable = !captain.isAvailable;

    //save the changed status in db
    await captain.save();

    res.status(200).send({
      success: true,
      message: "Availibilty status changed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
