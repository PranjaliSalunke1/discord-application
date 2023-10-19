var cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { CONFIG } = require("../config");
const scoreData = require("../schema/scoreSchema");
const { error } = require("console");
function cronScheduler(client) {
  cron.schedule("36 18 * * *", async () => {
    try {
      const inHour = 10;
      const inMinute = 45;
      const channel = client.channels.cache.get(CONFIG.GENERAL_CHANNEL);

      if (channel) {
        const reactedUsers = new Set();

        const embed = new EmbedBuilder()

          .setTitle("Attendance Record")
          .setDescription("🫡 - Joined \n\n 🤗 - Exempt \n\n 😴 - On Leave ")

          .setColor("#0099ff")
          .setTimestamp();
        channel
          .send({ embeds: [embed] })
          .then((message) => {
            message.react("🫡");
            message.react("🤗");
            message.react("😴");

            // * Joined
            const filterForJoined = (reaction, user) =>
              reaction.emoji.name === "🫡" && !user.bot;
            const collectorForJoined = message.createReactionCollector({
              filter: filterForJoined,
              time: 25200000,
              dispose: true,
            });

            collectorForJoined.on("collect", async (reaction, user) => {
              console.log(`${user.tag} reacted with 🫡`);
              const joinHour = new Date().getHours();
              const joinMinute = new Date().getMinutes();
              if (reactedUsers.has(user.id)) {
                reaction.users.remove(user);
              } else {
                reactedUsers.add(user.id);
                console.log(reactedUsers);
                let user_score = await scoreData.findOne({
                  name: user.username,
                });

                if (joinHour < inHour) {
                  // streak increment
                  user_score.punctuality_streak += 1;
                  // late streak 0
                  user_score.late_streak;
                  // user_score.stamps = user_score.scores + 2;
                  user_score.stamps =
                    user_score.late_streak * -3 +
                    user_score.punctuality_streak * 2 +
                    user_score.scores;
                }
                if (joinHour === inHour && joinMinute <= inMinute) {
                  // streak increment
                  user_score.punctuality_streak += 1;
                  // late streak 0
                  user_score.late_streak;
                  user_score.stamps =
                    user_score.late_streak * -3 +
                    user_score.punctuality_streak * 2 +
                    user_score.scores;
                } else {
                  // streak reduction
                  user_score.punctuality_streak;
                  // late streak increment
                  user_score.late_streak += 1;
                  user_score.stamps =
                    user_score.late_streak * -3 +
                    user_score.punctuality_streak * 2 +
                    user_score.scores;
                  const index = Math.floor(
                    Math.random() * CONFIG.LATE_COMING_PUNISHMENTS.length
                  );
                  const punishmentEmbed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Punishment Time")
                    .setDescription(
                      `${user_score.name} : ${user_score.late_streak} 💩.`
                    )
                    .addFields({
                      name: "Punishment",
                      value: `${CONFIG.LATE_COMING_PUNISHMENTS[index]}`,
                    })
                    .setTimestamp();
                  if (user_score.late_streak >= 4) {
                    const hrchannel = client.channels.cache.get(
                      "1151411362640187422"
                    );
                    hrchannel.send({
                      embeds: [punishmentEmbed],
                    });
                  }
                }

                console.log(`updating user score for ${user_score.name}`);

                await user_score.save();
              }
            });

            collectorForJoined.on("remove", (reaction, user) => {});

            collectorForJoined.on("end", (collected) => {
              console.log(`Collected ${collected.size} reactions`);
              // Do something when the reaction collection ends, like save the list of attendees to a database
            });

            // * Exempted
            const filterForExempted = (reaction, user) =>
              reaction.emoji.name === "🤗" && !user.bot;
            const collectorForExempted = message.createReactionCollector({
              filter: filterForExempted,
              time: 25200000,
              dispose: true,
            });

            collectorForExempted.on("collect", async (reaction, user) => {
              console.log(`${user.tag} reacted with 🤗`);
              let user_score = await scoreData.findOne({
                name: user.username,
              });

              if (reactedUsers.has(user.id)) {
                reaction.users.remove(user);
              } else {
                reactedUsers.add(user.id);
                // streak increment
                user_score.punctuality_streak += 1;
                // late streak 0
                user_score.late_streak;
                user_score.stamps =
                  user_score.late_streak * -3 +
                  user_score.punctuality_streak * 2 +
                  user_score.scores;
              }
              await user_score.save();

              console.log(`score updated for ${user_score.name}`);
              await user_score.save();
            });

            collectorForExempted.on("remove", (reaction, user) => {});

            collectorForExempted.on("end", (collected) => {
              console.log(`Collected ${collected.size} reactions`);
              // Do something when the reaction collection ends, like save the list of attendees to a database
            });

            // * On leave
            const filterForLeave = (reaction, user) =>
              reaction.emoji.name === "😴" && !user.bot;
            const collectorForLeave = message.createReactionCollector({
              filter: filterForLeave,
              time: 25200000,
              dispose: true,
            });

            collectorForLeave.on("remove", (reaction, user) => {});

            collectorForLeave.on("collect", (reaction, user) => {
              console.log(`${user.tag} reacted with 😴`);
              if (reactedUsers.has(user.id)) {
                reaction.users.remove(user);
              } else {
                reactedUsers.add(user.id);
              }
              // no change
            });

            collectorForLeave.on("end", (collected) => {
              console.log(`Collected ${collected.size} reactions`);
              // Do something when the reaction collection ends, like save the list of attendees to a database
            });
          })
          .catch((error) => {
            console.error("error sending the message", error);
          });
      } else {
        console.error("Unable to find channel with ID " + channel.id);
      }
    } catch {
      console.error("error in the main function", error);
    }
  });
}
module.exports = { cronScheduler };
