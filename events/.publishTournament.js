const Discord = require("discord.js")

module.exports = {

	async run(bot, tournament, post) {

		let channel = await bot.channels.fetch(post)
		let place = await bot.Places.findOne({ where: { place_id: tournament.dataValues.tournament_place } })
		let medias = []

		if (tournament.dataValues.tournament_poster) medias.push({ attachment: tournament.dataValues.tournament_poster })

		msg = "-# @everyone" + "\n"

		msg += "## NOUVEAU TOURNOI : " + tournament.dataValues.tournament_name.toUpperCase() + "\n"

		msg += "### " + tournament.dataValues.tournament_desc.toUpperCase() + "\n"

        msg += "\n" + ":small_orange_diamond: **Informations** :small_orange_diamond:" + "\n"
			
		msg	+= "\n"

	 	msg += `:date: Date : Le <t:${tournament.dataValues.tournament_date}:D>, à partir de <t:${tournament.dataValues.tournament_date}:t> (<t:${tournament.dataValues.tournament_date}:R>)` + "\n"
	    msg += `:map: Lieu : ${place.dataValues.place_name}, ${place.dataValues.place_city}` + "\n"
	    msg += `:bar_chart: Format : ${tournament.dataValues.tournament_format}` + "\n"
	    msg += `:scroll: Règlement : ${tournament.dataValues.tournament_ruleset}` + "\n"
	    msg += `:globe_with_meridians: Lien : ${bot.url}` + "\n"

		msg += "\n"

        msg += `-# Merci d'indiquer votre participation dans ${place.dataValues.place_inscr} afin que nous puissions, au mieux, estimer la taille du tournoi.`

		channel.type == Discord.ChannelType.GuildAnnouncement ? await channel.send({content : msg, files : medias}).then(message => message.crosspost()) : await channel.send({content : msg, files : medias})
}
