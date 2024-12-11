const rideModel = require("../models/ride.model");
const { publishToQueue, subscribeToQueue } = require("../service/rabbit");

//CREATE RIDE CONTROLLER
module.exports.createRide = async (req, res) => {
  try {
    //extracting the data from req
    const { pickup, destination } = req.body;

    //creating the new ride entry in the db

    //*More Info
    //A Mongoose model allows you to interact with the database, like creating, reading, updating, or deleting records in the rides collection.

    //What is an Instance of a Model?
    //An instance of a model is just a single record or document that you’re preparing to save into your database. Think of it as a "row" in a SQL database.

    //When you do this:
    //const newRide = new rideModel({
    //   user: req.user._id,
    //   pickup: pickup,
    //   destination: destination,
    // });

    //You're saying:

    //"I want to create one new ride record" using the rideModel.
    //"Here’s the data for that new ride":
    //user is the user ID (who is creating the ride).
    //pickup is the starting location of the ride.
    //destination is the ride's ending location.

    //     How Does This Work?
    // 1. The new Keyword
    // In JavaScript, the new keyword is used to create a new object or instance of a class or function. Here, you’re using new to create an object (instance) of the rideModel class:
    //     Think of this as "filling out a form" with the ride details:

    // You're creating an object (newRide) that follows the schema defined in rideModel.
    // newRide = {
    //     user: "64bfe2309b1e4d6e4c8d1234", // Example user ID
    //     pickup: "Central Park, NY",
    //     destination: "Times Square, NY",
    //   };

    //At this point, the object is not yet saved in the database—it's only stored temporarily in your code (in memory).

    const newRide = new rideModel({
      user: req.user._id,
      pickup,
      destination,
    });

    // 2. Saving the Instance to the Database
    // After creating the ride instance, you save it to the database with:

    //save the new ride in db
    await newRide.save();

    //     What Happens Behind the Scenes?
    // When you call new rideModel({...}), Mongoose:

    // Creates a JavaScript object based on the schema you defined earlier (e.g., rideSchema).
    // Assigns default values for any fields with defaults (like createdAt).
    // Prepares the data for saving (validates it based on the schema rules).

    //     When you call .save(), Mongoose:

    // Validates the data against the schema to ensure it meets the requirements (e.g., all required fields are filled).
    // Connects to MongoDB (if a connection isn’t already open).
    // Sends an insert command to the database to create a new document in the rides collection.

    //Now after creating new ride , send to captain service by rabbit mq

    publishToQueue("new-ride", JSON.stringify(newRide));

    //return in the response
    res.status(200).json({
      success: true,
      message: "New ride creted successfully",
      newRide,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
