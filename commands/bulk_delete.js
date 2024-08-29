const Discord = require("discord.js")
const fs = require('fs')

module.exports = {

  name: "bulk_delete",
  description: "Bulk delete messages",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utility",
  options: [
    {
      type: "string",
      name: "number",
      description: "The number of message to delete",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "after",
      description: "The id of the last message remaining",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    number = args.get("number")?.value
    after = args.get("after")?.value

    if ((!number && !after) || (number && after)) return await message.editReply({ content: "You need to provide at least a number or the last message id but not both.", ephemeral: true })
    if (number && (isNaN(parseInt(number)) || parseInt(number) <= 0)) return await message.editReply({ content: "The number provided is not valid.", ephemeral: true })
    if (after){
      try { await message.channel.messages.fetch(after) }
      catch { return await message.editReply({ content: "The message provided does not exist.", ephemeral: true }) }
    }
    const sum_messages = []

    if (number) await message.channel.bulkDelete(number)
    else {
      messages = await message.channel.messages.fetch({after: after})
      messages.forEach(element => element.delete())
    }
    
    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
