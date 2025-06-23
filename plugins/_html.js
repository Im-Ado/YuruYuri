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
    `╭─〔 📡 EXTRAYENDO HTML... 〕─╮
┃⏳ Procesando la solicitud...
┃🔍 Analizando el sitio web...
╰────────────────────────────╯`,
    m
  )

  try {
    const res = await fetch(api)
    const contentType = res.headers.get('content-type') || ''

    if (!contentType.includes('application/json')) {
      throw new Error('La API no devolvió una respuesta JSON válida.')
    }

    const data = await res.json()

    if (
      !data.status ||
      typeof data.html !== 'string' ||
      data.html.trim().toLowerCase().startsWith('url is not valid')
    ) {
      throw new Error(`⚠️ ${data.mensaje || 'La API rechazó la URL proporcionada.'}`)
    }

    const filename = `hanako-html-${Date.now()}.html`
    const filepath = path.join('./temp', filename)
    writeFileSync(filepath, data.html)

    const fileBuffer = readFileSync(filepath)

    await conn.sendMessage(
      m.chat,
      {
        document: fileBuffer,
        mimetype: 'text/html',
        fileName: 'web.html',
        caption: `
╭─〔 📄 HTML EXTRAÍDO 〕─╮
┃✅ ${data.mensaje || 'Código HTML obtenido exitosamente.'}
┃✨ Procesado por: *Hanako-kun*
╰───────────────────────╯
🔗 URL: ${url}
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
➤ ${err.message || 'No se pudo obtener el contenido HTML.'}
➤ Verifica que el enlace sea válido y accesible.`,
      m
    )
  }
}

handler.command = ['html']
handler.help = ['html <enlace>']
handler.tags = ['tools']
handler.register = true

export default handler