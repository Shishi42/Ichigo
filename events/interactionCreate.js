const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

  if (interaction.type === Discord.InteractionType.ApplicationCommand) { require(`../commands/${interaction.commandName}`).run(bot, interaction, interaction.options) }

  else if (interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

    let choices = []
    let focusedOption = interaction.options.getFocused(true)

    let tournaments = await bot.Tournaments.findAll()
    let teams = await bot.Teams.findAll({ where: { team_status: "ACTIVE" } })

    if (interaction.commandName === "aide") { choices = bot.commands.map(cmd => cmd.name) }
    if (focusedOption.name === "tournament_id") { choices = tournaments.map(tournament => `${tournament.dataValues.tournament_id} - ${tournament.dataValues.tournament_name}`) }
    if (focusedOption.name === "team_id") { choices = teams.map(team => `${team.dataValues.team_id} - ${team.dataValues.team_name}`) }
    if (focusedOption.name === "format") { choices = ["Double Élimination ", "Simple Élimination", "Round Robin", "Swiss", "Free-for-All"] }
    if (focusedOption.name === "ruleset") { choices = ["3 on 3", "1 on 1", "3 vs 3"] }
    if (focusedOption.name === "status") { choices = ["Inscriptions en cours", "Inscriptions finies", "Tournoi en cours", "Tournoi fini", "ACTIVE", "INACTIVE"] }
    if (focusedOption.name === "place") { choices = ["Dernier Bar avant la Fin du Monde, Paris", "Guyajeux, Marseille", "Baraka Jeux, Marseille"] }

    let filtered = choices.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()))
    if (!focusedOption.value) filtered = choices
    if (filtered.length > 20) filtered = filtered.slice(0, 20)
    await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })))
  }

  else if (interaction.isButton()) {

    if (interaction.customId.includes("tournament-")) {

      let tournament_id = interaction.customId.split('-')[2]
      let player_id = interaction.user.id

      let inscr = await bot.Inscriptions.findOne({ where: { player_id: player_id, tournament_id: tournament_id } })
      let tournament = await bot.Tournaments.findOne({ where: { tournament_id: tournament_id } })

      console.log(tournament_id)

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
      return require("./.updatePlayers.js").run(bot, tournament_id)
    }
  }
}
