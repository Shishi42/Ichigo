const Discord = require("discord.js")
const { fetch } = require('undici')
const cron = require("cron")

module.exports = {

  name: "envoyer-tournoi",
  description: "Envoie un embed avec un tournoi",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "ville",
      description: "Ville du tournoi",
      required: true,
      autocomplete: false,
    },
    {
      type: "role",
      name: "ping",
      description: "Quel role ping",
      required: true,
      autocomplete: false,
    },
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
      name: "lieu",
      description: "Lieu du tournoi",
      required: false,
      autocomplete: false,
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
      name: "date_pub",
      description: "Date to pub the tournament, format (DD/MM/YYYY-HH:mm:SS)",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ephemeral: true})

    let date = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1], args.get("date").value.split('-')[1].split(':')[2])

    let embed = new Discord.EmbedBuilder().setColor(bot.color)
    
    if(args.get("nom")) embed.setTitle(args.get("nom").value).setURL(bot.url)
    
    if (args.get("description")) embed.setDescription(args.get("description").value.replaceAll("\\n", "\n"))
    if (args.get("poster")) embed.setImage(args.get("poster").value)
    if (args.get("date")) embed.addFields({ name: ':small_orange_diamond: Date', value: `Le <t:${Math.floor(date)/1000}:F>`})
    embed.addFields({ name: ':small_orange_diamond: Lieu', value: args.get("ville").value + (args.get("lieu") ? ` - ${args.get("lieu").value}` : "")})  
    if (args.get("ruleset")) embed.addFields({ name: ':small_orange_diamond: Règlement', value: `${args.get("ruleset").value}`})
    if (args.get("format")) embed.addFields({ name: ':small_orange_diamond: Format', value: `${args.get("format").value}`})
    if (args.get("lien")) embed.addFields({ name: ":small_orange_diamond: Plus d'infos ⬇️", value: args.get("lien").value })          

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
    message.editReply({embeds: [embed], components: [row]})

    collector.on('collect', async i => {
      await i.deferUpdate()
      if (i.customId === 'confirm-post') {

        if (args.get("date_pub")){   
          prog = new Date(args.get("date_pub").value.split('-')[0].split('/')[2], args.get("date_pub").value.split('-')[0].split('/')[1] - 1, args.get("date_pub").value.split('-')[0].split('/')[0], args.get("date_pub").value.split('-')[1].split(':')[0], args.get("date_pub").value.split('-')[1].split(':')[1], args.get("date_pub").value.split('-')[1].split(':')[2])
          await i.editReply({ content: `Tournament post confirmed, waiting to post the __<t:${Math.floor(prog) / 1000}:d> at <t:${Math.floor(prog) / 1000}:T> (<t:${Math.floor(prog) / 1000}:R>)__.`, components: [], ephemeral: true })
        } else prog = new Date(parseInt(Math.floor(Date.now()+5)))

        new cron.CronJob(prog, async () => {
        
          await message.followUp({ content: `-# <@&${args.get("ping").value}>\n## Un nouveau tournoi arrive à __${args.get("ville").value.toUpperCase()}__`, embeds: [embed], components: []})
          
          return i.editReply({content: "C'est bon.", components: [], ephemeral: true})
        }).start()

      } else if (i.customId === 'cancel-post') {
        return i.editReply({content: "Annulé.", components: [], ephemeral: true})
      }
    })
  }
}
