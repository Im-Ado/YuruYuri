import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.includes('youtu')) {
    return m.reply(`🔗 *Debes ingresar un enlace válido de YouTube!*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/abc123xyz`)
  }

  await m.react('🕒')

  try {
    const api = `https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(text)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json?.result?.video) {
      await m.react('❌')
      return m.reply('❌ No se pudo descargar el video.')
    }

    await conn.sendMessage(m.chat, {
      video: { url: json.result.video },
      fileName: json.result.filename,
      mimetype: 'video/mp4'
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`❌ Error al descargar el video.`)
  }
}

handler.help = ['ytmp4 <url>']
handler.tags = ['downloader']
handler.command = ['ytm4']
export default handler