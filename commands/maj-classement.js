const Discord = require("discord.js")
const Sequelize = require("sequelize")
const { google } = require("googleapis")

module.exports = {

  name: "maj-classement",
  description: "Mets à jour le classement.",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Classement",

  async run(bot, message, args) {

    // await message.channel.messages.delete(message.channel.lastMessageId)
    // await message.channel.messages.delete(message.channel.lastMessageId)
    // await message.channel.messages.delete(message.channel.lastMessageId)

    await message.deferReply({ ephemeral: true })

    const auth = new google.auth.GoogleAuth({ keyFile: "./google.json", scopes: ["https://www.googleapis.com/auth/spreadsheets"] })
    
    let values = []

    let tournaments_paris_bdd = await bot.Tournaments.findAll({ where: { tournament_name: { [Sequelize.Op.startsWith]: "Beyblade Battle Tournament" }, tournament_place: { [Sequelize.Op.endsWith]: "paris" }, tournament_ruleset: "3on3", tournament_season: bot.season } })
    let tournaments_marseille_bdd = await bot.Tournaments.findAll({ where: { tournament_name: { [Sequelize.Op.startsWith]: "Beyblade Battle Tournament" }, tournament_place: { [Sequelize.Op.endsWith]: "marseille" }, tournament_ruleset: "3on3", tournament_season: bot.season } })
    
    let classement_paris = await require("../events/.computeRanking.js").run(bot, tournaments_paris_bdd)
    let classement_marseille = await require("../events/.computeRanking.js").run(bot, tournaments_marseille_bdd)

    let classements = [[classement_paris, "Paris"], [classement_marseille, "Marseille"]]

    for (classement of classements) {

      values = new Array(300).fill(new Array(6).fill(""))
      await google.sheets({ version: "v4", auth: auth }).spreadsheets.values.update({ spreadsheetId: bot.top_bladers, range: `${classement[1]}!B2`, valueInputOption: "USER_ENTERED", resource: { values } })
      values = []
      
      res = "## Classement " + classement[1] + " au " + new Date().toLocaleDateString("fr-FR") + "\n-# Classement par score calculé sur l'ensemble des matchs de 3on3.\n```\n N°         NOM          SCORE    WIN\n\n"
      for (blader in classement[0].slice(0, 10)) {
        res += ' '.repeat(3 - ((parseInt(blader) + 1).toString()).length) + (parseInt(blader) + 1).toString() + ' '.repeat(4) + classement[0][blader][0] + ' '.repeat(18 - classement[0][blader][0].length) + classement[0][blader][1] + ' '.repeat(5) + classement[0][blader][3]["wins"] + "\n"
      }
      res += "```"
      await message.channel.send(res)

      for (blader in classement[0]) values.push([classement[0][blader][0], classement[0][blader][1], classement[0][blader][3]["wins"], classement[0][blader][3]["participations"], classement[0][blader][3]["W"] / (classement[0][blader][3]["W"] + classement[0][blader][3]["L"]), classement[0][blader][3]["points"]])   
      await google.sheets({ version: "v4", auth: auth }).spreadsheets.values.update({ spreadsheetId: bot.top_bladers, range: `${classement[1]}!B2`, valueInputOption: "USER_ENTERED", resource: { values } })

    }
    await message.channel.send("## Classement Complet au " + new Date().toLocaleDateString("fr-FR") + "\n-# https://docs.google.com/spreadsheets/d/e/2PACX-1vR3SoKvCW1BTnWs4ikQdlMxYDSOlUlEeeb_Qi0RpQoKSZG1dfEVluU3uj5LzLvwhKdRZh9IA4V8qa89/pubhtml")

    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
