// utils/socket.js

import { io } from "socket.io-client";

// 🔥 connect to backend
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"], // optional but better
});

export default socket;
