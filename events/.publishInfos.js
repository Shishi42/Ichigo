module.exports = {

  async run(bot, tournament) {

    let channel = await bot.channels.fetch(tournament.dataValues.tournament_info)

    await channel.messages.fetch(channel.lastMessageId).then(ancien_message => ancien_message.delete())

    msg = ""

    if (tournament.dataValues.tournament_place.endsWith("Paris")) msg += "## Paris" + "\n"
    if (tournament.dataValues.tournament_place.endsWith("Marseille")) msg += "## Marseille" + "\n"

    msg += `Début de l'évènement le <t:${tournament.dataValues.tournament_date}:F> (<t:${tournament.dataValues.tournament_date}:R>)` 

    if (tournament.dataValues.tournament_place == "Dernier Bar avant la Fin du Monde, Paris") msg += " au **DERNIER BAR AVANT LA FIN DU MONDE**, situé au **19 Avenue Victoria, 75001, à Paris** !" + "\n"
    if (tournament.dataValues.tournament_place == "Guyajeux, Marseille") msg += " à **GUYAJEUX**, situé au **65 Avenue Jules Cantini, 13006, à Marseille** !" + "\n"

    msg += "\n"

    msg += "- Tout le monde est convié, même ceux qui ne comptent pas prendre part à la compétition et qui veulent seulement observer."+"\n"
    msg += "- Le staff arrivera un peu avant l'heure du début du tournoi pour gérer les préparatifs." + "\n"
    msg += "- Du free-play sera également organisé pendant l'évènement." + "\n"

    msg += "\n"

    msg += "** Nous serons intransigeants sur votre attitude quant au respect des règles et au respect que vous aurez vis-à-vis de vos adversaires ou des organisateurs." + "\n"
    msg += "Toute insulte, manque de respect ou moquerie mènera inéluctablement à votre exclusion de l'évènement.**" + "\n"
   
    msg += "\n"

    msg += "Merci de confirmer votre présence pour le tournoi dans le canal "
    if (tournament.dataValues.tournament_place.endsWith("Paris")) msg += "https://discordapp.com/channels/1221611301332193371/1227020880614260866"
    if (tournament.dataValues.tournament_place.endsWith("Marseille")) msg += "https://discordapp.com/channels/1221611301332193371/1289972474083282995"
    msg += " avant le début du tournoi." + "\n"
      
    msg += "\n"

    msg += "Informations complémentaires :" + "\n"
    msg += `- Le **${tournament.dataValues.tournament_name}** se joue sur le règlement **${tournament.dataValues.tournament_ruleset}**, merci d'en consulter les règles dans https://discordapp.com/channels/1221611301332193371/1221671605348864031 avant le début du tournoi.` + "\n"
    msg += "- La participation à cet évènement donne, par défaut, le droit aux organisateurs les droits à l'image des participants prises lors de l'évènement." + "\n"
    msg += "- Vous restez responsable de vos effets personnels, aucune consigne n'est disponible sur place." + "\n"
    msg += "- La consommation sur place est **obligatoire** pour vous inscrire, de plus **aucune nourriture ou boisson extérieure ne sera accepté**." + "\n"
    msg += "- Pour vous aider à trouver le lieu où se déroule le tournoi, vous pouvez utiliser ce lien Google Maps : "

    if (tournament.dataValues.tournament_place == "Dernier Bar avant la Fin du Monde, Paris") msg += "https://maps.app.goo.gl/3Zj4sCcDNsoYLc1e8" + "\n"
    if (tournament.dataValues.tournament_place == "Guyajeux, Marseille") msg += "https://maps.app.goo.gl/8WQxpQFx2G4S3XZg7" + "\n"

    msg += "\n"

    msg += `Challonge : https://challonge.com/${tournament.dataValues.tournament_id}` + "\n"

    msg += "\n"

    msg += "Hâte de tous·tes vous voir, Bladers !"

    return await channel.send(msg)
  }
}
