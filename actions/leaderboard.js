const { EmbedBuilder } = require("discord.js");
const AsciiTable = require("ascii-table");
var cron = require("node-cron");
const { CONFIG } = require("../config");
const scoreModel = require("../schema/scoreSchema");

// function sortByProperty(property) {
//   return function (a, b) {
//     if (a[property] > b[property]) return -1;
//     else if (a[property] < b[property]) return 1;

//     return 0;
//   };
// }

// Function to update the leaderboard
async function updateLeaderboard(client) {
  try {
    const users = await scoreModel.find({}).sort({ scores: -1 });

    const table = new AsciiTable();
    table.setHeading([
      "Rank",
      "Username",
      "Stamps",
      "streak",
      //  "Late",
      // "On Time",
      "Scores",
      "Tags",
    ]);

    table.removeBorder();
    let count = 1;

    users.forEach((user) => {
      let rank = `${count}`;

      let Tags = " ";

      if (count === 1 && user.scores > 0) {
        rank = `👑${rank}`;
      } else if (count === 2 && user.scores > 0) {
        rank = `🥈${rank}`;
      } else if (count === 3 && user.scores > 0) {
        rank = `🥉${rank}`;
      } else rank = `🤬${rank}`;
      let streaks = `0`;
      //let late_Streak = `${user.late_streak}💩`;
      //let punctuality_Streak = `${user.punctuality_streak}💀`;
      let scores = `${user.scores}`;
      let stamps = `${user.stamps}🔖`;

      if (user.name === users[0].name) {
        Tags = "👾";
      }
      if (user.name === users[1].name) {
        Tags = "⭐";
      }

      if (user.late_streak === 0) {
        streaks = `${user.punctuality_streak}🔥`;
      } else if (user.punctuality_streak > user.late_streak) {
        streaks = `${user.punctuality_streak}🔥`;
      } else if (user.late_streak > user.punctuality_streak) {
        streaks = `${user.late_streak}🏃`;
      }

      table.addRow(
        rank,
        user.name,
        stamps,
        streaks,
        //late_Streak,
        //punctuality_Streak,
        scores,
        Tags
      );
      count += 1;
    });

    // Create a new MessageEmbed for the leaderboard
    const leaderboardEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Here are the current top scorers:")
      .addFields({
        name: "Leaderboard",
        value: "```" + table.toString() + "```",
      })
      .setTimestamp();

    const channel = client.channels.cache.get(CONFIG.LEADERBOARD_CHANNEL);
    if (channel) {
      channel.messages.fetch(CONFIG.LEADERBOARD_MESSAGE).then((message) => {
        message.edit({ embeds: [leaderboardEmbed] });
      });
    }
    //console.log(table.toString());
  } catch (error) {
    console.error("Error updating leaderboard:", error);
  }
}

function leaderboard(client) {
  cron.schedule("*/30 * * * * *", () => {
    updateLeaderboard(client);
  });
}

module.exports = { leaderboard, updateLeaderboard };
