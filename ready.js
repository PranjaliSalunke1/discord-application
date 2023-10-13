const { Events, InteractionCollector } = require("discord.js");
const { leaderboard } = require("../actions/leaderboard");
const { cronScheduler } = require("../actions/attendance");
const { connectToMongoDB } = require("../actions/mongodb");
module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    cronScheduler(client);
    leaderboard(client);
    //connectToMongoDB();
  },
};
