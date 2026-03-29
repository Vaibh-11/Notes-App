const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const app = require("./app");

const connection = require("./config/databaseConnection");

const setupSocket = require("./socket/socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  },
});

setupSocket(io, connection);

const WEBPORT = process.env.WEBPORT || 5000;

server.listen(WEBPORT, () => {
  console.log(`Web Server running on port ${WEBPORT}`);
});
