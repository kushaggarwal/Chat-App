const moment = require("moment");

const formatMessages = (username, text) => {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
};

const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id == id);
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  formatMessages,
  getCurrentUser,
  userJoin,
  userLeave,
  getRoomUsers,
};
