const Discord = require("discord.js")
const { fetch } = require('undici')
const cron = require("cron")

module.exports = {

  name: "ajout-tournoi",
  description: "Create a new tournament on the server",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Tournoi",
  options: [
    {
      type: "string",
      name: "id",
      description: "Tournament id",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "title",
      description: "Tournament title",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "description",
      description: "Description in the announcement message",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "date",
      description: "When is the tournament, format (DD/MM/YYYY-HH:mm:SS)",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "ruleset",
      description: "Ruleset of the tournament",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "format",
      description: "Format of the tournament",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "place",
      description: "Where is the tournament",
      required: true,
      autocomplete: true,
    },
    {
      type: "Channel",
      name: "post_inscr",
      description: "Channel to open inscriptions of the tournament",
      required: true,
      autocomplete: false,
    },
    {
      type: "Channel",
      name: "post_pub",
      description: "Channel to publish the tournament",
      required: true,
      autocomplete: false,
    },
    {
      type: "Channel",
      name: "post_info",
      description: "Channel to publish the infos",
      required: true,
      autocomplete: false,
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
      name: "date_pub",
      description: "Date to pub the tournament, format (DD/MM/YYYY-HH:mm:SS)",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ephemeral: true})

    let tournament_id = args.get("id").value

    let poster = args.get("poster") ? args.get("poster").value : null

    let date = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1], args.get("date").value.split('-')[1].split(':')[2])

    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url})
      .setTitle(args.get("title").value)
      .setURL(bot.url)
      .setDescription(args.get("description").value.replaceAll("\\n", "\n"))
      .setImage(poster)
      .addFields(
        { name: ':small_blue_diamond: ID', value: tournament_id },
        { name: ':small_blue_diamond: Date', value: `Le <t:${Math.floor(date)/1000}:F>`},
        { name: ':small_blue_diamond: Lieu', value: `${args.get("place").value}`},
        { name: ':small_blue_diamond: Règlement', value: `${args.get("ruleset").value}`},
        { name: ':small_blue_diamond: Format', value: `${args.get("format").value}`},
        { name: ':small_blue_diamond: Statut', value: "Inscriptions en cours"},
        { name: ':small_blue_diamond: Challonge', value: "https://challonge.com/" + tournament_id },
      )

    let row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("confirm-tournament")
          .setLabel("Confirmer")
          .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
          .setCustomId("cancel-tournament")
          .setLabel("Annuler")
          .setStyle(Discord.ButtonStyle.Danger)
      )
    let collector = message.channel.createMessageComponentCollector({time: 30000, max: 1})
    message.editReply({embeds: [embed], components: [row]})

    collector.on('collect', async i => {
      await i.deferUpdate()
      if (i.customId === 'confirm-tournament') {

        let challonge = ""

        if (args.get("format").value != "Training"){
          let desc_challonge = `<p>${args.get("description").value.replaceAll("\\n", "\n")}</p><br><p>Règlement : ${args.get("ruleset").value} (<a href="https://drive.google.com/file/d/1agZf01RlWYBnfRjCcysJJct4mCZVLnIb/view?usp=drive_link" rel="nofollow">plus de détails ici</a>)</p><p>Format : ${args.get("format").value}</p><p>Horaire : Le ${date.getDate()} ${["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][date.getMonth()]} à partir de ${date.toTimeString().substr(0,5).replace(':','h')}</p><p>Localisation : `
          if (args.get("place").value == "Dernier Bar avant la Fin du Monde, Paris") desc_challonge += " Dernier Bar Avant la Fin du Monde, 19 Avenue Victoria, 75001, Paris</p>" + "<p>Accès : RER A+B, Métro 1+4+7+11+14, Bus 21+47+72+85+96</p>"
          if (args.get("place").value == "Guyajeux, Marseille") desc_challonge += " Guyajeux, 65 Avenue Jules Cantini, 13006, Marseille" + "</p>"
          desc_challonge += `<br><p>Toutes les informations sont disponibles sur notre <a href="https://discord.gg/afEvCBF9XR" rel="nofollow">Discord</a>.</p>`
        
          let data = {
            api_key: bot.challonge,
            "tournament[name]": args.get("title").value,
            "tournament[tournament_type]": args.get("format").value == "Double Élimination" ? "double elimination" : "single elimination",
            "tournament[url]": tournament_id,
            "tournament[description]": desc_challonge,
            "tournament[open_signup]": "false",
            "tournament[accept_attachments]": "false",
            "tournament[show_rounds]": "true",
            "tournament[start_at]": new Date(date),
            "tournament[game_id]": "337197",
            "tournament[notify_users_when_matches_open]": "false",
            "tournament[notify_users_when_the_tournament_ends]": "false",
            "tournament[ranked_by]": "match wins",
            "tournament[hide_forum]": "true",
            "tournament[allow_participant_match_reporting]": "false",
            "tournament[allow_participant_match_reporting]": "false",
            "tournament[public_predictions_before_start_time]": "false",
            "tournament[predict_the_losers_bracket]": "false",
            "tournament[hide_bracket_preview]": "true",
            "optional_display_data": { "show_standings":	"1", "show_announcements": "true" },
          }
            
          let body = new URLSearchParams()
          for (key in data) { body.append(key, data[key]) }
      
          let req = await fetch("https://api.challonge.com/v1/tournaments.json", { method: "POST", body: body, headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
          let json = await req.json()
          challonge = json.tournament.id
        }

        if (args.get("date_pub")){   
          prog = new Date(args.get("date_pub").value.split('-')[0].split('/')[2], args.get("date_pub").value.split('-')[0].split('/')[1] - 1, args.get("date_pub").value.split('-')[0].split('/')[0], args.get("date_pub").value.split('-')[1].split(':')[0], args.get("date_pub").value.split('-')[1].split(':')[1], args.get("date_pub").value.split('-')[1].split(':')[2])
          await i.editReply({ content: `Tournament creation confirmed, waiting to post the __<t:${Math.floor(prog) / 1000}:d> at <t:${Math.floor(prog) / 1000}:T> (<t:${Math.floor(prog) / 1000}:R>)__.`, components: [], ephemeral: true })
        } else prog = new Date(parseInt(Math.floor(Date.now()+5)))

        new cron.CronJob(prog, async () => {
          let tournament = await bot.Tournaments.create({
            tournament_id: tournament_id,
            tournament_name: args.get("title").value,
            tournament_desc: args.get("description").value.replaceAll("\\n", "\n"),
            tournament_date: Math.floor(date) / 1000,
            tournament_ruleset: args.get("ruleset").value,
            tournament_format: args.get("format").value,
            tournament_place: args.get("place").value,
            tournament_channel: args.get("post_inscr").value,
            tournament_message: "",
            tournament_role: "",
            tournament_info: args.get("post_info").value,
            tournament_poster: poster,
            tournament_status: "Inscriptions en cours",
            tournament_challonge: challonge,
            tournament_season: "1",
          })

          let event = await message.guild.scheduledEvents.create({
            name: args.get("title").value,
            scheduledStartTime: new Date(parseInt(Math.floor(date))),
            scheduledEndTime: new Date(parseInt(Math.floor(date)) + (3600 * 5)),
            privacyLevel: 2,
            entityType: 3,
            image: poster,
            description: args.get("description").value.replaceAll("\\n", "\n"),
            entityMetadata: {location: args.get("place").value},
          })

          let role = await message.guild.roles.create({
            name: "Participants "+args.get("title").value,
            color: "32ECE0",
            permissions : "0",
          })

          let post = await require(`../events/.postTournamentEmbed.js`).run(bot, tournament, args.get("post_inscr").value)
          await bot.Tournaments.update({ tournament_message: post.id, tournament_event: event.id, tournament_role: role.id}, { where: { tournament_id: tournament_id }})

          await require("../events/.updatePlayers.js").run(bot, tournament.dataValues.tournament_id)

          await require(`../events/.publishInfos.js`).run(bot, tournament)
          await require(`../events/.publishTournament.js`).run(bot, tournament, args.get("post_pub").value)
          
          return i.editReply({content: `Tournament **${args.get("title").value}** created with id : **${tournament_id}**.`, components: [], ephemeral: true})
        }).start()

      } else if (i.customId === 'cancel-tournament') {
        return i.editReply({content: 'Tournament creation canceled.', components: [], ephemeral: true})
      }
    })
  }
}
