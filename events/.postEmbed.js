const Discord = require("discord.js")

module.exports = {

  async run(bot, tournament, post, update = false) {

    channel = bot.channels.cache.get(post)

    let embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url})
      .setTitle(tournament.dataValues.tournament_name)
      .setURL(bot.url)
      .setDescription(tournament.dataValues.tournament_desc)
      .addFields(
        { name: ':small_blue_diamond: Date', value: `Le <t:${tournament.dataValues.tournament_date}:F>`},
        { name: ':small_blue_diamond: Lieu', value: `${tournament.dataValues.tournament_place}`},
        { name: ':small_blue_diamond: Règlement', value: `${tournament.dataValues.tournament_ruleset}`},
        { name: ':small_blue_diamond: Format', value: `${tournament.dataValues.tournament_format}`},
        { name: ':small_blue_diamond: Statut', value: `${tournament.dataValues.tournament_status}`},
        { name: '\u200B', value: `:small_blue_diamond: Fin des inscriptions le <t:${tournament.dataValues.tournament_date_close}:F>.`}
      )
      .setImage(tournament.dataValues.tournament_poster)
      .setTimestamp()
      .setFooter({text: `Merci de consulter #📜-règles-tournois avant de vous inscrire.`, iconURL: `${channel.guild.iconURL()}`})
      .setThumbnail(`${channel.guild.iconURL()}`)

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId(`${tournament.dataValues.tournament_id}_join`)
        .setLabel("Je m'inscris !")
        .setStyle(Discord.ButtonStyle.Success),
      new Discord.ButtonBuilder()
        .setCustomId(`${tournament.dataValues.tournament_id}_leave`)
        .setLabel("Je me désinscris.")
        .setStyle(Discord.ButtonStyle.Danger)
    )

    if(!update) return await channel.send({embeds: [embed], components: [row]})
    // else await channel.messages.fetch(tournament.dataValues.tournament_message).then(message => message.edit({embeds: [embed], components: [row]}))
  }
}
