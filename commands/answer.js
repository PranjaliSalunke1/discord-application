const {
  SlashCommandBuilder,
  ReactionEmoji,
  PermissionsBitField,
} = require("discord.js");

const { client, MongoClient } = require("mongodb");

const QuestionModel = require("../schema/questionSchema");
const { updateScores } = require("../rewards/updateScore");
const questionSchema = require("../schema/questionSchema");
const introDataSchema = require("../schema/introDataSchema");
const scoreModel = require("../schema/scoreSchema");

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
      const channel = interaction.channel;
      // console.log("channelName", channel);

      const guildMembers = await interaction.guild.members.fetch({
        withPresences: true,
      });
      const membersWithPermission = guildMembers.filter((member) =>
        channel
          .permissionsFor(member)
          .has(PermissionsBitField.Flags.SendMessages)
      );
      const withPermission = membersWithPermission.size;

      const bots = membersWithPermission.filter(
        (member) => member.user.bot
      ).size;
      console.log("bots", bots);

      const memberInChannel = channel.members.size;

      console.log("member in chanel", memberInChannel);

      const channelMember = memberInChannel - bots;
      // console.log(channelMember);
      let questionDocument = await QuestionModel.findOne({
        uniqueID: questionId,
      });

      //console.log("here is the questionSchema", questionDocument.score);
      if (!questionDocument) {
        interaction.reply(`question id ${questionId} not found`);
        return;
      }

      if (!questionDocument.submittedUsers.includes(AnsSender)) {
        questionDocument.submittedUsers.push(AnsSender);
      }
      console.log("Question Sender:", questionDocument.QuestSender);
      console.log("Answer Sender:", AnsSender);
      if (questionDocument.QuestSender === AnsSender) {
        interaction.reply(
          `Sorry you cannot answer your own question ${questionDocument.QuestSender}`
        );
        return;
      }
      questionDocument.answers.push({
        answer: answers,
        userId: AnsSenderId,
        answerSender: AnsSender,
        score: 0,
      });

      await questionDocument.save();

      const submittedUsers = questionDocument.submittedUsers.length;
      console.log(
        "submittedUsers",
        submittedUsers,
        "channel member",
        channelMember
      );
      if (channelMember - 1 === submittedUsers) {
        console.log(
          `everyone has answered the question ${questionDocument.uniqueID}`
        );

        console.log(
          `Question sender ${questionDocument.QuestSender} received 10 points.`
        );

        console.log("initial score=", questionDocument.score);

        questionDocument.score += 10;

        updateScores();
        await questionDocument.save();
        // }
      }
      interaction.channel
        .send(
          `${answers}\nThanks for submitting your answer ${AnsSender}  \n⭐ -> 10  👍 -> 5  👎 -> 0`
        )
        .then((message) => {
          message.react("⭐");
          message.react("👍");
          message.react("👎");

          const collectorFilter = (reaction, user) => !user.bot;
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
