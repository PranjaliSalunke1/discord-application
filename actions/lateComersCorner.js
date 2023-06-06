import { EmbedBuilder } from "discord.js";
import AsciiTable from "ascii-table";
import { schedule } from "node-cron";

function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return -1;
    else if (a[property] < b[property]) return 1;

    return 0;
  };
}

function getData() {
  return [
    {
      name: "Member 1",
      score: Math.floor(Math.random() * 50 + 1),
    },
    {
      name: "Member 2",
      score: Math.floor(Math.random() * 50 + 1),
    },
    {
      name: "Member 3",
      score: Math.floor(Math.random() * 50 + 1),
    },
    {
      name: "Member 4",
      score: Math.floor(Math.random() * 50 + 1),
    },
  ];
}

// Function to update the leaderboard
async function updateLeaderboard(client) {
  let scores = getData().sort(sortByProperty("score"));
  const table = new AsciiTable();
  table.setHeading("Rank", "Username", "Score");
  table.removeBorder();
  let count = 1;
  scores.forEach((sc) => {
    const rank = `#${count}`;
    table.addRow(rank, sc.name, sc.score);
    count += 1;
  });

  // Create a new RichEmbed object for the leaderboard
  const leaderboardEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setDescription("Here are the current top scorers:")
    .addFields({ name: "Leaderboard", value: "```" + table.toString() + "```" })
    .setTimestamp();

  const channel = client.channels.cache.get("1100690271299194900");
  if (channel) {
    channel.messages.fetch("1100719961443422258").then((message) => {
      message.edit({ embeds: [leaderboardEmbed] });
    });
  }
}

function leaderboard(client) {
  schedule("*/1 * * * *", () => {
    updateLeaderboard(client);
  });
}

export default { leaderboard };
