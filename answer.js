const { SlashCommandBuilder, ReactionEmoji } = require("discord.js");

const { client, MongoClient } = require("mongodb");
//const { connectToMongoDB } = require("../actions/mongodb");
const { addPoints } = require("../rewards/addPoint");
const { updateLeaderboard } = require("../actions/leaderboard");
const QuestionModel = require("../schema/questionSchema");
const { updateScores } = require("../rewards/updateScore");
const questionSchema = require("../schema/questionSchema");
const introDataSchema = require("../schema/introDataSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("answer")
    .setDescription("Answer the question!")
    .addStringOption((option) =>
      option
        .setName("ans")
        .setDescription("Enter your answer here")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("uid")
        .setDescription("Unique ID of the question")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const answers = interaction.options.getString("ans");
      const AnsSender = interaction.user.username;
      const AnsSenderId = interaction.user.id;

      const questionId = interaction.options.getString("uid");
      const channelName = interaction.channel.name;
      console.log("channelName", channelName);

      //await connectToMongoDB();
      let questionDocument = await QuestionModel.findOne({
        uniqueID: questionId,
      });
      if (!questionDocument) {
        interaction.reply(`question id ${questionId} not found`);
        return;
      }

      if (!questionDocument.submittedUsers.includes(AnsSender)) {
        questionDocument.submittedUsers.push(AnsSender);
      }
      questionDocument.answers.push({
        answer: answers,
        userId: AnsSenderId,
        answerSender: AnsSender,
        score: 0,
      });

      await questionDocument.save();

      const userRole = await introDataSchema.find({ role: channelName });

      console.log(
        "userRole",
        (await userRole).length,
        "channelName",
        channelName
      );
      const submittedUsers = questionDocument.submittedUsers.length;
      console.log("submittedUsers", submittedUsers);

      if ((await userRole).length === submittedUsers) {
        console.log(
          `everyone has answered the question ${questionDocument.uniqueID}`
        );
        const questionSenderAnswer = questionDocument.answers.find(
          (answer) => answer.answerSender === questionDocument.QuestSender
        );

        if (questionSenderAnswer) {
          console.log(
            `Question sender ${questionDocument.QuestSender} received 10 points.`
          );
          console.log("initial score=", questionSenderAnswer.score);
          questionSenderAnswer.score += 10;
          updateScores();
          await questionDocument.save();
        }
      }
      interaction.channel
        .send(
          `${answers}\nThanks for submitting your answer ${AnsSender}  \n⭐ -> 10  👍 -> 5  👎 -> 0`
        )
        .then((message) => {
          message.react("⭐");
          message.react("👍");
          message.react("👎");

          const collectorFilter = (reaction, user) =>
            !user.bot && user.id === interaction.user.id;
          console.log(interaction.user.id);
          const collectorOptions = {
            time: null,
            max: 1,
          };

          const scoreMapping = {
            "⭐": 10,
            "👍": 5,
            "👎": 0,
          };

          const collector = message.createReactionCollector({
            filter: collectorFilter,
            ...collectorOptions,
          });

          collector.on("collect", async (reaction, user) => {
            if (user.bot) {
              return;
            }
            await questionDocument.save();
            const reactionScore = scoreMapping[reaction.emoji.name] || 0;
            const userAnswer = questionDocument.answers.find(
              (answer) => answer.answerSender === AnsSender
            );
            if (userAnswer) {
              userAnswer.score += reactionScore;
              console.log(
                `User ${userAnswer.answerSender} has updated with ${reactionScore}`
              );
              updateScores();
              await questionDocument.save();
            }
          });
        });
    } catch (error) {
      console.error("Error executing answer:", error);
      await interaction.reply(
        "An error occurred while processing your command."
      );
    }
  },
};
