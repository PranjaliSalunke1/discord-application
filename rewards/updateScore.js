const { connectToMongoDB } = require("../actions/mongodb");
const scoreModel = require("../schema/scoreSchema");
const introData = require("../schema/introDataSchema");
const QuestionModel = require("../schema/questionSchema");
const scoreSchema = require("../schema/scoreSchema");
const questionSchema = require("../schema/questionSchema");

async function updateScores() {
  try {
    const users = await scoreModel.find({});
    for (const user of users) {
      const username = user.name;

      let scores = 0;

      const introUser = await introData.findOne({ username: username });
      if (introUser) {
        scores += introUser.score || 0;
      }

      const questionAnswers = await QuestionModel.find({
        "answers.answerSender": username,
      });

      for (const questionAnswer of questionAnswers) {
        for (const answer of questionAnswer.answers) {
          if (answer.answerSender === username) {
            scores += answer.score || 0;
          }
        }
      }

      user.scores = scores;
      await user.save();
    }

    //console.log("score upated successfully");

    const allUsernames = users.map((user) => user.name);
    const introUsers = await introData.find({});

    for (const introUser of introUsers) {
      if (!allUsernames.includes(introUser.username)) {
        const newScoreDocument = new scoreModel({
          name: introUser.username,
          stamps: 0,
          late_streak: 0,
          punctuality_streak: 0,
          scores: introUser.score || 0,
        });
        await newScoreDocument.save();
        console.log(newScoreDocument);
      }
    }
  } catch (error) {
    console.error("Error updating score", error);
  }
}

updateScores();

module.exports = {
  updateScores,
};
