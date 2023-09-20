const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

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
      const questionId = interaction.options.getString("uid");

      const jsonFilePath = "challange.json";

      let jsonData = [];
      if (fs.existsSync(jsonFilePath)) {
        try {
          const rawData = fs.readFileSync(jsonFilePath, "utf8");
          jsonData = JSON.parse(rawData);
        } catch (error) {
          console.error("Error reading JSON file:", error);
        }
      }

      const questionIndex = jsonData.findIndex(
        (item) => item.uniqueID === questionId
      );

      if (questionIndex === -1) {
        await interaction.reply("Question not found.");
        return;
      }

      const questionData = jsonData[questionIndex];

      questionData.answers = questionData.answers || [];
      questionData.answers.push({
        answer: answers,
        answerSender: AnsSender,
        score: 0,
      });

      try {
        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify(jsonData, null, 2),
          "utf8"
        );
        console.log("JSON file updated successfully.");
      } catch (error) {
        console.error("Error writing to JSON file:", error);
      }

      interaction.channel
        .send(
          `${answers}\nThanks for submitting your answer ${AnsSender} \n⭐ -> 10  👍 -> 5  👎 -> 0`
        )
        .then((message) => {
          message.react("⭐");
          message.react("👍");
          message.react("👎");

          const collectorFilter = (user) => !user.bot;

          const collectorOptions = {
            time: null,
            max: 4,
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

          collector.on("collect", (reaction, user) => {
            if (user.bot) {
              return;
            }

            const score = scoreMapping[reaction.emoji.name] || 0;

            if (score === 0) {
              return;
            }

            const questionData = jsonData[questionIndex];
            const answerSender = questionData.answers.find(
              (ans) => ans.answerSender === user.tag
            );

            if (answerSender) {
              console.log(
                `Score updated for ${user.tag}: ${answerSender.score} + ${score}`
              );
              answerSender.score += score;
            } else {
              console.log(
                `New score entry created for ${user.tag} with score ${score}`
              );
              questionData.answers.push({
                answerSender: user.tag,
                score: score,
              });
            }

            try {
              fs.writeFileSync(
                jsonFilePath,
                JSON.stringify(jsonData, null, 2),
                "utf8"
              );
              console.log("JSON file updated successfully.");
            } catch (error) {
              console.error("Error writing to JSON file:", error);
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
