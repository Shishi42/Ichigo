const Discord = require("discord.js")

module.exports = {

    async run(bot, team, update = false) {

    let channel = bot.channels.cache.get(bot.liste_equipe)

    let member0 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "0", teammate_status: "ACTIVE"} })
    let member1 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "1", teammate_status: "ACTIVE" } })
    let member2 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "2", teammate_status: "ACTIVE" } })

    let embed = new Discord.EmbedBuilder()
      .setTitle(team.dataValues.team_name)
      .setDescription(team.dataValues.team_desc)
      .setThumbnail(team.dataValues.team_logo)
      .setColor(team.dataValues.team_color)
      .addFields(
        { name: 'Capitaine', value: `<@${member0.dataValues.teammate_discord}>` },
        { name: 'Membre', value: `<@${member1.dataValues.teammate_discord}>`, inline: true },
        { name: 'Membre', value: `<@${member2.dataValues.teammate_discord}>`, inline: true },
      )
    
    if (!update) return await channel.send({ embeds: [embed] })
    else return await channel.messages.fetch(team.dataValues.team_message).then(message => message.edit({ embeds: [embed] }))
  }
}
