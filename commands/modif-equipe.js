const Discord = require("discord.js")

module.exports = {

  name: "modif-equipe",
  description: "Modifie une équipe sur le serveur.",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: true,
  category: "Équipe",
  options: [
    {
      type: "string",
      name: "team_id",
      description: "Team id",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "name",
      description: "Team name",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "description",
      description: "Team description",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "logo",
      description: "Team logo",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "color",
      description: "Team color",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "team_status",
      description: "Team status",
      required: false,
      autocomplete: true,
    },
    {
      type: "user",
      name: "member0",
      description: "Team captain",
      required: false,
      autocomplete: true,
    },
    {
      type: "user",
      name: "member1",
      description: "Team member1",
      required: false,
      autocomplete: true,
    },
    {
      type: "user",
      name: "member2",
      description: "Team member2",
      required: false,
      autocomplete: true,
    },
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let id = args.get("team_id").value.split(" - ")[0]
    console.log(id)
    let team = await bot.Teams.findOne({ where: { team_id: id } })
    if (!team) return await message.editReply({ content: "Team provided does not exist.", ephemeral: true })

    if (args.get("name")){
      let team_with_name = await bot.Teams.findOne({ where: { team_name: args.get("name").value, team_status: "ACTIVE" } })
      if (team_with_name) return await message.editReply({ content: `Team **${args.get("name").value}** already exists.`, ephemeral: true })
      bot.Teams.update({ team_name: args.get("name").value }, { where: { team_id: id } })
      
      await message.guild.roles.edit(team.dataValues.team_role, { name: args.get("name").value })
    } 

    if (args.get("description")) bot.Teams.update({ team_desc: args.get("description").value.replaceAll("\\n", "\n") }, { where: { team_id: id } })   

    if (args.get("logo")) { await bot.Teams.update({ team_logo: args.get("logo").value }, { where: { team_id: team.dataValues.team_id } })} 

    if (args.get("color")){
      bot.Teams.update({ team_color: args.get("color").value }, { where: { team_id: id } })
      message.guild.roles.fetch(team.dataValues.team_role).then(role => role.setColor(args.get("color").value))
    } 

    if (args.get("member0")) {
      
      let new_member0 = await bot.Teammates.findOne({ where: { teammate_discord: args.get("member0").value, teammate_status: "ACTIVE" } })
      if (new_member0) {
        let team = await bot.Teams.findOne({ where: { team_id: new_member0.dataValues.team_id } })
        return await message.editReply({ content: `<@${new_member0}> in already in team **${team.dataValues.team_name}**.`, ephemeral: true })
      }

      let member0 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "0", teammate_status: "ACTIVE" } })
      bot.Teammates.update({ teammate_status: "INACTIVE" }, { where: { teammate_id: member0.dataValues.teammate_id } })
      message.guild.members.fetch(member0.dataValues.teammate_discord).then(member => member.roles.remove(team.dataValues.team_role))
      message.guild.members.fetch(member0.dataValues.teammate_discord).then(member => member.roles.remove(bot.role_capitaine))

      await bot.Teammates.create({
        teammate_id: parseInt(await bot.Teammates.count()) + 1,
        teammate_discord: args.get("member0").value,
        team_id: team.dataValues.team_id,
        teammate_number: "0",
        teammate_status: "ACTIVE",
      })

      message.guild.members.fetch(args.get("member0").value).then(member => member.roles.add(team.dataValues.team_role))
      message.guild.members.fetch(args.get("member0").value).then(member => member.roles.add(bot.role_capitaine))
    } 

    if (args.get("member1")) {

      let new_member1 = await bot.Teammates.findOne({ where: { teammate_discord: args.get("member1").value, teammate_status: "ACTIVE" } })
      if (new_member1) {
        let team = await bot.Teams.findOne({ where: { team_id: new_member1.dataValues.team_id } })
        return await message.editReply({ content: `<@${new_member1}> in already in team **${team.dataValues.team_name}**.`, ephemeral: true })
      }

      let member1 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "1", teammate_status: "ACTIVE" } })
      bot.Teammates.update({ teammate_status: "INACTIVE" }, { where: { teammate_id: member1.dataValues.teammate_id } })
      message.guild.members.fetch(member1.dataValues.teammate_discord).then(member => member.roles.remove(team.dataValues.team_role))

      await bot.Teammates.create({
        teammate_id: parseInt(await bot.Teammates.count()) + 1,
        teammate_discord: args.get("member1").value,
        team_id: team.dataValues.team_id,
        teammate_number: "1",
        teammate_status: "ACTIVE",
      })

      message.guild.members.fetch(args.get("member1").value).then(member => member.roles.add(team.dataValues.team_role))
    } 

    if (args.get("member2")) {

      let new_member2 = await bot.Teammates.findOne({ where: { teammate_discord: args.get("member2").value, teammate_status: "ACTIVE" } })
      if (new_member2) {
        let team = await bot.Teams.findOne({ where: { team_id: new_member2.dataValues.team_id } })
        return await message.editReply({ content: `<@${new_member2}> in already in team **${team.dataValues.team_name}**.`, ephemeral: true })
      }

      let member2 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "2", teammate_status: "ACTIVE" } })
      bot.Teammates.update({ teammate_status: "INACTIVE" }, { where: { teammate_id: member2.dataValues.teammate_id } })
      message.guild.members.fetch(member2.dataValues.teammate_discord).then(member => member.roles.remove(team.dataValues.team_role))

      await bot.Teammates.create({
        teammate_id: parseInt(await bot.Teammates.count()) + 1,
        teammate_discord: args.get("member2").value,
        team_id: team.dataValues.team_id,
        teammate_number: "2",
        teammate_status: "ACTIVE",
      })

      message.guild.members.fetch(args.get("member2").value).then(member => member.roles.add(team.dataValues.team_role))
    } 

    if (args.get("team_status")) {
      bot.Teams.update({ team_status: args.get("team_status").value }, { where: { team_id: id } })

      if (args.get("team_status").value == "INACTIVE"){ 

        let member0 = await bot.Teammates.findOne({ where: { team_id: id, teammate_status: "ACTIVE", teammate_number: "0" }})

        message.guild.members.fetch(member0.dataValues.teammate_discord).then(member => member.roles.remove(bot.role_capitaine))

        message.guild.roles.fetch(team.dataValues.team_role).then(role => role.delete())
        bot.channels.fetch(bot.liste_equipe).then(channel => channel.messages.fetch(team.dataValues.team_message).then(message => message.delete()))

        bot.Teammates.update({ teammate_status: "INACTIVE" }, { where: { team_id: id, teammate_status: "ACTIVE"} })
      }
    } 

    let team_updated = await bot.Teams.findOne({ where: { team_id: id, team_status: "ACTIVE" } })

    if (team_updated) await require(`../events/.postTeamEmbed.js`).run(bot, team_updated, true)     
    
    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}
