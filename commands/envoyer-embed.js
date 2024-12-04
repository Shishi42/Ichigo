const Discord = require("discord.js")

module.exports = {

    name: "envoyer-embed",
    description: "Envoie un embed dans le salon.",
    permission: Discord.PermissionFlagsBits.Administrator,
    dm: false,
    category: "Utilitaire",

    async run(bot, message, args) {

      let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url })
        .setColor(bot.color)
        .setTitle("Tutoriel de création d'équipe SAtR")
        .setURL(bot.url)
        .setDescription("**Afin de créer votre équipe merci de fournir la totalité des informations suivantes en réponse à ce message.**")
        .setThumbnail(`${message.channel.guild.iconURL()}`)
        .addFields(
          { name: "🌟 - Nom de l'équipe", value: "Le nom sous lequel votre équipe sera reconnue aux yeux de tous." },
          { name: "💬 - Description", value: "Ça peut être un petit texte présentant l'équipe, votre devise, vos réseaux, vos objectifs ou une déclaration, comme vous voulez." },
          { name: "📷 - Logo", value: "Un lien vers l'image, vous avez ce guide à votre disposition pour vous aider à créer le logo : https://discord.com/channels/1221611301332193371/1230832023459860490/1268993014840164495" },
          { name: "🎨 - Couleur", value: "Au format HEX, elle sera utilisée pour votre couleur de rôle, pour vous aider vous avez cet outil : https://g.co/kgs/Q1Dt16g" },
          { name: "👥 - Membres", value: "Une équipe est composée de 3 personnes (pas plus, pas moins) __qui doivent être présentes sur le serveur__, merci de ping les deux autres membres dans le message." },
          { name: "⚠️ - Attention", value: "Aucune équipe ne sera enregistré avec des informations manquantes, donc merci de vérifier que toutes les informations sont **complètes** et **correctes**." },
          { name: "⁉️ - En manque d'un joueur ou d'une équipe ?", value: "Rendez-vous sur le https://discord.com/channels/1221611301332193371/1248686050147041303 pour poster une offre de recrutement ou présenter vos talents afin d'être peut-être remarqué par une équipe." },
        )

      await message.channel.send({ embeds: [embed] })
      return await message.reply({ content: "C'est bon.", ephemeral: true })
    }
}
