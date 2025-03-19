const Discord = require("discord.js")

module.exports = {

	async run(bot, tournament, post) {

		let channel = await bot.channels.fetch(post)
		let place = await bot.Places.findOne({ where: { place_id: tournament.dataValues.tournament_place } })

		msg = "-# @everyone" + "\n"

		msg += "## " + tournament.dataValues.tournament_name.toUpperCase() + "\n"

		msg += "### " + tournament.dataValues.tournament_desc.toUpperCase() + "\n"

		msg += `Début de l'évènement le <t:${tournament.dataValues.tournament_date}:F> (<t:${tournament.dataValues.tournament_date}:R>)`

		msg += ` au **${place.dataValues.place_name.toUpperCase()}**, situé au **${place.dataValues.place_number} ${place.dataValues.place_road}, ${place.dataValues.place_postcode}, à ${place.dataValues.place_city}**.` + "\n"
		
		msg += `-# Plus d'infos sur ${place.dataValues.place_info}`

		msg += ` et inscriptions dans ${place.dataValues.place_inscr}`

		msg += ", à retrouver sur https://discord.gg/afEvCBF9XR :arrow_down:"

		channel.type == Discord.ChannelType.GuildAnnouncement ? await channel.send(msg).then(message => message.crosspost()) : await channel.send(msg)
		if (tournament.dataValues.tournament_poster) channel.type == Discord.ChannelType.GuildAnnouncement ? await channel.send({ files: [{ attachment: tournament.dataValues.tournament_poster }] }).then(message => message.crosspost()) : await channel.send({ files: [{ attachment: tournament.dataValues.tournament_poster }] })
	}
}
