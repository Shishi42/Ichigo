const Discord = require("discord.js")
const { request } = require('undici')

module.exports = {

  async run(bot, tournament, post, update = false) {

    let channel

    if (post) channel = await bot.channels.fetch(post)
    else channel = await bot.channels.fetch(tournament.dataValues.tournament_channel)

    let req = await request(`https://api.challonge.com/v1/tournaments/${tournament.dataValues.tournament_challonge}.json?api_key=${bot.challonge}`)
    let challonge = await req.body.json()

    let players = await bot.Inscriptions.findAll({ where: { tournament_id: tournament.dataValues.tournament_id, player_status: "INSCRIT" } })

    let embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url})
      .setTitle(tournament.dataValues.tournament_name)
      .setURL(bot.url)
      .setDescription(tournament.dataValues.tournament_desc)
      .setImage(tournament.dataValues.tournament_poster)
      .setFooter({text: `Merci de consulter le règlement avant de vous inscrire.`, iconURL: `${channel.guild.iconURL()}`})
      .setThumbnail(`${channel.guild.iconURL()}`)

    embed.addFields(
      { name: ':small_orange_diamond: Date', value: `Le <t:${tournament.dataValues.tournament_date}:F>` },
      { name: ':small_orange_diamond: Lieu', value: `${tournament.dataValues.tournament_place}` },
      { name: ':small_orange_diamond: Règlement', value: `${tournament.dataValues.tournament_ruleset}`, inline: true },
      { name: ':small_orange_diamond: Format', value: `${tournament.dataValues.tournament_format}`, inline: true },
      { name: ':small_orange_diamond: Statut', value: `${tournament.dataValues.tournament_status}` },
      { name: ':small_orange_diamond: Inscriptions', value: `${players.length}` }
    )
    if (tournament.dataValues.tournament_status != "Inscriptions en cours") embed.addFields({ name: ':small_orange_diamond: Challonge', value: "https://challonge.com/" + challonge.tournament.url })
    if (tournament.dataValues.tournament_status == "Tournoi fini") {

      first = /^[0-9]*$/.test(tournament.dataValues.tournament_first) ? `<@${tournament.dataValues.tournament_first}>` : tournament.dataValues.tournament_first
      second = /^[0-9]*$/.test(tournament.dataValues.tournament_second) ? `<@${tournament.dataValues.tournament_second}>` : tournament.dataValues.tournament_second
      third = /^[0-9]*$/.test(tournament.dataValues.tournament_third) ? `<@${tournament.dataValues.tournament_third}>` : tournament.dataValues.tournament_third 

      embed.addFields(
        { name: '\u200B', value: '\u200B' },
        { name: ':trophy: Résultats', value: '\u200B' },
        { name: ':first_place: ', value: first, inline: true },
        { name: ':second_place:', value: second, inline: true },
        { name: ':third_place:', value: third, inline: true },
      )
    }

    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId(`tournament-join-${tournament.dataValues.tournament_id}`)
        .setLabel("Je participe !")
        .setStyle(Discord.ButtonStyle.Success),
      new Discord.ButtonBuilder()
        .setCustomId(`tournament-leave-${tournament.dataValues.tournament_id}`)
        .setLabel("Je ne participe plus.")
        .setStyle(Discord.ButtonStyle.Danger)
    )

    if (!update) return await channel.send({ content: "", embeds: [embed], components: [row]})
    else {
      if (tournament.dataValues.tournament_status != "Inscriptions en cours") return await channel.messages.fetch(tournament.dataValues.tournament_message).then(message => message.edit({ content: "", embeds: [embed], components: [] }))
      else await channel.messages.fetch(tournament.dataValues.tournament_message).then(message => message.edit({ content: "", embeds: [embed], components: [row] }))
    }
  }
}
