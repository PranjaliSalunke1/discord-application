const { SlashCommandBuilder } = require("discord.js");
const { addPoints } = require("../rewards/addPoint");
const { updateLeaderboard } = require("../actions/leaderboard");
const fs = require("fs");
const introData = require("../schema/introDataSchema");
const { updateScores } = require("../rewards/updateScore");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("introduction")
    .setDescription("Tell us more about yourself!")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Enter your name here")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("oneliner")
        .setDescription("One line about yourself")
        .setRequired(true)
    ),
  // .addStringOption((option) =>
  //   option
  //     .setName("role")
  //     .setDescription("Please enter your role here")
  //     .setRequired(true)
  // ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const oneliner = interaction.options.getString("oneliner");
    // const role = interaction.options.getString("role");
    // console.log(role);

    const introductionChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "introduction"
    );

    if (!introductionChannel) {
      return interaction.reply("The 'introduction' channel does not exist.");
    }

    await introductionChannel.send(`Hello, ${name}!\n"${oneliner}"`);

    await interaction.reply(
      "yayy.. you have earned 10 marks by introducing yourself to the team."
    );

    if (interaction.commandName === "introduction") {
      const existUser = await introData.findOne({
        userId: interaction.user.id,
      });
      if (existUser) {
        return;
      }

      if (!existUser) {
        const userData = new introData({
          username: interaction.user.username,
          userId: interaction.user.id,
          discriminator: interaction.user.discriminator,
          avatarURL: interaction.user.displayAvatarURL({
            format: "png",
            dynamic: true,
          }),
          content: interaction.options.getString("name"),
          guildName: interaction.guild.name,
          guildId: interaction.guild.id,
          channelName: introductionChannel.name,
          channelId: introductionChannel.id,
          score: 10,
          //role: role,
        });
        await userData.save();
      }
    }
    updateScores();
  },
};
