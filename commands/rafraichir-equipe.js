const Discord = require("discord.js")
const Canvas = require('@napi-rs/canvas')

module.exports = {

  name: "rafraichir-equipe",
  description: "Rafraichit les équipes sur le serveur",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Équipe",

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let teams = await bot.Teams.findAll({ where: { team_status: "ACTIVE" } })

    for (team of teams) {
      await require(`../events/.postTeamEmbed.js`).run(bot, team, message.channel, true)  
      let canvas = Canvas.createCanvas(1000, 1000)
      let context = canvas.getContext('2d')
      context.drawImage(await Canvas.loadImage(team.dataValues.team_logo), 0, 0, canvas.width, canvas.height)
      message.guild.roles.fetch(team.dataValues.team_role).then(role => { role.setIcon(canvas.encode('png')) })
    }

    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
