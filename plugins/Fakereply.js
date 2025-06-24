import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('🎵 Pasa el link del video de YouTube')

  await m.react('🎶') // reacción de espera

  const res = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(args[0])}`)
  const json = await res.json()

  if (!json.status) return m.reply('❌ No se pudo descargar el audio')

  let { title, url } = json.data

  await conn.sendMessage(m.chat, {
    audio: { url },
    mimetype: 'audio/mpeg',
    ptt: true,
    fileName: `${title}.mp3`
  }, { quoted: m })

  await m.react('✅') // reacción final
}

handler.command = ['play3']
export default handler