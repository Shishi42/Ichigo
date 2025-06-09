const Discord = require("discord.js")
const Canvas = require('@napi-rs/canvas')

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
      type: "role",
      name: "captain",
      description: "Captain role",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "post_logo",
      description: "Channel to post the team logo",
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
      type: "string",
      name: "member1",
      description: "Team member1",
      required: false,
      autocomplete: false,
    },
    {
      type: "string",
      name: "member2",
      description: "Team member2",
      required: false,
      autocomplete: false,
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

    if (args.get("logo")) { 
      let canvas = Canvas.createCanvas(1000, 1000)
      let context = canvas.getContext('2d')
  
      context.drawImage(await Canvas.loadImage(args.get("logo").value), 152, 152, 696, 696)
      context.drawImage(await Canvas.loadImage('./medias/Teams/base.png'), 0, 0, canvas.width, canvas.height)
  
      let channel_logo = await bot.channels.fetch(args.get("post_logo").value)   
      let msg_logo = await channel_logo.send({ content: "## " + team.dataValues.team_name, files: [new Discord.AttachmentBuilder(await canvas.encode('png'), { name: 'logo-equipe-' + id + '.png' })] })
      let logo = msg_logo.attachments.first().url

      await bot.Teams.update({ team_logo: logo }, { where: { team_id: team.dataValues.team_id } })
      await message.guild.roles.fetch(team.dataValues.team_role).then(role => { role.setIcon(logo) })
    } 

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
      message.guild.members.fetch(member0.dataValues.teammate_discord).then(member => member.roles.remove(args.get("captain").value))

      await bot.Teammates.create({
        teammate_id: parseInt(await bot.Teammates.count()) + 1,
        teammate_discord: args.get("member0").value,
        team_id: team.dataValues.team_id,
        teammate_number: "0",
        teammate_status: "ACTIVE",
      })

      message.guild.members.fetch(args.get("member0").value).then(member => member.roles.add(team.dataValues.team_role))
      message.guild.members.fetch(args.get("member0").value).then(member => member.roles.add(args.get("captain").value))
    } 

    if (args.get("member1")) {

      let new_member1 = await bot.Teammates.findOne({ where: { teammate_discord: args.get("member1").value, teammate_status: "ACTIVE" } })
      if (new_member1) {
        let team = await bot.Teams.findOne({ where: { team_id: new_member1.dataValues.team_id } })
        return await message.editReply({ content: `${new_member1.match(/[0-9]{18}/) ? "<@" + new_member1 + ">" : new_member1} is already in team **${team.dataValues.team_name}**.`, ephemeral: true })
      }

      let member1 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "1", teammate_status: "ACTIVE" } })
      bot.Teammates.update({ teammate_status: "INACTIVE" }, { where: { teammate_id: member1.dataValues.teammate_id } })
      if (member1.dataValues.teammate_discord.match(/[0-9]{18}/)) message.guild.members.fetch(member1.dataValues.teammate_discord).then(member => member.roles.remove(team.dataValues.team_role))

      await bot.Teammates.create({
        teammate_id: parseInt(await bot.Teammates.count()) + 1,
        teammate_discord: args.get("member1").value,
        team_id: team.dataValues.team_id,
        teammate_number: "1",
        teammate_status: "ACTIVE",
      })

      if (args.get("member1").value.match(/[0-9]{18}/)) message.guild.members.fetch(args.get("member1").value).then(member => member.roles.add(team.dataValues.team_role))
    } 

    if (args.get("member2")) {

      let new_member2 = await bot.Teammates.findOne({ where: { teammate_discord: args.get("member2").value, teammate_status: "ACTIVE" } })
      if (new_member2) {
        let team = await bot.Teams.findOne({ where: { team_id: new_member2.dataValues.team_id } })
        return await message.editReply({ content: `${new_member2.match(/[0-9]{18}/) ? "<@" + new_member2 + ">" : new_member2} is already in team **${team.dataValues.team_name}**.`, ephemeral: true })
      }

      let member2 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "2", teammate_status: "ACTIVE" } })
      bot.Teammates.update({ teammate_status: "INACTIVE" }, { where: { teammate_id: member2.dataValues.teammate_id } })
      if (member2.dataValues.teammate_discord.match(/[0-9]{18}/)) message.guild.members.fetch(member2.dataValues.teammate_discord).then(member => member.roles.remove(team.dataValues.team_role))

      await bot.Teammates.create({
        teammate_id: parseInt(await bot.Teammates.count()) + 1,
        teammate_discord: args.get("member2").value,
        team_id: team.dataValues.team_id,
        teammate_number: "2",
        teammate_status: "ACTIVE",
      })

      if (args.get("member2").value.match(/[0-9]{18}/)) message.guild.members.fetch(args.get("member2").value).then(member => member.roles.add(team.dataValues.team_role))
    } 

    if (args.get("team_status")) {
      bot.Teams.update({ team_status: args.get("team_status").value }, { where: { team_id: id } })

      if (args.get("team_status").value == "INACTIVE"){ 

        let member0 = await bot.Teammates.findOne({ where: { team_id: id, teammate_status: "ACTIVE", teammate_number: "0" }})

        message.guild.members.fetch(member0.dataValues.teammate_discord).then(member => member.roles.remove(args.get("captain").value))

        message.guild.roles.fetch(team.dataValues.team_role).then(role => role.delete())
        bot.channels.fetch(message.channel).then(channel => channel.messages.fetch(team.dataValues.team_message).then(message => message.delete()))

        bot.Teammates.update({ teammate_status: "INACTIVE" }, { where: { team_id: id, teammate_status: "ACTIVE"} })
      }
    } 

    let team_updated = await bot.Teams.findOne({ where: { team_id: id, team_status: "ACTIVE" } })

    if (team_updated) await require(`../events/.postTeamEmbed.js`).run(bot, team_updated, await bot.channels.fetch(team_updated.dataValues.team_message.split('/')[0]), true)     
    
    return await message.editReply({ content: "Done.", ephemeral: true })
  }
}