const Discord = require("discord.js")
const config = require("./config.json")

const bot = new Discord.Client({intents: 3276799})
const jsonfile = require ("jsonfile")
const fs = require("fs")

const slashcommands_loader = require("./slashcommands_loader")

bot.commands = new Discord.Collection()
bot.color = "BEF0ED"
bot.url = "https://discord.gg/afEvCBF9XR"

fs.readdirSync("./events/").filter(f => f.endsWith(".js") && !f.startsWith('.')).forEach(async file => {
  let event = require(`./events/${file}`)
  bot.on(file.split(".js").join(""), event.bind(null, bot))
})

bot.login(config.token)
