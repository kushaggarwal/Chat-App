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
  div.innerHTML = `<div style="padding: 20px">
                <div
                  style="
                    padding: 10px 25px;
                    background-color: white;
                    border-radius: 20px;
                  "
                >
                  <h6 style="display: inline-block">${msg.username}</h6>
                  <div
                    style="
                      display: inline-block;
                      height: 15px;
                      background-color: lightgrey;
                      border: 1px solid lightgrey;
                      margin: 0px 10px;
                    "
                  ></div>
                  <div
                    style="
                      color: #9a2ca0;
                      font-weight: 400;
                      display: inline-block;
                    "
                  >
                    ${msg.time}
                  </div>
                  <div style="font-weight: 400; color: rgb(172, 170, 170)">
                    ${msg.text}
                  </div>
                </div>
              </div>`;
  document.getElementById("all-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerHTML = room;
}

function outputRoomUsers(users) {
  let thumbnails = [
    "https://semantic-ui.com/images/avatar/large/christian.jpg",
    "https://semantic-ui.com/images/avatar/large/joe.jpg",
    "https://react.semantic-ui.com/images/avatar/large/justen.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLsl-YJ5JCBLxr5eUoR1zY0S3UUfZHN9rUOwAsg9gfNwY1BZV24Ql0_MF4Z0YHt6ObAxw&usqp=CAU",
  ];
  console.log("uers", users);
  document.getElementById("users").innerHTML = "";
  document.getElementById("users-count").innerHTML = users.length;
  users.map((u) => {
    const div = document.createElement("div");
    var rndval = thumbnails[Math.floor(Math.random() * thumbnails.length)];
    div.innerHTML = `              <div class="row">
                <div class="col-3">
                  <div style="margin: 5px 30px; border-radius: 50px">
                    <img
                      src=${rndval}
                      height="30px"
                      width="30px"
                      class="rounded-circle"
                    />
                  </div>
                </div>
                <div class="col">
                  <h6 style="margin: 10px 0px">${u.username}</h6>
                </div>
              </div>`;
    document.getElementById("users").appendChild(div);
  });

  // const items = users.map((user) => `<div>${user.username}</div>`);
  // console.log("items", items);
  // users.innerHTML = `
  //   ${users.map((user) => `<div>${user.username}</div>`)}
  //   `;
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
