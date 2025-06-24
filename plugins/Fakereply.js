import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('🎵 Pasa el link del video de YouTube')

  const res = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(args[0])}`)
  const json = await res.json()

  if (!json.status) return m.reply('❌ No se pudo descargar el audio')

  let { title, url } = json.data

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true, // si querés que se escuche como nota de voz
    fileName: `${title}.mp3`,
    contextInfo: {
      externalAdReply: {
        title: title,
        body: "Shadow Ultra Edited 💿",
        thumbnailUrl: null, // o pon una tuya
        mediaType: 2,
        mediaUrl: args[0],
        sourceUrl: args[0]
      }
    }
  }, { quoted: m })
}

handler.command = ['play3']
export default handler