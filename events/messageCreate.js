module.exports = async (bot, message) => {

  if (message.author.bot || message.channel.type === "dm") return

  if (message.content.startsWith('!') && message.content.slice(1) in bot.tags) message.channel.send(bot.tags[message.content.slice(1)])

  if ((message.content.includes("quoi") || message.content.includes("koi")) && message.channel.parentId == 1221670118182879232) {
    message.react(":regional_indicator_f:")
    message.react(":regional_indicator_e:")
    message.react(":regional_indicator_u:")
    message.react(":regional_indicator_r:")
  }
}
