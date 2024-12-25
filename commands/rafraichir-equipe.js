const Discord = require("discord.js")

module.exports = {

  name: "rafraichir-equipe",
  description: "Rafraichit les équipes sur le serveur",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Équipe",

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let teams = await bot.Teams.findAll({ where: { teammate_status: "ACTIVE" } })

    for (team of teams) {
      await require(`../events/.postTeamEmbed.js`).run(bot, team, true)  
    }

    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
