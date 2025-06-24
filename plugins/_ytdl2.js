import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔍 Escribe el nombre o URL de un video.\n\n📌 Ejemplo:\n${usedPrefix + command} Bad Bunny Yonaguni`)

  try {
    await m.react('🎬')

    // Ver si es un enlace directo de YouTube
    let isYTLink = /(youtube\.com|youtu\.be)/i.test(text)
    let videoUrl = text

    // Si no es link, buscar con Delirius API (ytsearch)
    if (!isYTLink) {
      const searchAPI = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`
      const res = await fetch(searchAPI)
      const json = await res.json()

      if (!json.status || !json.data || !json.data[0]) {
        await m.react('❌')
        return m.reply('❌ No se encontró ningún video con ese nombre.')
      }

      const videoId = json.data[0].videoId
      videoUrl = `https://youtube.com/watch?v=${videoId}`
    }

    // Descargar video con tu API
    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(videoUrl)}`
    const r = await fetch(api)
    const data = await r.json()

    if (!data?.result?.video) {
      await m.react('❌')
      return m.reply('❌ No se pudo descargar el video.')
    }

    const { title, video, thumbnail, filename, duration, url } = data.result

    const caption = `🎞 *Descarga de Video YouTube*\n\n` +
      `📌 *Título:* ${title}\n` +
      `⏳ *Duración:* ${duration}\n` +
      `🔗 *Link:* ${url}\n\n` +
      `_Solicitado por ${m.pushName}_\n` +
      `🔧 *Descargado con Adonix API*`

    // Enviar la miniatura primero
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m })

    // Enviar el video
    await conn.sendMessage(m.chat, {
      video: { url: video },
      mimetype: 'video/mp4',
      fileName: filename
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('⚠️')
    m.reply('❌ Hubo un error al intentar descargar el video.')
  }
}

handler.help = ['ytmp4 <texto o url>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'playvideo']

export default handler