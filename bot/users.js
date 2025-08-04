const {client} = require('../bot/handler');
const allowedUsers = ["919746707326@c.us"];

async function addUser(user) {
  try {
    await allowedUsers.push(user);
    // await client.sendMessage(user, `You are Now Authenticated . You can now use the bot.`);
    
  } catch (error) {
    console.log(error)
  }
}

function getUsers() {
  return allowedUsers;
}

async function removeUser(user) {
  const index = allowedUsers.indexOf(user);
  if (index > -1) {
    allowedUsers.splice(index, 1);
    // await client.sendMessage(user, `You have been removed from the allowed users list.`);
  } else {
    console.error(`User ${user} not found in allowed users.`);
  }
}

module.exports = {
  addUser,
  getUsers,
  removeUser
};