const Discord = require("discord.js")

module.exports = {

  name: "archive",
  description: "Get all files from a message",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "message",
      description: "Link to the message",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let channel = await message.guild.channels.fetch(args.get("message").value.split('/')[5])
    let msg = await channel.messages.fetch(args.get("message").value.split('/')[6])


    await msg.attachments.forEach(file => { message.channel.send(file.url) })

    return await message.editReply({content: "Done.", ephemeral: true})
  }
}
