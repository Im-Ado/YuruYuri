import fetch from 'node-fetch'

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(
    `⚠️ *Uso correcto:* ${usedPrefix + command} <nombre o link de la canción>\n` +
    `Ejemplo:\n${usedPrefix + command} bad bunny - tití me preguntó`
  )

  try {
    const response = await fetch(`https://theadonix-api.vercel.app/api/ytmp42?query=${encodeURIComponent(text)}`)
    const data = await response.json()

    if (!data.result?.audio) return m.reply(
      '❌ Lo siento, no pude obtener el audio. Intenta con otro término o verifica la conexión.'
    )

    const { title, url, thumbnail, duration, audio, filename } = data.result

    // Enviar mensaje con miniatura y detalles elegantes
    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption:
        `🎶 *Título:* ${title}\n` +
        `⏰ *Duración:* ${duration}\n` +
        `🔗 *Enlace:* ${url}\n\n` +
        `⚡ _Descargado con la tecnología de_ *Adonix API*`
    }, { quoted: m })

    // Preparar buffer de miniatura para contextInfo
    const thumbnailBuffer = await (await fetch(thumbnail)).buffer()

    // Enviar audio con metadata profesional y contextInfo detallado
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: filename,
      ptt: false,
      contextInfo: {
        externalAdReply: {
          mediaUrl: url,
          mediaType: 2,
          description: 'Usando Adonix API 🫆',
          title,
          body: 'Music YT ⚔️',
          thumbnail: thumbnailBuffer,
          sourceUrl: url
        }
      }
    }, { quoted: m })

  } catch (error) {
    console.error('❌ Error en ytmp42:', error)
    m.reply(
      '❌ Ocurrió un error inesperado mientras procesaba tu solicitud.\n' +
      'Por favor, intenta de nuevo más tarde.'
    )
  }
}

handler.help = ['ytmp42 <texto>']
handler.tags = ['descargas']
handler.command = ['play3']

export default handler