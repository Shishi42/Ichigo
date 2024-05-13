const Discord = require("discord.js")

module.exports = {

  async run(bot, tournament_id) {

    let tournament = await bot.Tournaments.findOne({ where: { tournament_id: tournament_id}})
    let players = await bot.Inscriptions.findAll({ where: { tournament_id: tournament_id, player_status: "INSCRIT"}})

    res = "**__Liste des participants :__**\n"
    for(player of players) res += `- <@${player.dataValues.player_id}>\n`
    if (!players.length) res += "- Aucun participant pour le moment "

    if (tournament.dataValues.tournament_status != "Tournoi fini") return await bot.channels.fetch(tournament.dataValues.tournament_channel).then(channel => channel.messages.fetch(tournament.dataValues.tournament_message).then(message => message.edit({content: res})))
    else return await bot.channels.fetch(tournament.dataValues.tournament_channel).then(channel => channel.messages.fetch(tournament.dataValues.tournament_message).then(message => message.edit({ content: "" })))
  }
}
