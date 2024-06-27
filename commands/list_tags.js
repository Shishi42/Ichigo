const Discord = require("discord.js")

module.exports = {

  name: "list_tags",
  description: "List the bot's registered tags",
  permission: null,
  dm: true,
  category: "Utility",

  async run(bot, message, args) {
    return await message.reply({content: `Les tags disponibles : ${Object.keys(bot.tags).join(", ")}`, ephemeral: true})
  }
}
