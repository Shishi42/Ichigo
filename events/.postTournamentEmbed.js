const Discord = require("discord.js")
const { request } = require('undici')

module.exports = {

  async run(bot, tournament, update = false) {

    let place = await bot.Places.findOne({ where: { place_id: tournament.dataValues.tournament_place } })
    let channel = await bot.channels.fetch(place.dataValues.place_inscr.split('/')[5])

    let challonge = tournament.dataValues.tournament_challonge
    if (challonge) {
      let req = await request(`https://api.challonge.com/v1/tournaments/${tournament.dataValues.tournament_challonge}.json?api_key=${bot.challonge}`)
      let body = await req.body.json()
      challonge = body.tournament
    }

    let players = await bot.Inscriptions.findAll({ where: { tournament_id: tournament.dataValues.tournament_id, player_status: "INSCRIT" } })
    let participants = tournament.dataValues.tournament_participants == "challonge" ? challonge.participants_count : tournament.dataValues.tournament_participants == "auto" ? players.length : tournament.dataValues.tournament_participants

    let embed = new Discord.EmbedBuilder()
      .setColor(bot.color)
      .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url})
      .setTitle(tournament.dataValues.tournament_name)
      .setURL(bot.url)
      .setDescription(tournament.dataValues.tournament_desc)
      .setImage(tournament.dataValues.tournament_poster)
      .setFooter({text: `Merci de consulter le règlement avant de vous inscrire.`, iconURL: `${channel.guild.iconURL()}`})
      .addFields(
        { name: ':small_orange_diamond: Date', value: `Le <t:${tournament.dataValues.tournament_date}:F>` },
        { name: ':small_orange_diamond: Lieu', value: `${place.dataValues.place_name}, ${place.dataValues.place_city}` },
        { name: ':small_orange_diamond: Règlement', value: `${tournament.dataValues.tournament_ruleset}`, inline: true },
        { name: ':small_orange_diamond: Format', value: `${tournament.dataValues.tournament_format}`, inline: true },
        { name: ':small_orange_diamond: Challonge', value: "https://challonge.com/" + challonge.id },
        { name: ':small_orange_diamond: Statut', value: `${tournament.dataValues.tournament_status}`, inline: true },
        { name: ':small_orange_diamond: Participants', value: participants.toString(), inline: true },
      )
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
