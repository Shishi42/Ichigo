const Discord = require("discord.js")

module.exports = {

  name: "ajout-emoji",
  description: "Ajoute un emoji sur le serveur",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "emoji",
      description: "l'emoji à ajouter",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    if (!new RegExp("<[a]{0,1}:.*[a-z]:.*[0-9]>").test(args.get("emoji").value)) return message.reply({content: "L'emoji n'est pas valide.", ephemeral: true})

    let emoji = args.get("emoji").value.split(':')

    return message.guild.emojis.create({ attachment: `https://cdn.discordapp.com/emojis/${emoji[2].slice(0, -1)}.${emoji[0].includes('a') ? "gif" : "png"}`, name: emoji[1] })
      .then(emoji => message.reply({content: `Emoji **${emoji.name}** ajouté avec succès. ${emoji}`, ephemeral: true}))
      .catch(e => message.reply({content: "Erreur, l'emoji n'a pas pu être ajouté.", ephemeral: true}))

  }
}
