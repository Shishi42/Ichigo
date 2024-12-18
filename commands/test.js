const Discord = require("discord.js")

module.exports = {

  name: "test",
  description: "Commande de test",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "param1",
      description: "param1",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "param2",
      description: "param2",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "param3",
      description: "param3",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    console.log("test")

    return await message.editReply({ content: "C'est bon.", ephemeral: true })

  }
}
