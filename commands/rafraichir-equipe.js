const Discord = require("discord.js")

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
      message.guild.roles.fetch(team.dataValues.team_role).then(role => { role.setIcon(team.dataValues.team_logo) })
    }

    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
