const Discord = require("discord.js")
const config = require("./config.json")

const bot = new Discord.Client({intents: 3276799})
const fs = require("fs")
const cron = require("cron")

bot.commands = new Discord.Collection()
bot.color = "BEF0ED"
bot.url = "https://discord.gg/afEvCBF9XR"

fs.readdirSync("./events/").filter(f => f.endsWith(".js") && !f.startsWith('.')).forEach(async file => {
  let event = require(`./events/${file}`)
  bot.on(file.split(".js").join(""), event.bind(null, bot))
})

new cron.CronJob('00 00 07 * * wed', () => { bot.channels.fetch(config.general).then(channel => channel.send({ files: [{ attachment: './medias/poubelles.mp4' }], content: "Nous sommes mercredi, ça tombe bien c'est le jour où on sort les poubelles. 🗑️" }))}).start()

new cron.CronJob('00 00 07 * * fri', () => { bot.channels.fetch(config.general).then(channel => channel.send({ files: [{ attachment: './medias/jus.png' }], content: "Bon vendredi jus la team :call_me:" }))}).start()

new cron.CronJob('00 00 18 * * wed', () => { bot.channels.fetch(config.general).then(channel => channel.send({ files: [{ attachment: './medias/poubelles.mp4' }], content: "Nous sommes mercredi, ça tombe bien c'est le jour où on sort les poubelles. 🗑️" })) }).start()

bot.login(config.token)
