// utils/socket.js

import { io } from "socket.io-client";


const socket = io("https://notes-app-dun-beta.vercel.app", {
  path: "/socket.io",
  withCredentials: true,
  transports: ["polling"], 
});

export default socket;
