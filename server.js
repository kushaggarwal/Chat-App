const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const PORT = process.env.PORT || 3131;
const app = express();
const server = http.createServer(app);
const {
  formatMessages,
  getCurrentUser,
  userJoin,
  getRoomUsers,
  userLeave,
} = require("./utils");
const io = socketio(server);
app.use("/", express.static(path.join(__dirname, "public")));
const botName = "caMicroscope Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessages(botName, "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessages(botName, `${user.username} has joined a chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      console.log("in disconnect", user);
      io.to(user.room).emit(
        "message",
        formatMessages(botName, `${user.username} has left`)
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });

  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    console.log("message", message);
    io.to(user.room).emit("message", formatMessages(user.username, message));
  });
});

server.listen(PORT, () => {
  console.log("Server started at https://localhost:" + PORT);
});
