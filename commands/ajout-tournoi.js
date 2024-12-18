const Discord = require("discord.js")
const { request } = require('undici')
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
      description: "When is the tournament, format (DD/MM/YYYY-HH:mm)",
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
      name: "challonge",
      description: "URL to the challonge",
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
      description: "Date to pub the tournament, format (DD/MM/YYYY-HH:mm)",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ephemeral: true})

    let tournament_id = args.get("id").value

    let poster = args.get("poster") ? args.get("poster").value : null

    let req = await request(`https://api.challonge.com/v1/tournaments/${args.get("challonge").value.split("https://challonge.com/")[1]}.json?api_key=${bot.challonge}`)
    let challonge = await req.body.json()

    let date = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1])

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

        /*let data = {
          api_key: bot.challonge,
          name: args.get("title").value,
          tournament_type: "double elimination",
          url: tournament_id,
          description: "bite",
          open_signup: "false",
          accept_attachments: "true",
          show_rounds: "true",
          start_at: date
        }

        let req = await request("https://api.challonge.com/v1/tournaments.json", { method: "POST", body: data })
        let challonge = await req.body.json()*/

        if (args.get("date_pub")){   
          prog = new Date(args.get("date_pub").value.split('-')[0].split('/')[2], args.get("date_pub").value.split('-')[0].split('/')[1] - 1, args.get("date_pub").value.split('-')[0].split('/')[0], args.get("date_pub").value.split('-')[1].split(':')[0], args.get("date_pub").value.split('-')[1].split(':')[1])
          await i.editReply({ content: `Tournament creation confirmed, waiting to post at __<t:${Math.floor(prog) / 1000}:F> (<t:${Math.floor(prog) / 1000}:R>)__.`, components: [], ephemeral: true })
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
            tournament_challonge: challonge.tournament.id,
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
