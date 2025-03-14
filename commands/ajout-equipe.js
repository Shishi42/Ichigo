const Discord = require("discord.js")

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
      type: "user",
      name: "member1",
      description: "Team member1",
      required: true,
      autocomplete: true,
    },
    {
      type: "user",
      name: "member2",
      description: "Team member2",
      required: true,
      autocomplete: true,
    },
    {
      type: "role",
      name: "captain",
      description: "Captain role",
      required: true,
      autocomplete: true,
    }
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let team_id = parseInt(await bot.Teams.count()) + 1
    let role_pos = await message.guild.roles.fetch(args.get("captain").value).position

    let name = args.get("name").value
    let description = args.get("description").value.replaceAll("\\n", "\n")
    let color = args.get("color").value
    let logo = args.get("logo").value
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
      return await message.editReply({ content: `<@${member0}> in already in team **${team.dataValues.team_name}**.`, ephemeral: true })
    }

    if (user1) {
      let team = await bot.Teams.findOne({ where: { team_id: user1.dataValues.team_id } })
      return await message.editReply({ content: `<@${user1}> in already in team **${team.dataValues.team_name}**.`, ephemeral: true })
    }

    if (user2) {
      let team = await bot.Teams.findOne({ where: { team_id: user2.dataValues.team_id } })
      return await message.editReply({ content: `<@${user2}> in already in team **${team.dataValues.team_name}**.`, ephemeral: true })
    }

    let embed = new Discord.EmbedBuilder()
      .setTitle(name)
      .setDescription(description)
      .setThumbnail(logo)
      .setColor(color)
      .addFields(
        { name: 'Capitaine', value: `<@${member0}>`},
        { name: 'Membre', value: `<@${member1}>`, inline: true },
        { name: 'Membre', value: `<@${member2}>`, inline: true },
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
          team_logo: logo,
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
          position: role_pos,
          icon: logo
        })   

        let post = await require(`../events/.postTeamEmbed.js`).run(bot, team, message.channel)

        message.guild.members.fetch(member0).then(member => member.roles.add(role))
        message.guild.members.fetch(member0).then(member => member.roles.add(args.get("captain").value))
        message.guild.members.fetch(member1).then(member => member.roles.add(role))
        message.guild.members.fetch(member2).then(member => member.roles.add(role))
       
        await bot.Teams.update({ team_message: post.id, team_role: role.id }, { where: { team_id: team_id } })

        return i.editReply({ content: `Team **${name}** created with id : **${team_id}**.`, components: [], ephemeral: true })

      } else if (i.customId === 'cancel-team') {
        return i.editReply({ content: 'Team creation canceled.', components: [], ephemeral: true })
      }
    })
  }
}
