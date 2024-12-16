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
    "tournoi": "Sun After the Reign organise un tournoi tous les mois, le Beyblade Battle Tournament. Si une date n'est pas encore annoncée, alors ça arrivera bientôt dans https://discord.com/channels/1221611301332193371/1221670844279947316",
    "enregistrement": "N'oubliez pas de valider votre présence au tournoi dans https://discord.com/channels/1221611301332193371/1227020880614260866 sinon on va se tape <:chopan_pouce:1255261127055769700>",

    "paris": "https://maps.app.goo.gl/3Zj4sCcDNsoYLc1e8",
    "marseille": "https://maps.app.goo.gl/dbFiBetKeugX3gPe7",

    "1on1" : "Le règlement **1 on 1** se joue seul et non en équipe, chaque joueur assemble et ne joue **qu'une seule et même toupie** lors de l'intégralité du tournoi, les matchs sont joués en 4 points avec la règle du gain de point en fonction du finish (xtreme, burst, over, spin).",
    "3on3" : "Le règlement **3 on 3** se joue seul et non en équipe, chaque joueur assemble 3 toupies en n'utilisant **aucun composant en double**, lors d'un match le joueur joue un round avec chaque toupie dans l'ordre qu'il le souhaite, les matchs sont joués en 4 points avec la règle du gain de point en fonction du finish (xtreme, burst, over, spin).",
    "3vs3" : "Le règlement **3 vs 3** se joue en équipe de 3 joueurs, chaque joueur assemble et ne joue **qu'une seule et même toupie** lors de l'intégralité du tournoi en n'utilisant **aucun composant en double** dans l'équipe, lors d'un match l'équipe joue 1 round avec chaque joueur dans l'ordre qu'elle le souhaite, les matchs sont joués en 3 points et chaque finish ne rapporte qu'un point.",
    //"simple_elim" : "Dans le format **simple élimination** il ne suffit de perdre qu'un seul match pour être éliminé du tournoi.",
    "double_elim" : "Dans le format **double élimination** il faut perdre 2 matchs pour être éliminé du tournoi.",

    "streaming" : "https://www.streaming-espace.fr",

    "salon" : "https://discordapp.com/channels/1221611301332193371/1221669702477021247/1297573105757196320"
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
    tournament_role: {
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
  bot.Teams = bot.db.define("team", {
    team_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    team_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_desc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_color: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_logo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_role: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  })
  bot.Teammates = bot.db.define("teammate", {
    teammate_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    teammate_discord: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    team_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    teammate_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    teammate_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  await bot.Tournaments.sync()
  await bot.Inscriptions.sync()
  await bot.Teams.sync()
  await bot.Teammates.sync()
  console.log("Database Online.")

  await slashcommands_loader(bot)

  bot.user.setPresence({activities: [{ name: "les matchs du BBT.", type: 3 }], status: "online"})

}
