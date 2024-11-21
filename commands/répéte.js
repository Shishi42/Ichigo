const Discord = require("discord.js")

module.exports = {

  name: "répéte",
  description: "Répéte un texte",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "texte",
      description: "le texte à répéter",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {
    await message.channel.send(args.get("texte").value)
    return await message.reply({content: "C'est bon.", ephemeral: true})
  }
}
