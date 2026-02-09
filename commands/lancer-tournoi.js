const Discord = require("discord.js")
const tmi = require('tmi.js')
const config = require("../config.json")

module.exports = {

  name: "lancer-tournoi",
  description: "Lance un tournoi sur Twitch",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "tournament_id",
      description: "The tournament id to start",
      required: true,
      autocomplete: true,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    const twitch_client = new tmi.client({ identity: { username: "sunafterthereign", password: config.twitch }, channels: ["sunafterthereign"] }) 
    twitch_client.connect()

    let id = args.get("tournament_id").value.split(" - ")[0]

    twitch_client.say("sunafterthereign", id)

    return await message.reply({content: "Done.", ephemeral: true})
  }
}
