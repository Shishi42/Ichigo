module.exports = {

  async run(bot, tournament) {

    let place = await bot.Places.findOne({ where: { place_id: tournament.dataValues.tournament_place } })
    let channel = await bot.channels.fetch(place.dataValues.place_info.split('/')[5]) 
    //await channel.messages.delete(channel.lastMessageId)

    msg = `## ${place.dataValues.place_city}` + "\n"

    msg += `Début de l'évènement le <t:${tournament.dataValues.tournament_date}:F> (<t:${tournament.dataValues.tournament_date}:R>)` 

    msg += ` au **${place.dataValues.place_name.toUpperCase()}**, situé au **${place.dataValues.place_number} ${place.dataValues.place_road}, ${place.dataValues.place_postcode}, à ${place.dataValues.place_city}** !` + "\n"

    msg += "\n"

    msg += "- Tout le monde est convié, même ceux qui ne comptent pas prendre part à la compétition et qui veulent seulement observer."+"\n"
    msg += "- Le staff arrivera un peu avant l'heure du début du tournoi pour gérer les préparatifs." + "\n"
    msg += "- Du free-play sera également organisé pendant l'évènement." + "\n"

    msg += "\n"

    msg += "** Nous serons intransigeants sur votre attitude quant au respect des règles et au respect que vous aurez vis-à-vis de vos adversaires ou des organisateurs." + "\n"
    msg += "Toute insulte, manque de respect ou moquerie mènera inéluctablement à votre exclusion de l'évènement.**" + "\n"
   
    msg += "\n"

    msg += `Merci de confirmer votre présence pour le tournoi dans le canal ${place.dataValues.place_inscr} avant le début du tournoi.` + "\n"
      
    msg += "\n"

    msg += "Informations complémentaires :" + "\n"
    msg += `- Le **${tournament.dataValues.tournament_name}** se joue sur le règlement **${tournament.dataValues.tournament_ruleset}**, merci d'en consulter les règles dans https://discordapp.com/channels/1221611301332193371/1221671605348864031 avant le début du tournoi.` + "\n"
    msg += "- La participation à cet évènement donne, par défaut, le droit aux organisateurs les droits à l'image des participants prises lors de l'évènement." + "\n"
    msg += "- Vous restez responsable de vos effets personnels, aucune consigne n'est disponible sur place." + "\n"
    msg += "- La consommation sur place est **obligatoire** pour vous inscrire, de plus **aucune nourriture ou boisson extérieure ne sera accepté**." + "\n"
    msg += `- Pour vous aider à trouver le lieu où se déroule le tournoi, vous pouvez utiliser ce lien Google Maps : ${place.dataValues.place_maps}` + "\n"

    msg += "\n"

    msg += `Challonge : https://challonge.com/${tournament.dataValues.tournament_id}` + "\n"

    msg += "\n"

    msg += "Hâte de tous·tes vous voir, Bladers !"

    return await channel.send(msg)
  }
}
