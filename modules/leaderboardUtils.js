// const fs = require("fs");
// const { ButtonBuilder, EmbedBuilder } = require("discord.js");
// let leaderboardData = [];

// function loadLeaderboardData() {
//   try {
//     const data = fs.readFileSync("src/database/leaderboard.json", "utf8");
//     leaderboardData = JSON.parse(data);
//     console.log("Leaderboard data loaded successfully:", leaderboardData);
//   } catch (error) {
//     console.error("Error loading leaderboard data:", error);
//   }
// }
// function updateLeaderboardData(winnerUserId, loserUserId, gameOutcome) {
//   const winnerEntry = leaderboardData.find(
//     (entry) => entry.userId === winnerUserId
//   );
//   const loserEntry = leaderboardData.find(
//     (entry) => entry.userId === loserUserId
//   );

//   if (!winnerEntry) {
//     leaderboardData.push({
//       userId: winnerUserId,
//       username: "",
//       wins: 0,
//       losses: 0,
//       ties: 0,
//       points: 0,
//     });
//   }

//   if (!loserEntry) {
//     leaderboardData.push({
//       userId: loserUserId,
//       username: "",
//       wins: 0,
//       losses: 0,
//       ties: 0,
//       points: 0,
//     });
//   }

//   if (gameOutcome === "winner") {
//     if (winnerEntry) {
//       winnerEntry.wins += 1;
//       winnerEntry.points += 10;
//     }
//     if (loserEntry) {
//       loserEntry.losses += 1;
//     }
//   } else if (gameOutcome === "tie") {
//     if (winnerEntry) {
//       winnerEntry.ties += 1;
//       winnerEntry.points += 5;
//     }
//     if (loserEntry) {
//       loserEntry.ties += 1;
//       loserEntry.points += 5;
//     }
//   }

//   saveLeaderboardData();
// }

// function saveLeaderboardData() {
//   const leaderboardFilePath = "src/database/leaderboard.json";

//   try {
//     const jsonData = JSON.stringify(leaderboardData, null, 2);
//     fs.writeFileSync(leaderboardFilePath, jsonData, "utf8");
//     console.log("Leaderboard data saved to JSON file.");
//   } catch (error) {
//     console.error("Error saving leaderboard data:", error);
//   }
// }

// function getLeaderboardData() {
//   return leaderboardData;
// }
// module.exports = {
//   getLeaderboardData,
//   loadLeaderboardData,
//   updateLeaderboardData,
//   saveLeaderboardData,
// };
