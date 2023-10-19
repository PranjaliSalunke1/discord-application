const { SlashCommandBuilder } = require("discord.js");
//const Canvas = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("spin")
    .setDescription("Replies with Hello!"),
  async execute(interaction) {
    const outcomes = ["Prize 1", "Prize 2", "Prize 3", "Prize 4", "Prize 5"];
    const buffer = await createWheel(outcomes);

    await interaction.reply({ files: [buffer] });
  },
};

async function createWheel(outcomes) {
  const canvas = Canvas.createCanvas(500, 500);
  const ctx = canvas.getContext("2d");

  // Draw the wheel background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 500, 500);

  // Draw the wheel segments
  const segmentAngle = (2 * Math.PI) / outcomes.length;
  for (let i = 0; i < outcomes.length; i++) {
    ctx.fillStyle = `hsl(${(i / outcomes.length) * 360}, 100%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 200, i * segmentAngle, (i + 1) * segmentAngle);
    ctx.closePath();
    ctx.fill();

    // Add text labels to the wheel segments
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.translate(250, 250);
    ctx.rotate(i * segmentAngle + segmentAngle / 2);
    ctx.textAlign = "center";
    ctx.fillText(outcomes[i], 100, 0);
    ctx.rotate(-(i * segmentAngle + segmentAngle / 2));
    ctx.translate(-250, -250);
  }

  // Add a pointer to the wheel
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(250, 50);
  ctx.lineTo(270, 10);
  ctx.lineTo(230, 10);
  ctx.closePath();
  ctx.fill();
  // console.log(canvas.toBuffer());
  // Return the canvas as a buffer
  return canvas.toBuffer();
}
