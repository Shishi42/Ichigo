const Discord = require("discord.js")
const cron = require("cron")

module.exports = {

  name: "envoyer-media",
  description: "Envoie un media depuis un lien",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "lien",
      description: "le lien du media",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "date",
      description: "la date à laquel programmer le message",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    if (args.get("date")){     
      let datetime = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1])
      new cron.CronJob(datetime, () => { message.channel.send({ files: [{ attachment: args.get("lien").value }] }) }).start()
      return await message.reply({ content: `C'est bon, le message sera envoyé le __<t:${Math.floor(datetime) / 1000}:F> (<t:${Math.floor(datetime) / 1000}:R>)__.`, ephemeral: true })
    } else {
      await message.channel.send({ files: [{ attachment: args.get("lien").value }] })
      return await message.reply({content: "C'est bon.", ephemeral: true})
    }
  }
}