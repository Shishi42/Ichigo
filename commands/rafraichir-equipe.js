const Discord = require("discord.js")

module.exports = {

  name: "rafraichir-equipe",
  description: "Rafraichit les équipes sur le serveur",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Équipe",
  options: [
    {
      type: "role",
      name: "captain",
      description: "Captain role",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "post_resource",
      description: "Channel to post the team resources",
      required: true,
      autocomplete: true,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let teams = await bot.Teams.findAll({ where: { team_status: "ACTIVE" } })

    for (team of teams) await require(`../commands/modif-equipe.js`).run(bot, message, {team_id : team.dataValues.team_id, captain : args.get("captain").value, post_resource : args.get("post_resource").value}, true)

    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
