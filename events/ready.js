const { Events } = require("discord.js");
const { leaderboard } = require("../actions/leaderboard");
const { cronScheduler } = require("../actions/attendance");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    cronScheduler(client);
    leaderboard(client);
  },
};
