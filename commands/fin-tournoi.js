const Discord = require("discord.js")

module.exports = {

  name: "fin-tournoi",
  description: "Termine un tournoi sur le serveur",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Tournoi",
  options: [
    {
      type: "string",
      name: "tournament_id",
      description: "The tournament id to edit",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "first",
      description: "First place at the tournament",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "second",
      description: "Second place at the tournament",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "third",
      description: "Third place at the tournament",
      required: true,
      autocomplete: false,
    },
    {
      type: "channel",
      name: "post_result",
      description: "Channel to post the results of the tournament",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "img_result",
      description: "Image of the results of the tournament",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let id = args.get("tournament_id").value.split(" - ")[0]

    let tournament = await bot.Tournaments.findOne({ where: { tournament_id: id } })
    if (!tournament) return await message.reply({ content: "The tournament provided does not exist.", ephemeral: true })

    let first = args.get("first").value
    let second = args.get("second").value
    let third = args.get("third").value
  
    bot.Tournaments.update({ tournament_first: first, tournament_second: second, tournament_third: third, tournament_status: "Tournoi fini", tournament_event: "", tournament_role: "" }, { where: { tournament_id: id } })
    if (tournament.dataValues.tournament_challonge) bot.Tournaments.update({ tournament_participants: "challonge" }, { where: { tournament_id: id } })
    message.guild.roles.fetch(tournament.dataValues.tournament_role).then(role => role.delete())
  
    let tournament_updated = await bot.Tournaments.findOne({ where: { tournament_id: id } })

    let content = ""
    let medias = []

    if (args.get("img_result")) medias.push({ attachment: args.get("img_result").value })

    content += `## ${tournament_updated.dataValues.tournament_name} (<t:${tournament_updated.dataValues.tournament_date}:d>) - **${tournament_updated.dataValues.tournament_ruleset}** - \<:challonge:1310799875864268800> [Challonge](https://challonge.com/${tournament_updated.dataValues.tournament_id})` + "\n"
    content += `- :trophy: **1ʳᵉ place** - ${first.match(/[0-9]{18}/) ? "<@" + first + ">" : first}` + "\n"
    content += `- :second_place: **2ᵉ place** - ${second.match(/[0-9]{18}/) ? "<@" + second + ">" : second}` + "\n"
    content += `- :third_place: **3ᵉ place ** - ${third.match(/[0-9]{18}/) ? "<@" + third + ">" : third}` + "\n"
    content += "\n"
    content += "Bravo à tous·tes !"

    let channel = await message.guild.channels.fetch(args.get("post_result").value)
    await channel.send({ content: content, files: medias })
    
    await require(`../events/.postTournamentEmbed.js`).run(bot, tournament_updated, true)

    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
