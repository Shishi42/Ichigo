const Discord = require("discord.js")

module.exports = {

  name: "status",
  description: "Show the BOT status",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utility",

  async run(bot, message, args) {

    function duration(ms){
     const sec = Math.floor((ms / 1000) % 60).toString()
     const min = Math.floor((ms / (1000 * 60)) % 60).toString()
     const hrs = Math.floor((ms / (1000 * 60 * 60)) % 24).toString()
     const days = Math.floor((ms / (1000 * 60 * 60 * 24))).toString()

     return `${days.padStart(1, '0')}d, ${hrs.padStart(2, '0')}h, ${min.padStart(2, '0')}m, ${sec.padStart(2, '0')}s.`
    }

    return await message.reply(`- BOT ping : \`${Date.now() - message.createdTimestamp}\`\n- API ping : \`${Math.round(bot.ws.ping)}\`\n- Online since \`${duration(bot.uptime)}\``)
  }
}
