const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    uniqueID: String,
    userId: Number,
    channel: String,
    QuestSender: String,
    quest: String,
    score: Number,
    answers: [
      {
        answer: String,
        userId: Number,
        answerSender: String,
        score: Number,
      },
    ],
    submittedUsers: [String],
  },
  { strict: false }
);

module.exports = mongoose.model("Question", questionSchema);
