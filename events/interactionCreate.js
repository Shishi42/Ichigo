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
    if (focusedOption.name === "place") { choices = ["Dernier Bar avant la Fin du Monde", "Baraka Jeux, Marseille"] }

    let filtered = choices.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()))
    if (!focusedOption.value) filtered = choices
    if (filtered.length > 20) filtered = filtered.slice(0, 20)
    await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })))
  }

  else if (interaction.isButton()) {
    if (interaction.customId.includes("join")) {
      let tournament_id = interaction.customId.split("tournament_join_")[1]
      let player_id = interaction.user.id

      let inscr = await bot.Inscriptions.findOne({ where: { player_id: player_id, tournament_id: tournament_id } })
      let tournament = await bot.Tournaments.findOne({ where: { tournament_id: tournament_id } })

      interaction.member.roles.add(tournament.dataValues.tournament_role)

      if (inscr?.dataValues.player_status == "INSCRIT") return await interaction.reply({ content: "Tu es déjà inscrit à ce tournoi.", ephemeral: true })
      inscr ? await bot.Inscriptions.update({ player_status: "INSCRIT" }, { where: { player_id: player_id, tournament_id: tournament_id } }) : await bot.Inscriptions.create({ inscription_id: parseInt(await bot.Inscriptions.count()) + 1, player_id: player_id, tournament_id: tournament_id, player_status: "INSCRIT" })
      require("./.updatePlayers.js").run(bot, tournament_id)
      return await interaction.reply({ content: "Tu es désormais inscrit à ce tournoi, merci de consulter <#1221671605348864031> avant de participer.", ephemeral: true })
    }
    else if (interaction.customId.includes("leave")) {
      let tournament_id = interaction.customId.split("tournament_leave_")[1]
      let player_id = interaction.user.id

      let inscr = await bot.Inscriptions.findOne({ where: { player_id: player_id, tournament_id: tournament_id } })
      let tournament = await bot.Tournaments.findOne({ where: { tournament_id: tournament_id } })

      interaction.member.roles.remove(tournament.dataValues.tournament_role)

      if (inscr?.dataValues.player_status == "DESINSCRIT") return await interaction.reply({ content: "Tu es déjà désinscrit de ce tournoi.", ephemeral: true })
      inscr ? await bot.Inscriptions.update({ player_status: "DESINSCRIT" }, { where: { player_id: player_id, tournament_id: tournament_id } }) : await bot.Inscriptions.create({ inscription_id: parseInt(await bot.Inscriptions.count()) + 1, player_id: player_id, tournament_id: tournament_id, player_status: "DESINSCRIT" })
      require("./.updatePlayers.js").run(bot, tournament_id)
      return await interaction.reply({ content: "Tu es désormais désinscrit de ce tournoi, on espère te voir une prochaine fois.", ephemeral: true })
    }

    /*else if (interaction.customId.includes("team_cancel")) {
      let team_id = interaction.customId.split("team_cancel_")[0]
      return bot.Teams.update({ team_status: "ANNULÉE" }, { where: { team_id: team_id } })
    }*/

  }

  /*else if (interaction.isModalSubmit() && interaction.customId.includes("team_modal")) {
    let captain = await bot.Teammates.findOne({ where: { teammate_discord: interaction.user.id, teammate_status: "ACTIF" } })
    if (captain){
      let team = await bot.Teams.findOne({ where: { team_id: captain.dataValues.team_id } })
      return await message.reply({ content: `Tu es déjà membres d'une équipe (${team.dataValues.team_name}).`, ephemeral: true })
    }
      
    let team_id = interaction.customId.split("team_modal_")[0]

    let name = interaction.fields.getTextInputValue('teamNameInput')
    let desc = interaction.fields.getTextInputValue('teamDescInput')
    let color = interaction.fields.getTextInputValue('teamColorInput')
    let logo = interaction.fields.getTextInputValue('teamLogoInput')

    let team = await bot.Teams.findOne({ where: { team_name: name, team_status: "ACTIVE" } })
    if (team) return await message.reply({ content: `Une équipe existe déjà avec ce nom.`, ephemeral: true })

    await bot.Teams.create({
      team_id: team_id,
      team_name: name,
      team_desc: desc,
      team_color: color,
      team_logo: logo,
      team_status: "BROUILLON",
      team_message: "",
      team_role: "",
    })

    let embed = new Discord.EmbedBuilder()
      .setColor(color)
      .setAuthor({ name: 'Ichigo - Sun After the Reign', iconURL: bot.user.displayAvatarURL(), url: bot.url })
      .setTitle(name)
      .setDescription(desc)
      .setTimestamp()
      .setThumbnail(logo)

    let row = new Discord.ActionRowBuilder().addComponents(new Discord.UserSelectMenuBuilder().setCustomId("team_members_"+team_id).setMinValues(2).setMaxValues(2).setPlaceholder('Selectionne tes 2 coéquipiers.'))

    let row2 = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("team_cancel_"+team_id).setLabel("Annuler").setStyle(Discord.ButtonStyle.Danger))

    interaction.reply({ embeds: [embed], components: [row, row2], ephemeral: true })
  }

  else if (interaction.customId.includes("team_members")) {
  }*/
}
