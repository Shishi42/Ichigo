const Discord = require("discord.js")
const Canvas = require('@napi-rs/canvas')

module.exports = {

  name: "créer-logo-équipe",
  description: "Créer le logo d'une équipe à partir d'une image",
  permission: null,
  dm: true,
  category: "Équipe",
  options: [
    {
      type: "string",
      name: "image",
      description: "l'image de l'équipe",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, message, args) {

    await message.deferReply({ ephemeral: true })

    let canvas = Canvas.createCanvas(1000, 1000)
    let context = canvas.getContext('2d')

    context.drawImage(await Canvas.loadImage(args.get("image").value), 152, 152, 696, 696)
    context.drawImage(await Canvas.loadImage('./medias/base_equipe.png'), 0, 0, canvas.width, canvas.height)

    return await message.editReply({ content: "C'est bon.", files: [new Discord.AttachmentBuilder(await canvas.encode('png'), { name: 'logo-equipe.png' })], ephemeral: true })

  }
}
