import cors from "cors";
import morgan from "morgan";
import { Server, Socket } from "socket.io";
import express, { Express } from "express";
import { createServer, Server as HTTPServer } from "http";

const PORT: string | 8080 = process.env.PORT || 8080;

const app: Express = express();
const server: HTTPServer = createServer(app);

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static("public"));
app.use(morgan("dev"));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (client: Socket): void => {
  const user = {
    id: client.id,
    message: "",
    start: Date.now(),
    stop: Date.now(),
  };

  console.log(`New user connected ${client.id}`);
  client.emit("connected");
  client.on("start", (): void => {
    if (!user.stop || user.start > user.stop) {
      return;
    }
    console.log("start");
    user.start = Date.now();
    let char: string = "";
    if (user.start - user.stop > 1000) {
      char = " ";
    } else {
      console.log(user.start - user.stop);
    }
    user.message += char;
    client.broadcast.emit("start", char);
  });
  client.on("stop", (): void => {
    if (user.start === null) {
      return;
    }
    console.log("stop");
    user.stop = Date.now();
    const diff: number = user.stop - user.start;
    let char: string = "";
    if (diff < 150) {
      char = ".";
    } else if (diff < 1000) {
      char = "_";
    }
    user.message += char;
    console.log(user);
    client.broadcast.emit("stop", char);
  });
  client.on("disconnect", (): void => {
    console.log(`User disconnected ${client.id}`);
  });
});

server.listen(PORT, (): void => {
  console.log(`Server is running on port ${PORT}`);
});
