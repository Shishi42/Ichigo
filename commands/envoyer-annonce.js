const Discord = require("discord.js")
const cron = require("cron")

module.exports = {

  name: "envoyer-annonce",
  description: "Envoie une annonce",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Utilitaire",
  options: [
    {
      type: "string",
      name: "annonce",
      description: "l'annonce à envoyer",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "tournament_id",
      description: "le tournoi en rapport avec l'annonce",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "date",
      description: "la date à laquel programmer le message, format (DD/MM/YYYY-HH:mm:SS)",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "option",
      description: "option supplémentaire",
      required: false,
      autocomplete: false,
    },
  ],

  async run(bot, message, args) {
    
    let id = args.get("tournament_id").value.split(" - ")[0]
    let tournament = await bot.Tournaments.findOne({ where: { tournament_id: id } })
    if (!tournament) return await message.reply({ content: "Le tournoi fourni n'est pas valide.", ephemeral: true })

    let place = await bot.Places.findOne({ where: { place_id: tournament.dataValues.tournament_place } })

    let option = args.get("option") ? args.get("option").value : ""
    let ping = tournament.dataValues.tournament_role
    let title = tournament.dataValues.tournament_name

    let annonces = {
      "Rappel": `-# <@&${ping}>\n## Rappel concernant le __${title}__ au ${place.dataValues.place_name.toUpperCase()} ${place.dataValues.place_number} ${place.dataValues.place_road}, ${place.dataValues.place_postcode}, à ${place.dataValues.place_city}.\n\n- entre 12h30 et 13h00\n  - Les organisateurs arrivent sur le lieu pour préparer l'endroit et y installer le matériel.\n- à partir de 13h00 :\n  - Accueil des joueurs, c'est le moment de prendre votre **consommation obligatoire pour participer.**\n  - Début des inscriptions, merci de venir vous inscrire avec la **preuve d'achat** de votre consommation, pour qu'on puisse noter votre nom.\n- à 14h30 :\n  - Fin des inscriptions et génération de l'arbre des matchs du tournoi.\n  - Discours de début de tournoi, point sur l'organisation et sur les règles.\n- vers 15h00\n  - Début des matchs\n  - Pour vous organiser, les matchs seront joués **dans l'ordre numérique** du [**Challonge**](https://challonge.com/${id}).\n- autour de 20h00\n  - Fin des matchs et remise des prix.\n  - Discours de fin et fin de l'événement.\n### Attention nous n'attendrons pas les retardataires, afin de ne pas retarder les matchs nous clôturerons les inscriptions à 14h30.\nEn attendant merci de bien relire https://discord.com/channels/1221611301332193371/1221671605348864031, et de suivre https://discord.com/channels/1221611301332193371/1227239491488579686 pour ne rien rater.`,
      "Guide": `-# <@&${ping}>\n## Voici un guide étape par étape concernant l'inscription au ${title}.\n\n1. Se rendre au **${place.dataValues.place_name.toUpperCase()}** ${place.dataValues.place_number} ${place.dataValues.place_road}, ${place.dataValues.place_postcode}, à ${place.dataValues.place_city}.\n2. Prendre sa consommation au bar.\n  1. Pensez à demander et conserver le ticket de caisse, il vous servira à valider votre inscription.\n  2. Merci de bien indiquer au barman si vous souhaitez juste payer une consommation sans la consommer, afin d'éviter tout gaspillage.\n  3. Vous pouvez aussi si vous le souhaitez, payer votre consommation et aller la chercher plus tard, il vous faudra alors conserver votre ticket jusqu'au moment venu.\n3. Se rendre au sous-sol du bar dans la salle du tournoi et faire la queue pour rencontrer les arbitres.\n4. Les arbitres vous inscrivent, pour cela, merci de fournir :\n  1. Votre nom de blader.\n  2. Votre ticket de preuve d'achat d'une consommation, qu'on marquera à ce moment.\n5. Une fois le tout validé, vous êtes inscrit au tournoi Beyblade !\n6. Vous pouvez désormais faire un peu de free-play pour vous entraîner, mais restez vigilant à quand on vous appellera, sans réponse de votre part vous pourriez être disqualifié.`,
      "Inscriptions": `-# <@&${ping}>\n## Les inscriptions pour le __${title}__ sont maintenant ouvertes ! <:kamen_hype:1249459967015129139> \n\nRappel, voici un guide pour les inscriptions :arrow_right: ${option}\n\nAttention ! On vous demande de payer directement votre consommation quand vous arrivez afin de vous inscrire, n'oubliez pas de conserver votre preuve d'achat.\n\n**Merci de venir vous inscrire le plus tôt possible, les arbitres n'ayant pas à enregistrer votre deck ni à verifier vos équipements au moment de l'inscription vous pouvez venir valider votre inscription directement l'esprit tranquille.**\n\nUne fois inscrit nous vous demandons impérativement de remonter au rez-de-chaussée afin de libérer la salle en attendant le début du tournoi.`,
    }

    if (annonces[args.get("annonce").value]) {
      if (args.get("date")){     
        let datetime = new Date(args.get("date").value.split('-')[0].split('/')[2], args.get("date").value.split('-')[0].split('/')[1] - 1, args.get("date").value.split('-')[0].split('/')[0], args.get("date").value.split('-')[1].split(':')[0], args.get("date").value.split('-')[1].split(':')[1], args.get("date").value.split('-')[1].split(':')[2])
        new cron.CronJob(datetime, () => { message.channel.send(annonces[args.get("annonce").value] ) }).start()
        return await message.reply({ content: `C'est bon, l'annonce seront envoyées le __<t:${Math.floor(datetime) / 1000}:d> à <t:${Math.floor(datetime) / 1000}:T> (<t:${Math.floor(datetime) / 1000}:R>)__.`, ephemeral: true })
      } else {
        await message.channel.send(annonces[args.get("annonce").value] )
        return await message.reply({content: "C'est bon.", ephemeral: true})
      }
    } else return await message.reply({ content: "Pas de d'annonces disponibles à ce nom.", ephemeral: true })
  }
}