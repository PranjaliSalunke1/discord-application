const { SlashCommandBuilder, roleMention } = require("discord.js");

const QuestionModel = require("../schema/questionSchema");
const { updateScores } = require("../rewards/updateScore");
const introDataSchema = require("../schema/introDataSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Please ask the question to your team-mates!")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("the question to ask")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")

        .setDescription("The channel to send into")
        .setRequired(true)
    ),
  async execute(interaction) {
    const quest = interaction.options.getString("question");

    const QuestSender = interaction.user.username;

    const QuestSenderId = interaction.user.id;

    const channel = interaction.options.getChannel("channel");

    try {
      await interaction.deferReply();
      const lastQuestion = await QuestionModel.findOne().sort({ uniqueID: -1 });

      let askCounter = 1;
      if (lastQuestion) {
        askCounter = parseInt(lastQuestion.uniqueID.split("Ask")[1]) + 1;
      }

      let uniqueCode = `Ask${askCounter}`;

      while (await QuestionModel.findOne({ uniqueID: uniqueCode })) {
        askCounter++;
        uniqueCode = `Ask${askCounter}`;
      }

      await interaction.editReply(
        `Your question "${quest}" has been sent to the "${channel.name}" successfully`
      );

      channel.send(`use code: ${uniqueCode} to Answer\nQuestion: ${quest}`);

      const questDataMongoose = new QuestionModel({
        uniqueID: uniqueCode,
        userId: QuestSenderId,
        channel: channel.name,
        QuestSender: QuestSender,
        quest: quest,
        score: 0,
        submittedUsers: [],
      });

      await updateScores();
      await questDataMongoose.save();
    } catch (error) {
      console.error("Error:", error);

      console.log("An error occurred while processing your request.");
    }
  },
};
