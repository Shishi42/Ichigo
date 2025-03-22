const Discord = require("discord.js")
const cron = require("cron")

module.exports = {

  name: "envoyer-annonce",
  description: "Envoie une annonce",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "annonce",
      description: "l'annonce à envoyer",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "tournament_id",
      description: "le tournoi en rapport avec l'annonce",
      required: false,
      autocomplete: true,
    },
    {
      type: "string",
      name: "date",
      description: "la date à laquel programmer le message, format (DD/MM/YYYY-HH:mm:SS)",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "option1",
      description: "option supplémentaire",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    if (args.get("tournament_id").value.startWith("tournoi")) {

      if (!args.get("tournament_id")) return await message.reply({ content: "Vous devez fournir un tournoi.", ephemeral: true })

      let id = args.get("tournament_id").value.split(" - ")[0]
      let tournament = await bot.Tournaments.findOne({ where: { tournament_id: id } })
      if (!tournament) return await message.reply({ content: "Le tournoi fourni n'est pas valide.", ephemeral: true })

      let place = await bot.Places.findOne({ where: { place_id: tournament.dataValues.tournament_place } })

      let option = args.get("option1") ? args.get("option1").value : ""
      let ping = tournament.dataValues.tournament_role
      let title = tournament.dataValues.tournament_title
    }
    
    if (bot.annonces[args.get("annonce").value]) {

        if (args.get("date")){     
          let datetime = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1], args.get("date").value.split('-')[1].split(':')[2])
          new cron.CronJob(datetime, () => { message.channel.send(bot.annonces[args.get("annonce").value] ) }).start()
          return await message.reply({ content: `C'est bon, les règles seront envoyées le __<t:${Math.floor(datetime) / 1000}:d> à <t:${Math.floor(datetime) / 1000}:T> (<t:${Math.floor(datetime) / 1000}:R>)__.`, ephemeral: true })
        } else {
          await message.channel.send(bot.annonces[args.get("annonce").value] )
          return await message.reply({content: "C'est bon.", ephemeral: true})
        }
    } else return await message.reply({ content: "Pas de d'annonces disponibles à ce nom.", ephemeral: true })
  }
}