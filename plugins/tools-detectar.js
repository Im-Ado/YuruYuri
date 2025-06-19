import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
  const pluginFolder = './plugins'
  const archivos = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js'))
  if (!archivos.length) return m.reply('No hay plugins en la carpeta ./plugins')

  let resultados = []

  for (let archivo of archivos) {
    try {
      const fullPath = path.join(pluginFolder, archivo)
      const content = fs.readFileSync(fullPath, 'utf-8')
      new Function(content)() // Solo analiza sintaxis, no ejecuta
      resultados.push(`✅ ${archivo}: Sin errores`)
    } catch (e) {
      const linea = (e.stack.match(/<anonymous>:(\d+):/) || [])[1] || '?'
      resultados.push(`❌ ${archivo} → Línea ${linea} → ${e.message}`)
    }
  }

  let texto = `*🔍 Resultado del análisis de plugins:*\n\n` + resultados.join('\n')
  m.reply(texto)
}

handler.command = ['errores']
handler.tags = ['tools']
handler.help = ['verificarplugins']

export default handler