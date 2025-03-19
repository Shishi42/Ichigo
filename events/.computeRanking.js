const { request } = require('undici')

module.exports = {

  async run(bot, tournaments) {

    let classement = {}

    for (tournament of tournaments) {

      let req = await request(`https://api.challonge.com/v1/tournaments/${tournament.dataValues.tournament_challonge}.json?include_participants=1&include_matches=1&api_key=${bot.challonge}`)
      let challonge = await req.body.json()

      for (participant of challonge.tournament.participants) {

        let blader = participant.participant

        if (classement[blader.name]) classement[blader.name]["participations"] += 1
        else {
          classement[blader.name] = {}

          classement[blader.name]["participations"] = 1
          classement[blader.name]["W"] = 0
          classement[blader.name]["L"] = 0

          classement[blader.name]["points"] = 0
          classement[blader.name]["wins"] = 0
        }

        if (blader.final_rank == 1) classement[blader.name]["wins"] += 1

        for (matches of challonge.tournament.matches) {

          let match = matches.match

          if (match.scores_csv.length == 3 && match.scores_csv != "0-0") {
            score = match.scores_csv.split("-").map(Number)

            if (blader.id == match.winner_id) {
              classement[blader.name]["W"] += 1
              classement[blader.name]["points"] += Math.max(...score)
            }
            else if (blader.id == match.loser_id) {
              classement[blader.name]["L"] += 1
              classement[blader.name]["points"] += Math.min(...score)
            }
          }
          else if (blader.id == match.loser_id) classement[blader.name]["L"] += 1
        }
      }
    }

    var items = Object.keys(classement).map(function (blader) {
      point_avg = classement[blader]["points"] / (classement[blader]["W"] + classement[blader]["L"])
      winrate = classement[blader]["W"] / (classement[blader]["W"] + classement[blader]["L"])
      winscore = winrate + (point_avg / 100)
      punish = 1 / (1 + (Math.floor(tournaments.length/2)+2) * (1 / (classement[blader]["participations"] * point_avg)))
      score = (punish * winscore * 100000).toFixed()
      // old_punish = 1 / (1 + 5 * (1 / (classement[blader]["participations"] * 3)))
      // old_score = (old_punish * winrate * 100000).toFixed()
      return [blader, score, point_avg, classement[blader]]
    })

    items.sort(function (a, b) { return a[1] != b[1] ? b[1] - a[1] : a[2] != b[2] ? b[2] - a[2] : a[3]["participations"] != b[3]["participations"] ? b[3]["participations"] - a[3]["participations"] : b[0] - a[0] })

    return items
  }
}
