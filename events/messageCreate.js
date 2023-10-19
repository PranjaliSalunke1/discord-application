module.exports = {
  name: "messageCreate",
  on: true,
  async execute(msg, client) {
    if (!msg.content.startsWith("/")) {
      return null;
    }

    const command = msg.content.substring(1).split(" ")[0].toLowerCase();

    if (!client.commands.has(command)) {
      console.log(`Command not recognized: ${command}`);
      return;
    }

    try {
      const messageId = msg.id;
      await client.commands.get(command).execute(msg, client, messageId);
      console.log(`Command executed: ${command}`);
    } catch (error) {
      console.error(error);
      await msg.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
