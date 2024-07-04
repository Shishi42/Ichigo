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
    console.log(args.get("teams").value.replaceAll(") ",'|').replaceAll(" (",'-').replaceAll(" - ",'-').slice(0,-1))
    //return await message.reply(args.get("teams").value.split('\n').map((team) => `${team.split(" (")[0]} ${team.split(" (")[1].slice(0,-1).split(" - ")[0]}\n${team.split(" (")[0]} ${team.split(" (")[1].slice(0,-1).split(" - ")[1]}\n${team.split(" (")[0]} ${team.split(" (")[1].slice(0,-1).split(" - ")[2]}\n`).join('\n'))
  }
}