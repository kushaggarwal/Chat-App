const socket = io();
const chatForm = document.getElementById("chat-form");
const messageContainer = document.getElementById("all-messages");
const roomName = document.getElementById("room-name");
const users = document.getElementById("users");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log("username", username, "room", room);

socket.emit("joinRoom", { username, room });

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("msg");
  div.innerHTML = `<h5>${msg.text}</h5>`;
  document.getElementById("all-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerHTML = room;
}

function outputRoomUsers(users) {
  console.log("uers", users);
  users.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join()}
    `;
}

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  console.log("message", msg);
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
