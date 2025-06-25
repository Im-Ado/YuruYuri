//CODE OFC DE YURU YURI 🤠 
import Starlights from '@StarlightsTeam/Scraper'
import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
  let formatos = ["mp3", "mp4", "mp3doc", "mp4doc"]
  let [formato, ...busqueda] = text.split(" ")

  if (!formatos.includes(formato)) {
    return conn.reply(
      m.chat,
      `✦ *Formato inválido.*\n\n` +
      `🧩 *Usa el comando así:*\n> *${usedPrefix + command}* mp3 Alan Walker\n\n` +
      `🎧 *Formatos válidos:*\n` +
      `• mp3\n• mp3doc\n• mp4\n• mp4doc`,
      m
    )
  }

  if (!busqueda.length) {
    return conn.reply(
      m.chat,
      `✦ *Falta el título del video.*\n\n` +
      `🧩 *Ejemplo:*\n> *${usedPrefix + command}* mp4 Alan Walker - Faded`,
      m
    )
  }

  await m.react('🕓')

  let res = await yts(busqueda.join(" "))
  let video = res.videos[0]

  let caption = `*「✦」 » ${video.title}*\n\n`
  caption += `> = Duración » ${video.timestamp}\n`
  caption += `> = Visitas » ${formatNumber(video.views)}\n`
  caption += `> = Autor » ${video.author.name}\n`
  caption += `> = Publicado » ${eYear(video.ago)}\n`
  caption += `> = Enlace » https://youtu.be/${video.videoId}\n\n`
  caption += `*Enviando..*`

  await conn.sendFile(m.chat, video.thumbnail, 'thumb.jpg', caption, m)

  try {
    let data = formato.includes('mp3') ? await Starlights.ytmp3(video.url) : await Starlights.ytmp4(video.url)
    let isDoc = formato.includes('doc')
    let mimetype = formato.includes('mp3') ? 'audio/mpeg' : 'video/mp4'

    await conn.sendMessage(
      m.chat,
      {
        [isDoc ? 'document' : formato.includes('mp3') ? 'audio' : 'video']: { url: data.dl_url },
        mimetype,
        fileName: `${data.title}.${formato.includes('mp3') ? 'mp3' : 'mp4'}`
      },
      { quoted: m }
    )

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('✖️')
    conn.reply(m.chat, '✦ Ocurrió un error al descargar el archivo.', m)
  }
}

handler.help = ['play2 <formato> <búsqueda>']
handler.tags = ['download']
handler.command = ['ytplay']
export default handler

function eYear(txt) {
  if (!txt) return '×'
  const replacements = [
    ['month ago', 'mes'], ['months ago', 'meses'],
    ['year ago', 'año'], ['years ago', 'años'],
    ['hour ago', 'hora'], ['hours ago', 'horas'],
    ['minute ago', 'minuto'], ['minutes ago', 'minutos'],
    ['day ago', 'día'], ['days ago', 'días']
  ]
  for (const [en, es] of replacements) {
    if (txt.includes(en)) return 'hace ' + txt.replace(en, es).trim()
  }
  return txt
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
