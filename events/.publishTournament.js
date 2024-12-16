const Discord = require("discord.js")
const { request } = require('undici')

module.exports = {

	async run(bot, tournament, post) {

		let channel = bot.channels.cache.get(post)

		msg = "-# @everyone"
		msg += "\n"
		msg += "### "+tournament.dataValues.tournament_desc.toUpperCase()+"\n"
		msg += `Début de l'évènement le <t:${tournament.dataValues.tournament_date}:F> (<t:${tournament.dataValues.tournament_date}:R>)`
		if (tournament.dataValues.tournament_place == "Dernier Bar avant la Fin du Monde, Paris"){
			msg += " au **DERNIER BAR AVANT LA FIN DU MONDE**, situé au **19 Avenue Victoria, 75001, à Paris** !" + "\n"
			msg += "-# Plus d'infos sur https://discordapp.com/channels/1221611301332193371/1227239491488579686 et inscriptions dans https://discordapp.com/channels/1221611301332193371/1227020880614260866, à retrouver sur https://discord.gg/afEvCBF9XR :arrow_down:"
		} 
		if (tournament.dataValues.tournament_place == "Guyajeux, Marseille"){
			msg += "à **GUYAJEUX**, situé au **65 Avenue Jules Cantini, 13006, à Marseille** !" + "\n"
			msg += "-#Plus d'infos sur https://discordapp.com/channels/1221611301332193371/1292516080597729361 et inscriptions dans https://discordapp.com/channels/1221611301332193371/1289972474083282995, à retrouver sur https://discord.gg/afEvCBF9XR :arrow_down:"
		} 
		
		let pub = await channel.send(msg)
		let affiche = await channel.send({ files: [{ attachment: tournament.dataValues.tournament_poster }] })

		pub.crosspost()
		affiche.crosspost()
	}
}
