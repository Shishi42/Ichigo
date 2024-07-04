const Discord = require("discord.js")

module.exports = {

  name: "challonge_to_sheets",
  description: "Convert challonge team-listing to Google Sheets",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utility",
  options: [
    {
      type: "string",
      name: "teams",
      description: "The teams",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {
    teams = args.get("teams").value.slice(0,-1).replaceAll(") ",'|').replaceAll(" (",'-').replaceAll(" - ",'-')
    return await message.reply({content : teams.split('|').map(team => `${team.split('-')[0]} ${team.split('-')[1]}\n${team.split('-')[0]} ${team.split('-')[2]}\n${team.split('-')[0]} ${team.split('-')[3]}\n`).join(' '), ephemeral : true})
  }
}