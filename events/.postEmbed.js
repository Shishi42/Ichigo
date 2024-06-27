const Discord = require("discord.js")
const { and } = require("sequelize")

module.exports = {

  async run(bot, tournament, post, update = false) {

    if (post) channel = bot.channels.cache.get(post)
    else channel = bot.channels.cache.get(tournament.dataValues.tournament_channel)

    let embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url})
      .setTitle(tournament.dataValues.tournament_name)
      .setURL(bot.url)
      .setDescription(tournament.dataValues.tournament_desc)
      .setImage(tournament.dataValues.tournament_poster)
      .setTimestamp()
      .setFooter({text: `Merci de consulter #📜-règles-tournois avant de vous inscrire.`, iconURL: `${channel.guild.iconURL()}`})
      .setThumbnail(`${channel.guild.iconURL()}`)

    embed.addFields(
      { name: ':small_blue_diamond: Date', value: `Le <t:${tournament.dataValues.tournament_date}:F>` },
      { name: ':small_blue_diamond: Lieu', value: `${tournament.dataValues.tournament_place}` },
      { name: ':small_blue_diamond: Règlement', value: `${tournament.dataValues.tournament_ruleset}` },
      { name: ':small_blue_diamond: Format', value: `${tournament.dataValues.tournament_format}` },
      { name: ':small_blue_diamond: Statut', value: `${tournament.dataValues.tournament_status}` }
    )
    if (tournament.dataValues.tournament_challonge && tournament.dataValues.tournament_status != "Inscriptions en cours") embed.addFields({ name: ':small_blue_diamond: Challonge', value: `${tournament.dataValues.tournament_challonge}` })
    if (tournament.dataValues.tournament_status == "Inscriptions en cours") embed.addFields({ name: '\u200B', value: `:small_blue_diamond: Fin des inscriptions le <t:${tournament.dataValues.tournament_date_close}:F>.` })
    if (tournament.dataValues.tournament_status == "Tournoi fini") {
      embed.addFields(
        { name: '\u200B', value: '\u200B' },
        { name: ':trophy: Résultats', value: '\u200B' },
        { name: ':first_place: ', value: `<@${tournament.dataValues.tournament_first}>`, inline: true },
        { name: ':second_place:', value: `<@${tournament.dataValues.tournament_second}>`, inline: true },
        { name: ':third_place:', value: `<@${tournament.dataValues.tournament_third}>`, inline: true },
      )
    }

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId(`${tournament.dataValues.tournament_id}_join`)
        .setLabel("Je viens !")
        .setStyle(Discord.ButtonStyle.Success),
      new Discord.ButtonBuilder()
        .setCustomId(`${tournament.dataValues.tournament_id}_leave`)
        .setLabel("Je ne viens plus.")
        .setStyle(Discord.ButtonStyle.Danger)
    )

    if (!update) return await channel.send({embeds: [embed], components: [row]})
    else {
      if (tournament.dataValues.tournament_status != "Inscriptions en cours") return await channel.messages.fetch(tournament.dataValues.tournament_message).then(message => message.edit({ embeds: [embed], components: [] }))
      else await channel.messages.fetch(tournament.dataValues.tournament_message).then(message => message.edit({ embeds: [embed], components: [row] }))
    }
  }
}
