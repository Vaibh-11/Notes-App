// utils/socket.js

import { io } from "socket.io-client";

// 🔥 connect to backend
const socket = io("https://notes-app-production-e699.up.railway.app", {
  withCredentials: true,
  transports: ["websocket"], // optional but better
});

export default socket;
