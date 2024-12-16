const Discord = require("discord.js")

module.exports = {

  name: "modif-message",
  description: "Modifie un message avec un texte",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "id",
      description: "l'id du message à modifier",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "texte",
      description: "le texte du message",
      required: true,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    let texte = args.get("texte").value.replaceAll("\\n", "\n")

    message.channel.messages.fetch(args.get("id").value).then(ancien_message => ancien_message.edit(texte))

    return await message.reply({ content: "C'est bon.", ephemeral: true })
  }
}
