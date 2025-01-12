module.exports = {

  async run(bot, interaction) {

    let tournament_id = interaction.customId.split('-')[2]
    let player_id = interaction.user.id

    let inscr = await bot.Inscriptions.findOne({ where: { player_id: player_id, tournament_id: tournament_id } })
    let tournament = await bot.Tournaments.findOne({ where: { tournament_id: tournament_id } })

    if (interaction.customId.includes("join")) {

      interaction.member.roles.add(tournament.dataValues.tournament_role)

      if (inscr?.dataValues.player_status == "INSCRIT") return await interaction.reply({ content: "Tu es déjà inscrit à ce tournoi.", ephemeral: true })
      inscr ? await bot.Inscriptions.update({ player_status: "INSCRIT" }, { where: { player_id: player_id, tournament_id: tournament_id } }) : await bot.Inscriptions.create({ inscription_id: parseInt(await bot.Inscriptions.count()) + 1, player_id: player_id, tournament_id: tournament_id, player_status: "INSCRIT" })
      await interaction.reply({ content: "Tu es désormais inscrit à ce tournoi, merci de consulter <#1221671605348864031> avant de participer.", ephemeral: true })
    }
    else if (interaction.customId.includes("leave")) {

      interaction.member.roles.remove(tournament.dataValues.tournament_role)

      if (inscr?.dataValues.player_status == "DESINSCRIT") return await interaction.reply({ content: "Tu es déjà désinscrit de ce tournoi.", ephemeral: true })
      inscr ? await bot.Inscriptions.update({ player_status: "DESINSCRIT" }, { where: { player_id: player_id, tournament_id: tournament_id } }) : await bot.Inscriptions.create({ inscription_id: parseInt(await bot.Inscriptions.count()) + 1, player_id: player_id, tournament_id: tournament_id, player_status: "DESINSCRIT" })
      await interaction.reply({ content: "Tu es désormais désinscrit de ce tournoi, on espère te voir une prochaine fois.", ephemeral: true })
    }
    return require(`./.postTournamentEmbed.js`).run(bot, tournament, true)   
  }

}