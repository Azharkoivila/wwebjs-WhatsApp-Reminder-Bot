const allowedUsers = ["919746707326@c.us"];

function addUser(user) {
  allowedUsers.push(user);
}

function getUsers() {
  return allowedUsers;
}

function removeUser(user) {
  const index = allowedUsers.indexOf(user);
  if (index > -1) {
    allowedUsers.splice(index, 1);
  } else {
    console.error(`User ${user} not found in allowed users.`);
  }
}

module.exports = {
  addUser,
  getUsers,
  removeUser
};