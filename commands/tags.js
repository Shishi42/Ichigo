const Discord = require("discord.js")

module.exports = {

  name: "tags",
  description: "List the bot's registered tags",
  permission: null,
  dm: true,
  category: "Utility",

  async run(bot, message, args) {
    return await message.reply({content: `Les tags disponibles sont : __${Object.keys(bot.tags).join(", ")}__`, ephemeral: true})
  }
}
