const mongoose = require("mongoose");

const introSchema = new mongoose.Schema({
  username: String,
  userId: Number,
  discriminator: Number,
  avatarURL: String,
  content: String,
  guildName: String,
  guildId: Number,
  channelName: String,
  channelId: String,
  score: Number,
  role: String,
});

module.exports = mongoose.model("introData", introSchema);
