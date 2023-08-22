const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const adminbot = "ChatVerse Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    // Welcome current user
    socket.emit("message", formatMessage(adminbot, "Welcome to ChatVerse"));

    // Brodcast when a user connects to specific room
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(adminbot, `${user.username} has joined the chat`)
      );
  });

  // Listen for chat messgae
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // client disconnect
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(adminbot, `has left the chat`));
  });
});

const PORT = 3000 || process.env.PORT;

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
