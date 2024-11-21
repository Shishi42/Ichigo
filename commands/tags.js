const Discord = require("discord.js")

module.exports = {

  name: "tags",
  description: "Liste les tags disponibles",
  permission: null,
  dm: true,
  category: "Utilitaire",

  async run(bot, message, args) {
    return await message.reply({content: `Les tags disponibles sont : __${Object.keys(bot.tags).join(", ")}__`, ephemeral: true})
  }
}
