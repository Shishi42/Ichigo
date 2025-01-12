const Discord = require("discord.js")
const { request } = require('undici')

module.exports = {

  name: "modif-tournoi",
  description: "Modifie un tournoi sur le serveur",
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
      name: "title",
      description: "The tournament title to edit",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "description",
      description: "Description in the announcement message",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "date",
      description: "When is the tournament, format (DD/MM/YYYY-HH:mm:SS)",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "ruleset",
      description: "Ruleset of the tournament",
      required: false,
      autocomplete: true,
    },
    {
      type: "string",
      name: "format",
      description: "Format of the tournament",
      required: false,
      autocomplete: true,
    },
    {
      type: "string",
      name: "place",
      description: "Where is the tournament",
      required: false,
      autocomplete: true,
    },
    {
      type: "string",
      name: "poster",
      description: "Poster URL to display",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "status",
      description: "Status of the tournament",
      required: false,
      autocomplete: true,
    },
    {
      type: "string",
      name: "challonge",
      description: "URL to the challonge",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "first",
      description: "First place at the tournament",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "second",
      description: "Second place at the tournament",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "third",
      description: "Third place at the tournament",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let id = args.get("tournament_id").value.split(" - ")[0]

    let tournament = await bot.Tournaments.findOne({ where: { tournament_id: id } })
    if (!tournament) return await message.reply({ content: "The tournament provided does not exist.", ephemeral: true })

    if (args.get("title")){
      bot.Tournaments.update({ tournament_name: args.get("title").value }, { where: { tournament_id: id } })
      message.guild.roles.fetch(tournament.dataValues.tournament_role).then(role => role.setName("Participants " + args.get("title").value))
    }
    if (args.get("description")) bot.Tournaments.update({ tournament_desc: args.get("description").value.replaceAll("\\n", "\n") }, { where: { tournament_id: id } })    
    if (args.get("date")){
      let date = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1], args.get("date").value.split('-')[1].split(':')[2])
      bot.Tournaments.update({ tournament_date: Math.floor(date) / 1000 }, { where: { tournament_id: id } })
    } 
    if (args.get("ruleset")) bot.Tournaments.update({ tournament_ruleset: args.get("ruleset").value }, { where: { tournament_id: id } })      
    if (args.get("format")) bot.Tournaments.update({ tournament_format: args.get("format").value }, { where: { tournament_id: id } })      
    if (args.get("place")) bot.Tournaments.update({ tournament_place: args.get("place").value }, { where: { tournament_id: id } })
    if (args.get("poster")) bot.Tournaments.update({ tournament_poster: args.get("poster").value }, { where: { tournament_id: id } })
    if (args.get("status")){
      bot.Tournaments.update({ tournament_status: args.get("status").value }, { where: { tournament_id: id } })
      if (args.get("status") == "Tournoi fini"){
        message.guild.roles.fetch(tournament.dataValues.tournament_role).then(role => role.delete())
        bot.Tournaments.update({ tournament_event: "", tournament_role: "" }, { where: { tournament_id: id } })
      } 
    } 
    if (args.get("challonge")){
      let req = await request(`https://api.challonge.com/v1/tournaments/${args.get("challonge").value.split("https://challonge.com/")[1]}.json?api_key=${bot.challonge}`)
      let challonge = await req.body.json()
      bot.Tournaments.update({ tournament_challonge: challonge.tournament.id }, { where: { tournament_id: id } })
    } 
    if (args.get("first")) bot.Tournaments.update({ tournament_first: args.get("first").value }, { where: { tournament_id: id } })
    if (args.get("second")) bot.Tournaments.update({ tournament_second: args.get("second").value }, { where: { tournament_id: id } })
    if (args.get("third")) bot.Tournaments.update({ tournament_third: args.get("third").value }, { where: { tournament_id: id } })

    let tournament_updated = await bot.Tournaments.findOne({ where: { tournament_id: id } })

    if (args.get("title") || args.get("description") || args.get("date") || args.get("ruleset") || args.get("place") || args.get("challonge")) await require(`../events/.publishInfos.js`).run(bot, tournament_updated)
    await require(`../events/.postTournamentEmbed.js`).run(bot, tournament_updated, true)     
    
    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
