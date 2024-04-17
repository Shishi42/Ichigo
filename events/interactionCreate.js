const Discord = require("discord.js")

module.exports = async (bot, interaction) => {

  if(interaction.type === Discord.InteractionType.ApplicationCommand) { require(`../commands/${interaction.commandName}`).run(bot, interaction, interaction.options) }

  else if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {

    let choices = []
    const focusedOption = interaction.options.getFocused(true)

    if(interaction.commandName === "help") { choices = bot.commands.map(cmd => cmd.name) }
    let filtered = choices.filter(choice => choice.toLowerCase().includes(focusedOption.value.toLowerCase()))
    if(!focusedOption.value) filtered = choices
    if(filtered.length > 20) filtered = filtered.slice(0, 20)
    await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })))

  }

  else if(interaction.isButton() && interaction.customId.includes("join")){
    tournament_id = interaction.customId.split("_join")[0]
    player_id = interaction.user.id

    let inscr = await bot.Inscriptions.findOne({ where: { player_id: player_id, tournament_id: tournament_id }})

    if(inscr?.dataValues.player_status == "INSCRIT") return await interaction.reply({content: "Tu es déjà inscrit à ce tournoi.", ephemeral : true})
    inscr ? await bot.Inscriptions.update({player_status : "INSCRIT"}, { where: { player_id: player_id, tournament_id: tournament_id }}) : await bot.Inscriptions.create({ inscription_id: parseInt(await bot.Inscriptions.count()) + 1, player_id: player_id, tournament_id: tournament_id, player_status: "INSCRIT" })
    require("./.updatePlayers.js").run(bot, tournament_id)
    return await interaction.reply({content: "Tu es désormais inscrit à ce tournoi, merci de consulter <#1221671605348864031> avant de participer.", ephemeral : true})
  }

  else if(interaction.isButton() && interaction.customId.includes("leave")){
    tournament_id = interaction.customId.split("_leave")[0]
    player_id = interaction.user.id

    let inscr = await bot.Inscriptions.findOne({ where: { player_id: player_id, tournament_id: tournament_id }})
    if(inscr?.dataValues.player_status == "DESINSCRIT") return await interaction.reply({content: "Tu es déjà désinscrit de ce tournoi.", ephemeral : true})
    inscr ? await bot.Inscriptions.update({player_status : "DESINSCRIT"}, { where: { player_id: player_id, tournament_id: tournament_id }}) : await bot.Inscriptions.create({ inscription_id: parseInt(await bot.Inscriptions.count()) + 1, player_id: player_id, tournament_id: tournament_id, player_status: "DESINSCRIT" })
    require("./.updatePlayers.js").run(bot, tournament_id)
    return await interaction.reply({content: "Tu es désormais désinscrit de ce tournoi, on espère te voir une prochaine fois.", ephemeral : true})
  }

}
