import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let users = {};

io.on("connection", (socket) => {
  console.log("User Connected!!!");

  socket.on("send-msg", (data) => {
    // console.log(data);

    io.emit("received-msg", {
      id: socket.id,
      msg: data.msg,
      username: users[socket.id],
    });
  });

  socket.on("login", (data) => {
    users[socket.id] = data.username;
    // console.log(`${data.username} logged in!`);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      // console.log(`${username} disconnected`);
    }
  });
});

app.use("/", express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
