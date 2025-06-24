import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔍 Pon el nombre del video para buscar\nEjemplo:\n${usedPrefix + command} Bad Bunny Yonaguni`)

  await m.react('🕒')

  try {
    // Buscar con Delirius
    const searchRes = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`)
    const searchData = await searchRes.json()

    if (!searchData.status || !searchData.data || !searchData.data[0]) {
      await m.react('❌')
      return m.reply('❌ No encontré resultados para tu búsqueda.')
    }

    const video = searchData.data[0]
    const videoUrl = `https://youtube.com/watch?v=${video.videoId}`

    // Descargar con la API tuya usando la URL
    const downloadRes = await fetch(`https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(videoUrl)}`)
    const downloadData = await downloadRes.json()

    if (!downloadData?.result?.video) {
      await m.react('❌')
      return m.reply('❌ No se pudo descargar el video.')
    }

    const { title, video: videoLink, filename } = downloadData.result

    // Mandar mensaje con miniatura y detalles
    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption:
        `🎬 *${title}*\n` +
        `📁 Archivo: ${filename}\n` +
        `🔗 Link: ${videoUrl}\n\n` +
        `🌐 Descargado con Adonix API`
    }, { quoted: m })

    // Mandar video
    await conn.sendMessage(m.chat, {
      video: { url: videoLink },
      fileName: filename,
      mimetype: 'video/mp4'
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Error al procesar tu solicitud.')
  }
}

handler.help = ['playvideo <nombre del video>']
handler.tags = ['downloader']
handler.command = ['playvideo']

export default handler