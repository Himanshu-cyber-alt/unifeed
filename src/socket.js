    import { io } from "socket.io-client";
    export const socket = io(import.meta.env.URL,{
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

    // // socket.js



