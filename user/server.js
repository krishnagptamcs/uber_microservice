const http = require("http");
const app = require("./app");

const server = http.createServer(app);

server.listen(3001, () => {
  console.log("User servcie is running on PORT:3001");
});
