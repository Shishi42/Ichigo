const Discord = require("discord.js")
const fs = require('fs')

module.exports = {

  name: "create_tournament",
  description: "Create a new tournament on the server",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Tournament",
  options: [
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
      description: "When is the tournament",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "date_close",
      description: "When the tournament inscription are closed",
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
      name: "post",
      description: "Channel to announce the tournament",
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
      name: "challonge",
      description: "URL to the challonge",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ephemeral: true})

    tournament_id = parseInt(await bot.Tournaments.count()) + 1

    let poster = args.get("poster") ? args.get("poster").value : null
    let challonge = args.get("challonge") ? args.get("challonge").value : null

    let embed = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url})
    .setTitle(args.get("title").value)
    .setURL(bot.url)
    .setDescription(args.get("description").value)
    .addFields(
      { name: ':small_blue_diamond: Date', value: `Le <t:${args.get("date").value}:F>`},
      { name: ':small_blue_diamond: Lieu', value: `${args.get("place").value}`},
      { name: ':small_blue_diamond: Règlement', value: `${args.get("ruleset").value}`},
      { name: ':small_blue_diamond: Format', value: `${args.get("format").value}`},
      { name: ':small_blue_diamond: Statut', value: "Inscriptions en cours"},
    )
    .setImage(poster)
    .setTimestamp()
    .setFooter({text: `Merci de consulter #📜-règles-tournois avant de vous inscrire.`, iconURL: `${message.guild.iconURL()}`})
    .setThumbnail(`${message.guild.iconURL()}`)

    if (challonge) embed.addFields({ name: ':small_blue_diamond: Challonge', value: `${args.get("challonge").value}` })
    embed.addFields({ name: '\u200B', value: `:small_blue_diamond: Fin des inscriptions le <t:${args.get("date_close").value}:F>.` })

    const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("Confirmer")
        .setStyle(Discord.ButtonStyle.Success),
      new Discord.ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("Annuler")
        .setStyle(Discord.ButtonStyle.Danger)
    )
    const collector = message.channel.createMessageComponentCollector({time: 30000, max: 1})
    message.editReply({embeds: [embed], components: [row]})

    collector.on('collect', async i => {
      await i.deferUpdate()
      if (i.customId === 'confirm') {
        tournament = await bot.Tournaments.create({
          tournament_id: tournament_id,
          tournament_name: args.get("title").value,
          tournament_desc: args.get("description").value,
          tournament_date: args.get("date").value,
          tournament_date_close: args.get("date_close").value,
          tournament_ruleset: args.get("ruleset").value,
          tournament_format: args.get("format").value,
          tournament_place: args.get("place").value,
          tournament_channel: args.get("post").value,
          tournament_message: "",
          tournament_role: "",
          tournament_poster: poster,
          tournament_status: "Inscriptions en cours",
          tournament_challonge: challonge,
        })

        event = await message.guild.scheduledEvents.create({
          name: args.get("title").value,
          scheduledStartTime: new Date(parseInt(args.get("date").value+"000")),
          scheduledEndTime: new Date(parseInt(args.get("date").value+"000")+10800000),
          privacyLevel: 2,
          entityType: 3,
          image: poster,
          description: args.get("description").value,
          entityMetadata: {location: args.get("place").value},
        })

        role = await message.guild.roles.create({
          name: "Participants "+args.get("title").value,
          color: "32ECE0",
          permissions : "0",
        })

        post = await require(`../events/.postEmbed.js`).run(bot, tournament, args.get("post").value)
        await bot.Tournaments.update({ tournament_message: post.id, tournament_event: event.id, tournament_role: role.id}, { where: { tournament_id: tournament_id }})

        await require("../events/.updatePlayers.js").run(bot, tournament.dataValues.tournament_id)

        return i.editReply({content: `Tournament **${args.get("title").value}** created with id : **${tournament_id}**.`, components: [], ephemeral: true})

      } else if (i.customId === 'cancel') {
        return i.editReply({content: 'Tournament creation canceled.', components: [], ephemeral: true})
      }
    })
  }
}
