const express = require("express");
const expressProxy = require("express-http-proxy");

const app = express();

//when any req. coming to user route , redirect to this port
app.use("/user", expressProxy("http://localhost:3001"));
app.use("/captain", expressProxy("http://localhost:3002"));

app.listen(3000, () => {
  console.log("Gateway server listing on port 3000");
});
