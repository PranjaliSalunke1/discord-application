const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

let currentPlayerName = "";
let mentionedUserName = "";

module.exports = {
  setCurrentPlayer: function (interaction) {
    currentPlayerName = interaction.user.username;
  },

  setMentionedUser: function (interaction) {
    const mentionedUser = interaction.options.getUser("player2");
    mentionedUserName = mentionedUser
      ? mentionedUser.username
      : "No mentioned user";
  },

  getCurrentPlayer: function () {
    return currentPlayerName;
  },
  getMentionedUserId: function () {
    return mentionedUser ? mentionedUser.id : null;
  },

  getMentionedUser: function () {
    return mentionedUserName;
  },

  data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Start a tictactoe game with one mentioned player")
    .addUserOption((option) =>
      option.setName("player2").setDescription("Player 2").setRequired(true)
    ),
  async execute(interaction) {
    this.setCurrentPlayer(interaction);
    this.setMentionedUser(interaction);

    console.log("Current User: ", this.getCurrentPlayer());
    console.log("Mentioned User: ", this.getMentionedUser());

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("cell0").setLabel("-").setStyle(1),
      new ButtonBuilder().setCustomId("cell1").setLabel("-").setStyle(1),
      new ButtonBuilder().setCustomId("cell2").setLabel("-").setStyle(1)
    );
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("cell3").setLabel("-").setStyle(1),
      new ButtonBuilder().setCustomId("cell4").setLabel("-").setStyle(1),
      new ButtonBuilder().setCustomId("cell5").setLabel("-").setStyle(1)
    );
    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("cell6").setLabel("-").setStyle(1),
      new ButtonBuilder().setCustomId("cell7").setLabel("-").setStyle(1),
      new ButtonBuilder().setCustomId("cell8").setLabel("-").setStyle(1)
    );

    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle("Turn: X")],
      components: [row1, row2, row3],
    });
  },
};
