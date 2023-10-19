const {
  ActionRowBuilder,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { CONFIG } = require("../config");

let confess = "";
module.exports = {
  data: new SlashCommandBuilder()
    .setName("confess")
    .setDescription("Sends a anonymous confession!")
    .addStringOption((option) =>
      option
        .setName("confession")
        .setDescription("Your confession")
        .setRequired(true)
    ),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("approved")
        .setLabel("Approved")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("rejected")
        .setLabel("Rejected")
        .setStyle(ButtonStyle.Danger)
    );
    confess =
      interaction.options.getString("confession") ?? "No confession provided";

    const moderationEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("New Confession")
      .setAuthor({
        name: "Anonymous",
        iconURL: "https://img.icons8.com/ios-glyphs/30/null/discord-logo.png",
      })
      .setDescription(confess)
      .setTimestamp();

    //interaction.reply({ content: "posting", ephemeral: true });
    const hrChannel = interaction.guild.channels.cache.get(CONFIG.HR_CHANNEL);

    interaction.reply({ content: "Confession Submitted", ephemeral: true });
    // const guildMembers = await interaction.guild.members.fetch({
    //   withPresences: true,
    // });

    // console.log(`Total Members: ${guildMembers.size}`);

    // const membersWithPermission = guildMembers.filter((member) =>
    //   hrChannel
    //     .permissionsFor(member)
    //     .has(PermissionsBitField.Flags.SendMessages)
    // );

    // console.log(`Members with permission: ${membersWithPermission.size}`);
    // console.log(
    //   `Bots in the server: ${
    //     membersWithPermission.filter((member) => member.user.bot).size
    //   }`
    // );
    // console.log(
    //   `Real members in the server: ${
    //     membersWithPermission.filter((member) => !member.user.bot).size
    //   }`
    // );

    // membersWithPermission.forEach((member) => {
    //   console.log(
    //     `${member.user.username} (${
    //       member.user.bot ? "Bot" : "User"
    //     }) can send messages`
    //   );
    // });

    const response = await hrChannel.send({
      embeds: [moderationEmbed],
      components: [row],
    });

    const collector = response.createMessageComponentCollector({
      time: 3500000,
      max: 1,
      componenType: "BUTTON",
    });

    const confessionEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Confession")
      .setAuthor({
        name: "Anonymous",
        iconURL: "https://img.icons8.com/ios-glyphs/30/null/discord-logo.png",
      })
      .setDescription(confess)
      .setTimestamp();
    const channel = interaction.guild.channels.cache.get(
      CONFIG.CONFESSION_CHANNEL
    );

    collector.on("collect", async (i) => {
      if (i.customId === "approved") {
        // await i.deferUpdate();
        // await wait(4000);

        await channel.send({ embeds: [confessionEmbed] });
        await i.reply({ content: "You Approved" });
      } else {
        // await i.deferUpdate();
        // await wait(4000);
        await i.reply({
          content: "Your confession has been rejected",
          embeds: [confessionEmbed],
          ephemeral: true,
        });
      }
    });
  },
};
