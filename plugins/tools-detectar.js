import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pluginFolder = path.join(__dirname, './plugins')

function analizarPlugin(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    new Function(content)() // Solo verifica sintaxis, no ejecuta funciones
    return { ok: true }
  } catch (e) {
    const linea = (e.stack.match(/<anonymous>:(\d+):/) || [])[1] || '?'
    return {
      ok: false,
      error: e.message,
      linea: linea
    }
  }
}

function analizarTodos() {
  const archivos = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js'))
  if (!archivos.length) return console.log('No hay plugins en ./plugins')

  for (let archivo of archivos) {
    const fullPath = path.join(pluginFolder, archivo)
    const resultado = analizarPlugin(fullPath)
    if (resultado.ok) {
      console.log(`✅ ${archivo}: Sin errores de sintaxis`)
    } else {
      console.log(`❌ ${archivo}: Error en la línea ${resultado.linea}`)
      console.log(`   → ${resultado.error}\n`)
    }
  }
}

analizarTodos()