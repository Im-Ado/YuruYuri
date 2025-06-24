import fetch from 'node-fetch'

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) return m.reply(
    `⚠️ Uso correcto: ${usedPrefix + command} <nombre o link de la canción>\n` +
    `Ejemplo:\n${usedPrefix + command} bad bunny - tití me preguntó`
  )

  try {
    // Reacción rápida con sendMessage (no await pa que no frene)
    conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } }).catch(() => {})

    // Traer info del audio
    const response = await fetch(`https://theadonix-api.vercel.app/api/ytmp42?query=${encodeURIComponent(text)}`)
    const data = await response.json()

    if (!data.result?.audio) return m.reply('❌ No encontré el audio wey, prueba otro término.')

    const { title, url, thumbnail, duration, audio, filename } = data.result

    // Miniatura a buffer para contextInfo
    const thumbBuffer = await (await fetch(thumbnail)).buffer()

    // Enviar miniatura con info sin await pa no frenar
    conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption:
        `🎶 Título: ${title}\n` +
        `⏰ Duración: ${duration}\n` +
        `🔗 Link: ${url}\n\n` +
        `⚡ Descargado con la tecnología de Adonix API`
    }, { quoted: m }).catch(() => {})

    // Enviar audio en PTT y esperar para asegurar envío correcto
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: filename,
      ptt: true,
      contextInfo: {
        externalAdReply: {
          mediaUrl: url,
          mediaType: 2,
          description: 'Usando Adonix API 🫆',
          body: 'Music YT ⚔️',
          thumbnail: thumbBuffer,
          sourceUrl: url
        }
      }
    }, { quoted: m })

  } catch (error) {
    console.error('❌ Error en play3:', error)
    m.reply('❌ Algo salió mal wey, intenta más tarde.')
  }
}

handler.help = ['play3 <texto>']
handler.tags = ['descargas']
handler.command = ['play3']

export default handler