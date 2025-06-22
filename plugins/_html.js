import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`🔍 *Uso del comando:*\n\n${usedPrefix + command} https://ejemplo.com`)
  }

  const url = args[0]
  if (!/^https?:\/\//i.test(url)) {
    return m.reply('❌ Esa no es una URL válida. Asegúrate de poner el http:// o https:// wey')
  }

  try {
    await m.react('⏳')

    const apiURL = `https://theadonix-api.vercel.app/api/Extract?url=${encodeURIComponent(url)}`
    const res = await fetch(apiURL)
    const data = await res.json()

    if (!data || !data.html) {
      await m.react('❌')
      return m.reply('❌ No se pudo extraer el HTML, intenta con otra página.')
    }

    const htmlText = data.html.length > 3500
      ? data.html.slice(0, 3500) + "\n\n... (se cortó por longitud, fue muy largo pa' WhatsApp)"
      : data.html

    await conn.sendMessage(m.chat, {
      text: `📄 *Código HTML extraído:*\n\n${htmlText}`,
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`💥 Ocurrió un error al extraer el HTML:\n${e.message}`)
  }
}

handler.command = ['extractor', 'html']
handler.help = ['extractor <url>']
handler.tags = ['tools']

export default handler