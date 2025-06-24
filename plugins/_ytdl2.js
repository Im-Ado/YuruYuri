import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🎬 Ingresa el enlace del video de YouTube.\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/tu-enlace`)

  try {
    await m.react('⏳')

    // Petición a la API
    let api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(text)}`
    let res = await fetch(api)
    let json = await res.json()

    if (!json?.result?.video) {
      await m.react('❌')
      return m.reply('❌ No se pudo obtener el video.')
    }

    let { title, video, filename } = json.result

    // Mensaje previo con miniatura (opcional, si consigues miniatura)
    let info = `🎬 *${title}*\n\n📁 *Archivo:* ${filename}\n\n🌐 *Descargado con:* Adonix API`
    await conn.sendMessage(m.chat, { text: info }, { quoted: m })

    // Enviar el video
    await conn.sendMessage(m.chat, {
      video: { url: video },
      fileName: filename,
      mimetype: 'video/mp4',
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    return m.reply('❌ Ocurrió un error al procesar el video.')
  }
}

handler.help = ['ytmp4 <url>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'playvideo']

export default handler