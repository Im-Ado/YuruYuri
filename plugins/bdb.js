import Starlights from '@StarlightsTeam/Scraper'
import fetch from 'node-fetch'

let limit = 100

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0] || !args[0].includes('youtu')) {
    return conn.reply(m.chat, '[ ✰ ] Ingresa un enlace válido de *YouTube*.\n\n> *Ejemplo:* \n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m, rcanal)
  }

  await m.react('🕓')

  try {
    let res = await Starlights.ytmp4(args[0])

    if (!res || !res.title || !res.dl_url) {
      // Si no hay respuesta válida, intentamos enviar el enlace directamente
      await m.react('⚠️')
      return conn.reply(m.chat, `❌ No se pudo obtener información del video.\n\n🔗 Aquí tienes el enlace directo:\n${args[0]}`, m)
    }

    let { title, size, quality, thumbnail, dl_url } = res
    console.log({ title, size, quality, thumbnail, dl_url })

    if (!size.includes('MB')) {
      throw new Error(`❌ El tamaño no está en MB: ${size}`)
    }

    let peso = parseFloat(size.split('MB')[0])
    if (peso >= limit) {
      await m.react('✖️')
      return conn.reply(m.chat, `❌ El archivo pesa más de ${limit} MB (${size}), descarga cancelada.`, m, rcanal)
    }

    let img = await (await fetch(thumbnail)).buffer()

    let txt = '`乂  Y O U T U B E  -  M P 4`\n\n'
    txt += `        ✩   *Titulo* : ${title}\n`
    txt += `        ✩   *Calidad* : ${quality}\n`
    txt += `        ✩   *Tamaño* : ${size}\n\n`
    txt += `> *- ↻ El vídeo se está enviando, espera un momento...*`

    await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal)
    await conn.sendMessage(m.chat, {
      video: { url: dl_url },
      caption: `${title}`,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error('🛑 Error en el comando .yt:', e)
    await m.react('✖️')
    await conn.reply(m.chat, `❌ *Ocurrió un error al descargar el video:*\n\n${e.message}`, m)
  }
}

handler.help = ['ytmp4 *<link yt>*']
handler.tags = ['downloader']
handler.command = ['yt']
handler.register = true

export default handler