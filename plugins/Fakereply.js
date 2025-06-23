import fetch from 'node-fetch'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Mande el nombre o link de la canción\nEjemplo:\n${usedPrefix + command} bad bunny`)

  try {
    // Mensaje que va primero con miniatura y detalles
    let res = await fetch(`https://theadonix-api.vercel.app/api/ytmp42?query=${encodeURIComponent(text)}`)
    let json = await res.json()

    if (!json.result?.audio) return m.reply('No se pudo obtener el audio.')

    let { title, url, thumbnail, duration, audio, filename } = json.result

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `🎶 ${title}\n⏰ Duración: ${duration}\n🔗 ${url}`
    }, { quoted: m })

    // Después manda el audio
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: filename,
      ptt: false
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('Error al descargar el audio')
  }
}

handler.help = ['ytmp42 <texto>']
handler.tags = ['descargas']
handler.command = ['play3']

export default handler