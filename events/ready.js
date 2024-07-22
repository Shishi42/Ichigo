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
    "enregistrement" : "N'oubliez pas de valider votre présence au tournoi dans https://discord.com/channels/1221611301332193371/1227020880614260866 sinon on va se tape <:chopan_pouce:1255261127055769700>",
    "picpus" : "https://maps.app.goo.gl/Pqqkx2S8ZfM2xv7J8",

    "1on1" : "Le règlement **1 on 1** se joue seul et non en équipe, chaque joueur assemble et ne joue **qu'une seule et même toupie** lors de l'intégralité du tournoi, les matchs sont joués en 4 points avec la règle du gain de point en fonction du finish (xtreme, burst, over, spin). De plus ce règlement est soumis à la limited-list de Takara Tomy (1 point bonus par pièce pour l'adversaire si vous utilisez CobaltDrake, PhoenixWing, WizardRod, 9-60, Orb ou Ball).",
    "3on3" : "Le règlement **3 on 3** se joue seul et non en équipe, chaque joueur assemble 3 toupies en n'utilisant **aucun composant en double**, lors d'un match le joueur joue un round avec chaque toupie dans l'ordre qu'il le souhaite, pour déterminer le vainqueur on note le cumul des résultats des 3 matchs avec la règle du gain de point en fonction du finish (xtreme, burst, over, spin).",
    "3vs3" : "Le règlement **3 vs 3** se joue en équipe de 3 joueurs, chaque joueur assemble et ne joue **qu'une seule et même toupie** lors de l'intégralité du tournoi en n'utilisant **aucun composant en double** dans l'équipe, lors d'un match l'équipe joue 1 round avec chaque joueur dans l'ordre qu'elle le souhaite, les matchs sont joués en 3 points et chaque finish ne rapporte qu'un point.",
    "simple_elim" : "Dans le format **simple élimination** il ne suffit de perdre qu'un seul match pour être éliminé du tournoi.",
    "double_elim" : "Dans le format **double élimination** il faut perdre 2 matchs pour être éliminé du tournoi.",

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

  await bot.Tournaments.sync()
  await bot.Inscriptions.sync()
  console.log("Database Online.")

  await slashcommands_loader(bot)

  bot.user.setPresence({activities: [{ name: "Les matchs de la Tour X", type: 3 }], status: "online"})

  //bot.channels.fetch("1221669438944841811").then(channel => channel.messages.fetch().then(messages => messages.forEach((message) => message.reactions.removeAll())))
  
  async function lots_of_messages_getter(channel, limit = 300) {
    const sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.messages.fetch(options);
        sum_messages.push(messages);
        last_id = messages.last().id;

        if (messages.size != 100 || sum_messages >= limit) {
            break;
        }
    }

    return sum_messages;
  }

  messages = await lots_of_messages_getter(bot.channels.cache.get("1221669438944841811"))
  console.log(messages.size)
}
