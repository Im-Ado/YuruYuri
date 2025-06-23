import fetch from 'node-fetch'
import { writeFileSync, unlinkSync, readFileSync } from 'fs'
import path from 'path'

const handler = async (m, { text, conn }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `✘ 「 ENLACE FALTANTE 」
➤ Por favor proporciona una URL válida.
➤ Ejemplo de uso: *html https://example.com*`,
      m
    )
  }

  const url = text.trim()
  const api = `https://theadonix-api.vercel.app/api/Extract?url=${encodeURIComponent(url)}`

  await conn.reply(
    m.chat,
    `╭─〔 📡 SOLICITANDO DATOS... 〕─╮
┃⏳ Procesando la extracción del código HTML...
┃🔍 Analizando el sitio web solicitado...
╰────────────────────────────╯`,
    m
  )

  try {
    const res = await fetch(api)
    const data = await res.json()

    if (!data.status || !data.html) throw new Error('Respuesta no válida')

    const filename = `hanako-html-${Date.now()}.html`
    const filepath = path.join('./temp', filename)

    writeFileSync(filepath, data.html)

    const fileBuffer = readFileSync(filepath)

    await conn.sendMessage(
      m.chat,
      {
        document: fileBuffer,
        mimetype: 'text/html',
        fileName: 'hanako-html-source.html',
        caption: `
╭─〔 📄 HTML EXTRAÍDO 〕─╮
┃✅ El código HTML se ha extraído exitosamente.
┃✨ Procesado por: *Adonix APi*
╰─────────────────────╯
🔗 URL solicitada: ${url}
`.trim(),
      },
      { quoted: m }
    )

    unlinkSync(filepath)
  } catch (err) {
    console.error('[ERROR en html extract]', err)
    conn.reply(
      m.chat,
      `✘ 「 ERROR AL EXTRAER 」
➤ No se pudo obtener el contenido HTML.
➤ Asegúrate de que el enlace sea válido y accesible.`,
      m
    )
  }
}

handler.command = ['html']
handler.help = ['html <enlace>']
handler.tags = ['tools']
handler.register = true

export default handler