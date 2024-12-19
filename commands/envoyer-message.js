const Discord = require("discord.js")
const cron = require("cron")

module.exports = {

  name: "envoyer-message",
  description: "Envoie un message avec un texte",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "texte",
      description: "le texte du message",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "date",
      description: "la date à laquel programmer le message, format (DD/MM/YYYY-HH:mm:SS)",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    if (args.get("date")){     
      let datetime = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1], args.get("date").value.split('-')[1].split(':')[2])
      new cron.CronJob(datetime, () => { message.channel.send(args.get("texte").value.replaceAll("\\n", "\n")) }).start()
      return await message.reply({ content: `C'est bon, le message sera envoyé le __<t:${Math.floor(datetime) / 1000}:d> à <t:${Math.floor(datetime) / 1000}:T> (<t:${Math.floor(datetime) / 1000}:R>)__.`, ephemeral: true })
    } else {
      await message.channel.send(args.get("texte").value.replaceAll("\\n", "\n"))
      return await message.reply({content: "C'est bon.", ephemeral: true})
    }
  }
}
