function relocate() {
  const username = document.getElementById("username").value;
  const room = document.getElementById("room").value;
  window.location.href = `http://localhost:3131/?username=${username}&room=${room}`;
}
