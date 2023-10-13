const { ButtonBuilder, EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
let gameEnded = false;
const gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const {
  getCurrentPlayer,
  getMentionedUser,
  setCurrentPlayer,
  setMentionedUser,
} = require("../commands/tictactoe");
// const {
//   updateLeaderboardData,
//   saveLeaderboardData,
// } = require("../modules/leaderboardUtils");

// loadLeaderboardData();

module.exports = {
  name: "interactionCreate",
  on: true,
  async execute(interaction, client) {
    if (gameEnded) {
      return;
    }

    if (interaction.isButton() && interaction.customId.includes("cell")) {
      const clickedCellNumber = parseInt(
        interaction.customId.substring(interaction.customId.length - 1)
      );
      const clickedRowNumber = Math.floor(clickedCellNumber / 3);

      if (gameBoard[clickedRowNumber][clickedCellNumber % 3] === "") {
        const currentPlayer = interaction.message.embeds[0].title.slice(-1);
        const label = currentPlayer;

        if (currentPlayer === "X") {
          if (interaction.user.username !== getCurrentPlayer()) {
            await interaction.reply({
              content: `It's not your turn, ${interaction.user.username}!`,
              ephemeral: true,
            });
            return;
          }
        } else if (currentPlayer === "O") {
          if (interaction.user.username !== getMentionedUser()) {
            await interaction.reply({
              content: `It's not your turn, ${interaction.user.username}!`,
              ephemeral: true,
            });
            return;
          }
        }
        gameBoard[clickedRowNumber][clickedCellNumber % 3] = currentPlayer;

        interaction.message.components[clickedRowNumber].components[
          clickedCellNumber % 3
        ] = new ButtonBuilder()
          .setCustomId(interaction.customId)
          .setLabel(label)
          .setStyle(1)
          .setDisabled(true);

        const newLabel = "Turn: " + (currentPlayer === "X" ? "O" : "X");

        if (checkWin(gameBoard, label)) {
          await interaction.update({
            embeds: [new EmbedBuilder().setTitle(newLabel)],
            components: interaction.message.components,
          });

          await wait(30);
          await interaction.editReply({
            content: `Player ${label} wins!`,
          });

          gameEnded = true;
          //   updateLeaderboardData(
          //     getCurrentPlayer(),
          //     getMentionedUser(),
          //     "winner"
          //   );
          //   saveLeaderboardData();
        } else if (checkTie(gameBoard, label)) {
          await interaction.update({
            embeds: [new EmbedBuilder().setTitle(newLabel)],
            components: interaction.message.components,
          });
          await wait(30);
          await interaction.editReply({
            content: `It's a tie`,
          });

          gameEnded = true;
          updateLeaderboardData(getCurrentPlayer(), getMentionedUser(), "tie");
          saveLeaderboardData();
        } else {
          await interaction.update({
            embeds: [new EmbedBuilder().setTitle(newLabel)],
            components: interaction.message.components,
          });
        }
      }
    }

    // if (interaction.isCommand()) {
    //   if (interaction.commandName === "tictactoe") {
    //     setCurrentPlayer(interaction);
    //     setMentionedUser(interaction);
    //   }
    //   // else if (interaction.commandName === "leaderboard") {
    //   //     try {
    //   //       const leaderboardData = getLeaderboardData();

    //   //       if (leaderboardData && leaderboardData.length > 0) {
    //   //         const leaderboardEmbed = new EmbedBuilder()
    //   //           .setTitle("Leaderboard")
    //   //           .setDescription("Top Players");

    //   //         leaderboardData.forEach((entry, index) => {
    //   //           leaderboardEmbed.addFields({
    //   //             name: `#${index + 1} ${
    //   //               interaction.username || interaction.userID || "Unknown"
    //   //             }`,

    //   //             value: `Wins: ${entry.wins} | Losses: ${entry.losses} | Ties: ${entry.ties} | Points: ${entry.points}`,
    //   //           });
    //   //         });
    //   //         await interaction.reply({
    //   //           embeds: [leaderboardEmbed],
    //   //         });
    //   //       } else {
    //   //         await interaction.reply({
    //   //           content: "The leaderboard is currently empty.",
    //   //         });
    //   //       }
    //   //     } catch (error) {
    //   //       console.error(error);
    //   //       await interaction.reply({
    //   //         content: "An error occurred while processing the command!",
    //   //         ephemeral: true,
    //   //       });
    //   //     }
    //   //   }
    // }
  },
};

function checkWin(board, player) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (
      board[Math.floor(a / 3)][a % 3] === player &&
      board[Math.floor(b / 3)][b % 3] === player &&
      board[Math.floor(c / 3)][c % 3] === player
    ) {
      return true;
    }
  }
  return false;
}

function checkTie(board) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        return false;
      }
    }
  }
  return true;
}
