const Sequelize = require("sequelize")
const slashcommands_loader = require("../slashcommands_loader")

module.exports = async bot => {

  console.log(`Connected as ${bot.user.tag}!`)

  bot.tags = {
    "discord" : "https://discord.gg/afEvCBF9XR",
    "tiktok": "https://www.tiktok.com/@sunafterthereign",
    "instagram": "https://www.instagram.com/sunafterthereign",
    "twitter": "https://x.com/SunAfterTheBey",
    "youtube": "https://www.youtube.com/@SunAftertheReign",

    "data" : "Notre base de données des produits Beyblade X : https://docs.google.com/spreadsheets/d/1Wshh88T0oDORXXr4F7xVYK0cjBRMXYJE5KzoPjss_no",
    "tournoi": "Sun After the Reign organise un tournoi tous les mois, le Beyblade Battle Tournament. Si une date n'est pas encore annoncée, alors ça arrivera bientôt dans https://discord.com/channels/1221611301332193371/1221670844279947316",
    "enregistrement": "N'oubliez pas de valider votre présence au tournoi dans https://discord.com/channels/1221611301332193371/1227020880614260866 sinon on va se tape <:chopan_pouce:1255261127055769700>",
    "salon": "https://discordapp.com/channels/1221611301332193371/1221669702477021247/1297573105757196320",

    "streaming" : "https://www.streaming-espace.fr",
  }

  bot.regles = {
    "générales": "# **Règles générales liées aux tournois Beyblade X :**\n- Tournoi **Beyblade X**, joué avec des toupies et équipements Beyblade X.\n- Format **Double Élimination**. (Il faut perdre 2 fois pour être éliminé du tournoi).\n- Un match (ou round) est un affrontement entre 2 joueurs (ou 2 équipes) et contient plus ou moins de lancer (ou battle) selon le règlement.\n- **Tournois ouverts à tout âge**, merci de rester poli et courtois avec vos adversaires.\n- Vous pouvez emprunter de l'équipement à un autre joueur si il est d'accord mais soyez certain de le rendre en temps et en heure ainsi qu'en bonne condition.\n- Pour des raisons techniques, le **bit Metal Needle (MN) est banni** afin de ne pas endommager les Stadiums.\n\nLes règles ci-dessous sont à prendre en connaissance avant chaque tournoi et peuvent être sujettes à modification, selon les décisions du staff ⬇️",
    "1on1": "# Déroulement d'un match __1on1__\n - Chaque joueur assemble **1 toupie**.\n - Puis le joueur déclare qu'il est prêt et présente sa toupie ainsi que son lanceur à l'arbitre pour vérification.\n\n- Le match est joué en 4 points gagnants avec les règles suivantes :\n  - **EXTREME FINISH** : 3 points\n  - **OVER FINISH** : 2 points\n  - **BURST FINISH** : 2 points\n  - **SPIN FINISH** : 1 point\n",
    "3on3": "# Déroulement d'un match __3on3__\n  - Chaque joueur assemble **3 toupies** en n'utilisant **aucun composant en double** parmi celles-ci.\n  - Ensuite le joueur désigne un ordre pour chacune de ses toupies, **n°1 n°2 et n°3**.\n  - Puis le joueur donne ses toupies, dans l'ordre, à l'arbitre afin qu'il procède à une vérification et puisse fournir à chaque battle les 2 toupies aux joueurs.\n  - Enfin, le joueur déclare qu'il est prêt et présente ses lanceurs à l'arbitre.\n\n- Le match est joué en 4 points gagnants, dans l'ordre des toupies, avec les règles suivantes :\n  - **EXTREME FINISH** : 3 points\n  - **OVER FINISH** : 2 points\n  - **BURST FINISH** : 2 points\n  - **SPIN FINISH** : 1 point\n- Si au bout de 3 battles aucun des joueurs n'a obtenu 4 points, on décide alors d'un nouvel ordre de toupies et le match continue jusqu'à ce qu'un des joueurs obtienne 4 points.",
    "3vs3": "# Déroulement d'un match __3vs3__\n  - Une équipe est composée de 3 joueurs, qui chacun assemble **1 toupie** en n'utilisant **aucun composant en double** parmi les 3 toupies de l'équipe.\n  - Ensuite l'équipe désigne un ordre pour chacun de ses joueurs, **n°1 n°2 et n°3**.\n  - Puis l'équipe déclare qu'elle est prête et présente ses toupies ainsi que ses lanceurs à l'arbitre pour vérification.\n    - Les joueurs de l'équipe affronte alors un joueur de l'équipe adverse selon son ordre, dans un set.\n-# Les 3 matchs sont joués en même temps sur 3 stadiums, afin que chaque joueur puisse jouer à chaque fois.\n\n- Les matchs sont joués en 4 points gagnants, avec les règles suivantes :\n  - **EXTREME FINISH** : 3 points\n  - **OVER FINISH** : 2 points\n  - **BURST FINISH** : 2 points\n  - **SPIN FINISH** : 1 point\n - La première équipe avec 2 victoires parmi ses 3 matchs est déclarée vainqueur.",
    "banlist-3vs3": "# Ban-list __3vs3__ by **Sun After the Reign**\n-# Le ruleset 3vs3 étant composé de 3 matchs 1on1 nous avons pris la décision suivante :\n- L'utilisation de **Wizard Rod (disque/blade)** est interdite.\n- L'utilisation de **Silver Wolf (disque/blade)** est interdite.\n- L'utilisation de **Metal Needle (pignon/bit)** est interdite.\n\nExemples :\n- WizardRod 1-60 Rush : ❌\n- DranSword 3-60 Metal Needle : ❌\n- CobaltDragoon 5-60 Elevate : ✅\n\nCe type de combo est interdit pour le prochain **Beyblade Battle Tournament Team Fight Edition** et ne peut donc être ajouté au deck de l'équipe.",
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
    tournament_message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tournament_season: {
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
    tournament_participants: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "auto",
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
  bot.Places = bot.db.define("place", {
    place_id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    place_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_road: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_postcode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_maps: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_info: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_inscr: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    place_access: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  })

  await bot.Tournaments.sync()
  await bot.Inscriptions.sync()
  await bot.Teams.sync()
  await bot.Teammates.sync()
  await bot.Places.sync()
  console.log("Database Online.")

  await slashcommands_loader(bot)

  bot.user.setPresence({activities: [{ name: "les matchs du BBT.", type: 3 }], status: "online"})

}
