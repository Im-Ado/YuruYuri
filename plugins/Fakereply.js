import fetch from 'node-fetch'
import fs from 'fs'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`🌐 *Ingresa una URL válida para extraer el HTML*\n\n📌 *Ejemplo:*\n${usedPrefix + command} https://example.com`)

  const url = args[0]
  const api = `https://delirius-apiofc.vercel.app/tools/htmlextract?url=${encodeURIComponent(url)}`

  try {
    const res = await fetch(api)
    if (!res.ok) throw '❌ Error al obtener HTML'

    const json = await res.json()
    const html = json.result

    const fileName = `html-${Date.now()}.html`
    const filePath = `/tmp/${fileName}`
    fs.writeFileSync(filePath, html)

    await conn.sendMessage(m.chat, {
      document: { url: filePath },
      mimetype: 'text/html',
      fileName: fileName,
      caption: `🧩 *HTML EXTRAÍDO COMPLETAMENTE*\n\n🌐 URL: ${url}\n📄 Archivo: ${fileName}\n\n${botname}`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`❌ No se pudo extraer el HTML.\n🔁 Asegúrate de que la URL esté activa y sea válida.`)
  }
}

handler.help = ['htmlget <url>']
handler.tags = ['tools']
handler.command = ['htmlget', 'gethtml', 'extrhtml']
handler.register = true

export default handler