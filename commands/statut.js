const Discord = require("discord.js")

module.exports = {

  name: "statut",
  description: "Affiche le statut du BOT",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",

  async run(bot, message, args) {

    function duration(ms){
      let sec = Math.floor((ms / 1000) % 60).toString()
      let min = Math.floor((ms / (1000 * 60)) % 60).toString()
      let hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
      let days = Math.floor((ms / (1000 * 60 * 60 * 24))).toString()

     return `${days.padStart(1, '0')}d, ${hrs.padStart(2, '0')}h, ${min.padStart(2, '0')}m, ${sec.padStart(2, '0')}s.`
    }

    return await message.reply(`- BOT ping : \`${Date.now() - message.createdTimestamp}\`\n- API ping : \`${Math.round(bot.ws.ping)}\`\n- En ligne depuis \`${duration(bot.uptime)}\``)
  }
}
