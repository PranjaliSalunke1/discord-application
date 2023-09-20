const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const jsonFilePath = "./challange.json";
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
    console.log("question:", quest);
    const QuestSender = interaction.user.username;
    console.log("Question Sender", QuestSender);
    const channel = interaction.options.getChannel("channel");

    let jsonData = [];
    if (fs.existsSync(jsonFilePath)) {
      try {
        const rawData = fs.readFileSync(jsonFilePath, "utf8");
        jsonData = JSON.parse(rawData);
      } catch (error) {
        console.error("Error reading JSON file:", error);
      }
    }

    if (jsonData.length > 0) {
      const lastQuestion = jsonData[jsonData.length - 1];
      const lastAskCounter = parseInt(lastQuestion.uniqueID.split("Ask")[1]);
      askCounter = lastAskCounter + 1;
    }

    const uniqueCode = `Ask${askCounter}`;
    console.log("unique code is: ", uniqueCode);

    const questionData = {
      uniqueID: uniqueCode,
      QuestSender: QuestSender,
      quest: quest,
    };

    jsonData.push(questionData);

    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");
    } catch (error) {
      console.error("Error writing to JSON file:", error);
    }

    channel.send(`use code: ${uniqueCode}\nQuestion:${quest}`);

    interaction.reply(`you have asked the question\n -->${quest}`);
  },
};
