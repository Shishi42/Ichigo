const Discord = require("discord.js")
const Canvas = require('@napi-rs/canvas')
const tinycolor = require('tinycolor2')

module.exports = {

  async run(bot, team, channel_id, type, logo) {

    let channel = await bot.channels.fetch(channel_id)   

    let canvas
    let context

    if (type == "logo"){
      canvas = Canvas.createCanvas(1000, 1000)
      context = canvas.getContext('2d')

      context.drawImage(await Canvas.loadImage(logo), 152, 152, 696, 696)
      context.drawImage(await Canvas.loadImage('./medias/Teams/base.png'), 0, 0, canvas.width, canvas.height)
    } 
    
    if (type == "emoji"){
      canvas = Canvas.createCanvas(200, 200)
      context = canvas.getContext('2d')
    
      context.drawImage(await Canvas.loadImage(logo), 30, 30, 139, 139)
      context.drawImage(await Canvas.loadImage('./medias/Teams/base.png'), 0, 0, canvas.width, canvas.height)
    }

    if (type == "affiche") {

      let member0 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "0", teammate_status: "ACTIVE" } })
      let member1 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "1", teammate_status: "ACTIVE" } })
      let member2 = await bot.Teammates.findOne({ where: { team_id: team.dataValues.team_id, teammate_number: "2", teammate_status: "ACTIVE" } })

      canvas = Canvas.createCanvas(1920, 1080)
      context = canvas.getContext('2d')
      Canvas.GlobalFonts.registerFromPath('./medias/Teams/impact.ttf', 'Impact')

      let x_avatar = 1044
      let taille_avatar = 172
      let x_pseudo = 1269
        
      context.drawImage(await Canvas.loadImage('./medias/Teams/background.png'), 0, 0, canvas.width, canvas.height)
      context.drawImage(await Canvas.loadImage('./medias/Teams/logo.png'), 0, 0, canvas.width, canvas.height)
      context.drawImage(await Canvas.loadImage(logo), 186, 386, 586, 586)
  
      context.font = '66px Impact'
      context.fillStyle = '#ffffff'
  
      let user0 = await channel.guild.members.fetch(member0.dataValues.teammate_discord)
      context.drawImage(await Canvas.loadImage(user0.user.displayAvatarURL({ forceStatic: true })), x_avatar, 363, taille_avatar, taille_avatar)    
      context.fillText(user0.displayName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''), x_pseudo, 478)
      
      let user1 = member1.dataValues.teammate_discord
      if (user1.match(/[0-9]{18}/)) {
        user1 = await channel.guild.members.fetch(member1.dataValues.teammate_discord)
        context.drawImage(await Canvas.loadImage(user1.user.displayAvatarURL({ forceStatic: true })), x_avatar, 566, taille_avatar, taille_avatar)
        context.fillText(user1.displayName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''), x_pseudo, 681) 
      } else {
        context.drawImage(await Canvas.loadImage('./medias/Teams/placeholder1.png'), 0, 0, canvas.width, canvas.height)
        context.fillText(user1.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''), x_pseudo, 681)
      } 
  
      let user2 = member2.dataValues.teammate_discord
      if (user2.match(/[0-9]{18}/)) {
        user2 = await channel.guild.members.fetch(member2.dataValues.teammate_discord)
        context.drawImage(await Canvas.loadImage(user2.user.displayAvatarURL({ forceStatic: true })), x_avatar, 769, taille_avatar, taille_avatar)
        context.fillText(user2.displayName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''), x_pseudo, 880)
      } else {
        context.drawImage(await Canvas.loadImage('./medias/Teams/placeholder2.png'), 0, 0, canvas.width, canvas.height)
        context.fillText(user2.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''), x_pseudo, 880)
      } 
  
      context.font = '54px Impact'
      context.fillText(((team.dataValues.team_desc.split('.').length - 1) >= 2 ? (team.dataValues.team_desc.split('.').slice(0, 2).join('. ') + '.') : team.dataValues.team_desc), 48, 280)    

      console.log("test")
      console.log(tinycolor('#171718').getBrightness())

      context.font = '200px Impact'
      console.log(team.dataValues.team_color)
      console.log(tinycolor('#' + team.dataValues.team_color).getBrightness())
      context.fillStyle = tinycolor('#' + team.dataValues.team_color).getBrightness() < 10 ? '#ffffff' : '#' + team.dataValues.team_color
      context.fillText(team.dataValues.team_name.toUpperCase(), 42, 210)  
  
      context.drawImage(await Canvas.loadImage('./medias/Teams/crown.png'), 0, 0, canvas.width, canvas.height)
    }

    return await channel.send({ content: "## [" + type.toUpperCase() + "] : __" + team.dataValues.team_name + "__ - " + new Date().toISOString().split('T')[0], files: [new Discord.AttachmentBuilder(await canvas.encode('png'), { name: type + '-equipe-' + team.dataValues.team_id + '.png' })] })
  }
}