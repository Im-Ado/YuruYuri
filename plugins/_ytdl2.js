import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🔍 Dame el nombre o link de YouTube:\n\nEjemplo:\n${usedPrefix + command} Shape of You`)

  await m.react('🎬')

  try {
    // 1️⃣ Si no es URL, busca con Delirius
    let videoUrl = text
    if (!/(youtube\.com|youtu\.be)/i.test(text)) {
      const sr = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`)
      const si = await sr.json()
      if (!si.status || !si.data?.[0]) {
        await m.react('❌')
        return m.reply('❌ No encontré ningún video con ese término.')
      }
      videoUrl = `https://youtube.com/watch?v=${si.data[0].videoId}`
    }

    // 2️⃣ Pide descarga al API de Adonix
    const resp = await fetch(`https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(videoUrl)}`)
    const j = await resp.json()
    if (!j.result || !j.result.video) {
      console.error('🔴 API respondió error o sin video:', j)
      await m.react('❌')
      return m.reply('❌ No se pudo descargar el video.')
    }

    const { title, video, thumbnail, filename, duration, url } = j.result

    // 3️⃣ Mensaje con miniatura + detalles
    const cap = `🎞 *Descarga YouTube*\n\n` +
      `📝 *Título:* ${title}\n` +
      `⏱ *Duración:* ${duration}\n` +
      `🔗 *Link:* ${url}\n\n` +
      `_Solicitado por ${m.pushName}_\n` +
      `⚙️ *Descargado con Adonix API*`

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: cap }, { quoted: m })

    // 4️⃣ Envía el video
    await conn.sendMessage(m.chat, {
      video: { url: video },
      mimetype: 'video/mp4',
      fileName: filename
    }, { quoted: m })

    await m.react('✅')
  } catch (err) {
    console.error('💥 Error en handler ytmp4:', err)
    await m.react('⚠️')
    m.reply('❌ Ocurrió un error al procesar tu petición.')
  }
}

handler.help = ['ytmp4 <texto o url>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'playvideo']

export default handler