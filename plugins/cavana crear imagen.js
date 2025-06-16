import { createCanvas, loadImage } from 'canvas'
import { writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import fetch from 'node-fetch'

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  const lines = []

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      lines.push(line)
      line = words[n] + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line)

  lines.forEach((l, i) => {
    ctx.fillText(l, x, y + (i * lineHeight))
  })
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Captura el texto con prioridad: argumento > texto citado > texto del mensaje
  const frase = (text && text.trim()) || (m.quoted?.text && m.quoted.text.trim()) || (m.text && m.text.trim())

  if (!frase) throw `*Uso:* ${usedPrefix + command} <frase o etiqueta un mensaje>`

  const user = m.quoted?.sender || m.sender
  const name = await conn.getName(user)

  const defaultImg = 'https://i.imgur.com/axnP93g.png'
  let imgUrl = await conn.profilePictureUrl(user, 'image').catch(() => defaultImg)
  const res = await fetch(imgUrl)
  const avatarBuffer = await res.buffer()
  const avatar = await loadImage(avatarBuffer)

  const bgRes = await fetch('https://files.catbox.moe/6tno0n.jpg')
  const bgBuffer = await bgRes.buffer()
  const bgImage = await loadImage(bgBuffer)

  const width = 900
  const height = 500
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fondo
  ctx.drawImage(bgImage, 0, 0, width, height)
  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.fillRect(0, 0, width, height)

  // Avatar circular grande
  const avatarSize = 160
  ctx.save()
  ctx.beginPath()
  ctx.arc(100 + avatarSize / 2, height - 140 + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, 100, height - 140, avatarSize, avatarSize)
  ctx.restore()

  // Texto de la frase
  ctx.fillStyle = '#ffffff'
  ctx.font = '38px sans-serif'
  wrapText(ctx, `"${frase}"`, 280, 100, 580, 44)

  // Autor
  ctx.fillStyle = '#dddddd'
  ctx.font = '22px sans-serif'
  ctx.fillText(`- ${name}`, 280, height - 50)

  // Guardar imagen temporal
  const out = join(tmpdir(), `frase_${user.split('@')[0]}.png`)
  writeFileSync(out, canvas.toBuffer())

  await conn.sendMessage(m.chat, {
    image: { url: out },
    caption: `_Frase de ${name}_`,
    mentions: [user]
  }, { quoted: m })
}

handler.help = ['mensaje <texto|etiqueta>']
handler.tags = ['maker']
handler.command = ['quote']

export default handler