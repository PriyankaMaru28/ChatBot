const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/users");

const adminbot = "ChatVerse Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    // Welcome current user
    socket.emit("message", formatMessage(adminbot, "Welcome to ChatVerse"));
    console.log(user);

    // Brodcast when a user connects to specific room
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(adminbot, `${user.username} has joined the chat`)
      );

    // Send room and users info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
    console.log("getRoomusers", getRoomUsers(user.room));
  });

  // Listen for chat messgae
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // client disconnect
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(adminbot, `${user.username} has left the chat`)
      );

      /**
       * Send room and users info
       * wasn't able to get the users for this connection
       * because the while dispatching to the key name used was user but should have been users
       */
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
