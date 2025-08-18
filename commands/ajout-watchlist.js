const Discord = require("discord.js")

module.exports = {

    name: "ajout-watchlist",
    description: "Ajoute un compte watchlist sur le serveur.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "Utilitaire",
    options: [
      {
        type: "string",
        name: "nom",
        description: "Nom de la watchlist",
        required: true,
        autocomplete: false,
      },
      {
        type: "string",
        name: "image",
        description: "Image de la watchlist",
        required: false,
        autocomplete: false,
      },
    ],

    async run(bot, message, args) {

    await message.deferReply()

    let embed = new Discord.EmbedBuilder().setTitle(args.get("nom").value).setDescription("Compte : 0").setImage(args.get("image")?.value)

    let post = await message.editReply({ embeds: [embed] })

    let row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("watchlist-up")
          .setLabel("⬆️")
          .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
          .setCustomId("watchlist-down")
          .setLabel("⬇️")
          .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
          .setCustomId("watchlist-reset")
          .setLabel("0️⃣")
          .setStyle(Discord.ButtonStyle.Danger)
      )

    return await post.edit({ embeds: [embed], components: [row] })
  }
}
