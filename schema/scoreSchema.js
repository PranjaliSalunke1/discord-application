const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  name: String,
  stamps: Number,
  late_streak: Number,
  punctuality_streak: Number,
  scores: Number,
});

module.exports = mongoose.model("scoreData", ScoreSchema);
