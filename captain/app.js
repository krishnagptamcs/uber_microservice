const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const userRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");
const connectDb = require("./db/db");

//Function which connect to DB
connectDb();

//Definig some  middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRoutes);

module.exports = app;
