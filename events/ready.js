const Sequelize = require("sequelize")
const slashcommands_loader = require("../slashcommands_loader")
const fs = require("fs")

module.exports = async bot => {

  console.log(`Connected as ${bot.user.tag}!`)

  bot.tags = {
    "discord" : "https://discord.gg/afEvCBF9XR",
    "tiktok": "https://www.tiktok.com/@sunafterthereign",
    "instagram": "https://www.instagram.com/sunafterthereign",
    "twitter": "https://x.com/SunAfterTheBey",
    "youtube": "https://www.youtube.com/@SunAftertheReign",

    "achats" : "Notre guide d'achat : https://discord.com/channels/1221611301332193371/1230832023459860490/1242931207260475462",
    "data" : "Notre base de données des produits Beyblade X : https://docs.google.com/spreadsheets/d/1Wshh88T0oDORXXr4F7xVYK0cjBRMXYJE5KzoPjss_no",
    "tournoi" : "Sun After the Reign organise un tournoi tous les mois, le Beyblade Battle Tournament. Si une date n'est pas encore annoncée, alors ça arrivera bientôt dans https://discord.com/channels/1221611301332193371/1221670844279947316",

    "streaming" : "https://www.streaming-espace.fr",
  }

  bot.db = new Sequelize({
    dialect: "sqlite",
    storage: "./ichigo.db"
  })

  bot.Tournaments = bot.db.define("tournament", {
    tournament_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    tournament_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    tournament_desc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_date_close: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_ruleset: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_format: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_place: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_channel: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_poster: {
      type: Sequelize.STRING,
    },
    tournament_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_challonge: {
      type: Sequelize.STRING,
    },
    tournament_first: {
      type: Sequelize.STRING,
    },
    tournament_second: {
      type: Sequelize.STRING,
    },
    tournament_third: {
      type: Sequelize.STRING,
    },
    tournament_event: {
      type: Sequelize.STRING,
    },
  })
  bot.Inscriptions = bot.db.define("inscription", {
    inscription_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    player_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    player_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  await bot.Tournaments.sync()
  await bot.Inscriptions.sync()
  console.log("Database Online.")

  await slashcommands_loader(bot)

  bot.user.setPresence({activities: [{ name: "Les matchs de la Tour X", type: 3 }], status: "online"})
}
