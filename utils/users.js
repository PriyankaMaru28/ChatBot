const users = [];

// When the user joins the room push it in the array
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  console.log(
    users.filter((user) => user.id === id)[0],

    "filter",
    users.map((user) => user.id === id),
    "fimd",
    users.find((user) => user.id === id)
  );
  users.filter((user) => user.id === id);
  return users.find((user) => user.id === id);
}

function userLeaves(id) {
  const index = users.findIndex((user) => user.id === id);
}

module.exports = { userJoin, getCurrentUser };
