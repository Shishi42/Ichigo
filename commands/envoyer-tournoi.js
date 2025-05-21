const Discord = require("discord.js")
const { fetch } = require('undici')
const cron = require("cron")
const { contentwarehouse_v1 } = require("googleapis")

module.exports = {

  name: "envoyer-tournoi",
  description: "Envoie un embed avec un tournoi",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "nom",
      description: "Nom du tournoi",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "description",
      description: "Description du tournoi",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "lieu",
      description: "Lieu du tournoi",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "date",
      description: "Date du tournoi, format (DD/MM/YYYY-HH:mm:SS)",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "ruleset",
      description: "Ruleset du tournoi",
      required: false,
      autocomplete: true,
    },
    {
      type: "string",
      name: "format",
      description: "Format du tournoi",
      required: false,
      autocomplete: true,
    },
    {
      type: "string",
      name: "poster",
      description: "URL Poster URL du tournoi",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "lien",
      description: "Lien du tournoi",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "infos",
      description: "Infos supplémentaires du tournoi",
      required: false,
      autocomplete: false,
    },
    {
      type: "role",
      name: "ping",
      description: "Quel role ping",
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

    let content = ""
    let medias = []
    let date = args.get("date") ? new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1], args.get("date").value.split('-')[1].split(':')[2]) : ""

    if(args.get("ping")) content += `-# <@&${args.get("ping").value}>\n`

    if(args.get("nom")) content += `## ${args.get("nom").value}` + "\n"

    if(args.get("description")) content += `${args.get("description").value.replaceAll("\\n", "\n")}` + "\n"

    if(args.get("description") || args.get("description")) content += "\n"
    if(!args.get("description") && !args.get("description")) content += "\n"

    if(args.get("date") || args.get("lieu") || args.get("format") || args.get("ruleset") || args.get("lien")) {
      content += ":small_orange_diamond: **Informations** :small_orange_diamond:" + "\n" + "\n"
      if (args.get("date")) content += `:date: Date : Le <t:${Math.floor(date) / 1000}:D>, à partir de <t:${Math.floor(date) / 1000}:t>` + "\n"
      if (args.get("lieu")) content += `:map: Lieu : ${args.get("lieu").value}` + "\n"
      if (args.get("format")) content += `:bar_chart: Format : ${args.get("format").value}` + "\n"
      if (args.get("ruleset")) content += `:scroll: Règlement : ${args.get("ruleset").value}` + "\n"
      if (args.get("lien")) content += `:globe_with_meridians: Lien : ${args.get("lien").value}` + "\n"
      content += "\n"
    }

    if (args.get("infos")) content += ":small_orange_diamond: **Informations supplémentaires** :small_orange_diamond:" + "\n" + "\n" + args.get("infos").value.replaceAll("\\n", "\n")
  
    if (args.get("poster")) medias.push({ attachment: args.get("poster").value })

    let row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("confirm-post")
          .setLabel("Confirmer")
          .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
          .setCustomId("cancel-post")
          .setLabel("Annuler")
          .setStyle(Discord.ButtonStyle.Danger)
      )
    let collector = message.channel.createMessageComponentCollector({time: 30000, max: 1})
    message.editReply({content: content, files : medias, components: [row]})

    collector.on('collect', async i => {
      await i.deferUpdate()
      if (i.customId === 'confirm-post') {

        if (args.get("date_pub")){   
          prog = new Date(args.get("date_pub").value.split('-')[0].split('/')[2], args.get("date_pub").value.split('-')[0].split('/')[1] - 1, args.get("date_pub").value.split('-')[0].split('/')[0], args.get("date_pub").value.split('-')[1].split(':')[0], args.get("date_pub").value.split('-')[1].split(':')[1], args.get("date_pub").value.split('-')[1].split(':')[2])
          await i.editReply({ content: `Tournament post confirmed, waiting to post the __<t:${Math.floor(prog) / 1000}:d> at <t:${Math.floor(prog) / 1000}:T> (<t:${Math.floor(prog) / 1000}:R>)__.`, components: [], ephemeral: true })
        } else prog = new Date(parseInt(Math.floor(Date.now()+5)))

        new cron.CronJob(prog, async () => {
          message.channel.type == Discord.ChannelType.GuildAnnouncement ? await message.channel.send({content : content, files : medias}).then(message => message.crosspost()) : await message.channel.send({content : content, files : medias})
            
          return i.editReply({content: "C'est bon.", components: [], ephemeral: true})
        }).start()

      } else if (i.customId === 'cancel-post') {
        return i.editReply({content: "Annulé.", components: [], ephemeral: true})
      }
    })
  }
}
