import { io, Socket } from "socket.io-client";

const SERVER_URL: string =
  (import.meta.env.VITE_SERVER_URL as string) || "http://localhost:8080";

const socket: Socket = io(SERVER_URL, {
  autoConnect: true,
  reconnection: true,
});

export default socket;
