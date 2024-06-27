const config = require("../config.json")

module.exports = async (bot, message) => {

  if (message.author.bot || message.channel.type === "dm") return

  if(message.content.startsWith('!') && message.content.slice(1) in bot.tags) message.channel.send(bot.tags[message.content.slice(1)])
}
