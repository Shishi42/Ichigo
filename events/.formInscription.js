const Discord = require("discord.js")

module.exports = {

  async run(bot, interaction) {

    let tournament_id = interaction.customId.split('-')[2]
    let tournament = await bot.Tournaments.findOne({ where: { tournament_id: tournament_id } })

    let modal = new Discord.ModalBuilder()
      .setCustomId('tournament-inscription' + '-' + tournament_id)
      .setTitle(tournament.dataValues.tournament_name)

    let input = new Discord.TextInputBuilder()
      .setCustomId('validation-regles')
      .setLabel("Avez-vous bien lu le règlement du tournoi ?".toUpperCase())
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder("Je confirme avoir lu le règlement.")
      .setValue("Je confirme avoir lu le règlement.")
      .setRequired(true)

    modal.addComponents(new Discord.ActionRowBuilder().addComponents(input))
    await interaction.showModal(modal)
  }
}