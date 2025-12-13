const Discord = require("discord.js")

module.exports = {

	async run(bot, tournament, post, ping) {

		let channel = await bot.channels.fetch(post)
		let place = await bot.Places.findOne({ where: { place_id: tournament.dataValues.tournament_place } })
		let medias = []

		if (tournament.dataValues.tournament_poster) medias.push({ attachment: tournament.dataValues.tournament_poster })

		msg = "-# @everyone" + (ping ? ` <@&${ping}>` : "") + " - Annonce nouveau tournoi !" + "\n"

		msg += "## " + tournament.dataValues.tournament_name.toUpperCase() + "\n"

		msg += "**" + tournament.dataValues.tournament_desc.toUpperCase() + "**"+ "\n"

		msg += "\n"

        msg += ":small_orange_diamond: **Informations** :small_orange_diamond:" + "\n"
			
		msg	+= "\n"

	 	msg += `:date: Date : Le <t:${tournament.dataValues.tournament_date}:D>, à partir de <t:${tournament.dataValues.tournament_date}:t> (<t:${tournament.dataValues.tournament_date}:R>)` + "\n"
	    msg += `:map: Lieu : ${place.dataValues.place_name}, ${place.dataValues.place_city}` + "\n"
	    msg += `:bar_chart: Format : ${tournament.dataValues.tournament_format}` + "\n"
	    msg += `:scroll: Règlement : ${tournament.dataValues.tournament_ruleset}` + "\n"
	    msg += `:globe_with_meridians: Lien : ${bot.url}` + "\n"

		msg += "\n"

        msg += `-# Merci d'indiquer votre participation dans ${place.dataValues.place_inscr} afin que nous puissions, au mieux, estimer la taille du tournoi.`

		return await channel.send({content : msg, files : medias})
	}
}
