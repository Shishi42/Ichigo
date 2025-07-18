module.exports = async (bot, message) => {

  if (message.author.bot || message.channel.type === "dm") return

  if (message.content.startsWith('!') && message.content.slice(1) in bot.tags) message.channel.send(bot.tags[message.content.slice(1)])

  if ((message.content.includes("quoi") || message.content.includes("koi")) && !message.content.includes("feur") && (message.channel.parentId == 1221670118182879232 || message.channel.parentId == 1275521362596986880)) {
    message.react("🇫")
    message.react("🇪")
    message.react("🇺")
    message.react("🇷")
  }
}
