const Sequelize = require("sequelize")
const slashcommands_loader = require("../slashcommands_loader")
const fs = require("fs")

module.exports = async bot => {

  console.log(`Connected as ${bot.user.tag}!`)

  bot.db = new Sequelize({
    dialect: "sqlite",
    storage: "./ichigo.db"
  })

  bot.Tournois = bot.db.define("tournoi", {
    tournoi_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    tournoi_nom: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    tournoi_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournoi_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    tournoi_place: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournoi_ruleset: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournoi_poster: {
      type: Sequelize.STRING,
    },
  })
  bot.Joueurs = bot.db.define("joueur", {
    joueur_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    tournoi_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    joueur_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  await bot.Tournois.sync()
  console.log("Database Online.")

  await slashcommands_loader(bot)

  bot.user.setPresence({activities: [{ name: "Les matchs de la Tour X", type: 3 }], status: "online"})
}
