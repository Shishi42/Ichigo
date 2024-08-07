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
    },
    {
      type: "string",
      name: "before",
      description: "The id of the last message remaining",
      required: false,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    number = args.get("number").value
    before = args.get("before").value

    if ((!number && !before) || (number && before)) return await message.reply({ content: "You need to provide at least a number or the last message id but not both.", ephemeral: true })

    //if (number && number <= 0) return await message.reply({ content: "The tournament provided does not exist.", ephemeral: true })
    //if (!before) return await message.reply({ content: "The tournament provided does not exist.", ephemeral: true })
  
    const sum_messages = []
    
    while (true) {
        const options = {}
        if (number) options.limit = number 
        if (before) options.before = before

        messages = await channel.messages.fetch(options)
        sum_messages.push(messages)
        last_id = messages.last().id

        if (messages.size != 100 || sum_messages >= limit) break
    }
  
    messages = await lots_of_messages_getter(bot.channels.cache.get("1221669438944841811"))

    
    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
