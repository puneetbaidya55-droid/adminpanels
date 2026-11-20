const { EmbedBuilder } = require('discord.js');

function success(title, description) {
  return new EmbedBuilder().setColor(0x00ff88).setTitle(title).setDescription(description).setTimestamp();
}
function error(title, description) {
  return new EmbedBuilder().setColor(0xff4444).setTitle(title).setDescription(description).setTimestamp();
}
function info(title, description) {
  return new EmbedBuilder().setColor(0x00bfff).setTitle(title).setDescription(description).setTimestamp();
}
module.exports = { success, error, info };
