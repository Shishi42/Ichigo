const Discord = require("discord.js")

module.exports = {

  name: "rafraichir-equipe",
  description: "Rafraichit les équipes sur le serveur",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Équipe",

  async run(bot, message, args) {

    let teams = await bot.Teams.findAll({ where: { team_status: "ACTIVE" } })

    for (team of teams) await require(`../commands/modif-equipe.js`).run(bot, message, {team_id : team.dataValues.team_id, post_resource : team.dataValues.team_logo.split('/')[0]}, true)

    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
