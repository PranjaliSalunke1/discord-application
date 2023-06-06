const { EmbedBuilder } = require("discord.js");
const AsciiTable = require("ascii-table");
var cron = require("node-cron");
const { CONFIG } = require("../config");
const { scores } = require("../dummy_data/scores");

function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return -1;
    else if (a[property] < b[property]) return 1;

    return 0;
  };
}

function getData() {
  return scores;
}

// Function to update the leaderboard
async function updateLeaderboard(client) {
  const scoreTable = getData();
  let scores = [...scoreTable].sort(sortByProperty("score"));
  let late_streak_score = [...scoreTable].sort(sortByProperty("late_streak"));
  let on_time_score = [...scoreTable].sort(
    sortByProperty("punctuality_streak")
  );
  const table = new AsciiTable();
  table.setHeading(["Rank", "Username", "Stamps", "Late", "On Time", "Tags"]);
  table
    //   .setAlign(0, AsciiTable.CENTER)
    //   .setAlign(1, AsciiTable.CENTER)
    .setAlign(2, AsciiTable.CENTER);
  //   .setAlign(3, AsciiTable.CENTER)
  //   .setAlign(4, AsciiTable.CENTER);
  table.removeBorder();
  let count = 1;
  scores.forEach((sc) => {
    let rank = `#${count}`;
    let tag = " ";
    if (count === 1 && sc.score > 0) {
      rank = `👑${rank}`;
    } else if (count === 2 && sc.score > 0) {
      rank = `🥈${rank}`;
    } else if (count === 3 && sc.score > 0) {
      rank = `🥉${rank}`;
    } else rank = `🤬${rank}`;
    let late_streak = `${sc.late_streak}💩`;
    let punctuality_streak = `${sc.punctuality_streak}💀`;
    let score = `${sc.score}🔖`;
    if (sc.name === late_streak_score[0].name) {
      tag = "👾";
    }
    if (sc.name === on_time_score[0].name) {
      tag = "⭐";
    }
    table.addRow(rank, sc.name, score, late_streak, punctuality_streak, tag);
    // .setJustify();
    count += 1;
  });

  // Create a new RichEmbed object for the leaderboard
  const leaderboardEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setDescription("Here are the current top scorers:")
    .addFields({ name: "Leaderboard", value: "```" + table.toString() + "```" })
    .setTimestamp();

  const channel = client.channels.cache.get(CONFIG.LEADERBOARD_CHANNEL);
  if (channel) {
    channel.messages.fetch(CONFIG.LEADERBOARD_MESSAGE).then((message) => {
      message.edit({ embeds: [leaderboardEmbed] });
    });
  }
}

function leaderboard(client) {
  cron.schedule("*/30 * * * * *", () => {
    updateLeaderboard(client);
  });
}

module.exports = { leaderboard };
