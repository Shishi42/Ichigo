const Discord = require("discord.js")
const Canvas = require('@napi-rs/canvas')

module.exports = {

  name: "ajout-equipe",
  description: "Ajoute une équipe sur le serveur.",
  permission: Discord.PermissionFlagsBits.Administrator,
  dm: false,
  category: "Équipe",
  options: [
    {
      type: "string",
      name: "name",
      description: "Team name",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "description",
      description: "Team description",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "logo",
      description: "Team logo",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "color",
      description: "Team color",
      required: true,
      autocomplete: false,
    },
    {
      type: "user",
      name: "member0",
      description: "Team captain",
      required: true,
      autocomplete: true,
    },
    {
      type: "string",
      name: "member1",
      description: "Team member1",
      required: true,
      autocomplete: false,
    },
    {
      type: "string",
      name: "member2",
      description: "Team member2",
      required: true,
      autocomplete: false,
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
      name: "post_team",
      description: "Channel to post the team embed",
      required: true,
      autocomplete: true,
    },
    {
      type: "channel",
      name: "post_resource",
      description: "Channel to post the team resources",
      required: true,
      autocomplete: true,
    }
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let team_id = parseInt(await bot.Teams.count()) + 1
    let captain = await message.guild.roles.fetch(args.get("captain").value)

    let name = args.get("name").value
    let description = args.get("description").value.replaceAll("\\n", "\n")
    let color = args.get("color").value
    let member0 = args.get("member0").value
    let member1 = args.get("member1").value 
    let member2 = args.get("member2").value

    let team_with_name = await bot.Teams.findOne({ where: { team_name: name, team_status: "ACTIVE" } })
    let user0 = await bot.Teammates.findOne({ where: { teammate_discord: member0, teammate_status: "ACTIVE" } })
    let user1 = await bot.Teammates.findOne({ where: { teammate_discord: member1, teammate_status: "ACTIVE" } }) 
    let user2 = await bot.Teammates.findOne({ where: { teammate_discord: member2, teammate_status: "ACTIVE" } }) 

    if (team_with_name) return await message.editReply({ content: `Team **${name}** already exists.`, ephemeral: true })

    if (user0) {
      let team = await bot.Teams.findOne({ where: { team_id: user0.dataValues.team_id } })
      return await message.editReply({ content: `<@${member0}> is already in team **${team.dataValues.team_name}**.`, ephemeral: true })
    }

    if (user1) {
      let team = await bot.Teams.findOne({ where: { team_id: user1.dataValues.team_id } })
      return await message.editReply({ content: `${member1.match(/[0-9]{18}/) ? "<@" + member1 + ">" : member1} is already in team **${team.dataValues.team_name}**.`, ephemeral: true })
    }

    if (user2) {
      let team = await bot.Teams.findOne({ where: { team_id: user2.dataValues.team_id } })
      return await message.editReply({ content: `${member2.match(/[0-9]{18}/) ? "<@" + member2 + ">" : member2} is already in team **${team.dataValues.team_name}**.`, ephemeral: true })
    }

    canvas = Canvas.createCanvas(1000, 1000)
    context = canvas.getContext('2d')

    context.drawImage(await Canvas.loadImage(args.get("logo").value), 152, 152, 696, 696)
    context.drawImage(await Canvas.loadImage('./medias/Teams/base.png'), 0, 0, canvas.width, canvas.height)

    let embed = new Discord.EmbedBuilder()
      .setTitle(name)
      .setDescription(description)
      .setColor(color)
      .addFields(
        { name: 'Capitaine', value: "<@" + member0 + ">", inline: true }, 
        { name: 'Membre', value: member1.match(/[0-9]{18}/) ? "<@" + member1 + ">" : member1, inline: true },
        { name: 'Membre', value: member2.match(/[0-9]{18}/) ? "<@" + member2 + ">" : member2, inline: true },
      )

    let row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("confirm-team")
          .setLabel("Confirmer")
          .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
          .setCustomId("cancel-team")
          .setLabel("Annuler")
          .setStyle(Discord.ButtonStyle.Danger)
      )
    let collector = message.channel.createMessageComponentCollector({ time: 30000, max: 1 })
    message.editReply({ embeds: [embed], components: [row] })

    collector.on('collect', async i => {
      await i.deferUpdate()
      if (i.customId === 'confirm-team') {

        let team = await bot.Teams.create({
          team_id: team_id,
          team_name: name,
          team_desc: description,
          team_color: color,
          team_logo: "",
          team_affiche: "",
          team_emoji: "",
          team_status: "ACTIVE",
          team_message: "",
          team_role: "",
        })

        await bot.Teammates.create({
          teammate_id: parseInt(await bot.Teammates.count()) + 1,
          teammate_discord: member0,
          team_id: team_id,
          teammate_number: "0",
          teammate_status: "ACTIVE",
        })

        await bot.Teammates.create({
          teammate_id: parseInt(await bot.Teammates.count()) + 1,
          teammate_discord: member1,
          team_id: team_id,
          teammate_number: "1",
          teammate_status: "ACTIVE",
        })

        await bot.Teammates.create({
          teammate_id: parseInt(await bot.Teammates.count()) + 1,
          teammate_discord: member2,
          team_id: team_id,
          teammate_number: "2",
          teammate_status: "ACTIVE",
        })        

        let role = await message.guild.roles.create({
          name: name,
          color: color,
          permissions: "0",
          position: captain.position,
        })   

        message.guild.members.fetch(member0).then(member => member.roles.add(role))
        message.guild.members.fetch(member0).then(member => member.roles.add(captain))
        if (member1.match(/[0-9]{18}/)) message.guild.members.fetch(member1).then(member => member.roles.add(role))
        if (member2.match(/[0-9]{18}/)) message.guild.members.fetch(member2).then(member => member.roles.add(role))

        let msg_logo = await require(`../events/.generateTeamImage.js`).run(bot, team, args.get("post_resource").value, "logo", args.get("logo").value)
        let msg_emoji = await require(`../events/.generateTeamImage.js`).run(bot, team, args.get("post_resource").value, "emoji", args.get("logo").value)
        let msg_affiche = await require(`../events/.generateTeamImage.js`).run(bot, team, args.get("post_resource").value, "affiche", msg_logo.attachments.first().url, "affiche",)
        let server_emoji = await message.guild.emojis.create({ attachment: msg_emoji.attachments.first().url, name: name.toLowerCase().normalize("NFD").replaceAll(' ', '_').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '').replaceAll(/[\u0300-\u036f]/g, "") })
        await bot.Teams.update({ team_logo: args.get("post_resource").value + "/" + msg_logo.id, team_emoji: args.get("post_resource").value + "/" + msg_emoji.id + "/" + server_emoji.id, team_affiche: args.get("post_resource").value + "/" + msg_affiche.id }, { where: { team_id: team_id } })
        let team_updated = await bot.Teams.findOne({ where: { team_id: team_id } })

        let post = await require(`../events/.postTeamEmbed.js`).run(bot, team_updated, await bot.channels.fetch(args.get("post_team").value))
        // await role.setIcon(server_emoji)
        await post.react(server_emoji)
        await bot.Teams.update({ team_message: args.get("post_team").value + "/" + post.id, team_role: role.id }, { where: { team_id: team_id } })

        return i.editReply({ content: `Team **${name}** created with id : **${team_id}**.`, components: [], ephemeral: true })

      } else if (i.customId === 'cancel-team') {
        return i.editReply({ content: 'Team creation canceled.', components: [], ephemeral: true })
      }
    })
  }
}
