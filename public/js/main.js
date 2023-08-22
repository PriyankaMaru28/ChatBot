const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log("username and rooms ", username, room);

socket.emit("joinRoom", { username, room });

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get message text
  const msg = e.target.elements.msg.value;

  //console.log(msg);
  // Emitting a message to the server
  socket.emit("chatMessage", msg);
  // Clear and Focus
  e.target.elements.msg.value = "";
  e.target.elements.focus();
});

// Outputs message to the DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
