//Código usando Adonix Api
import fetch from "node-fetch"
import yts from "yt-search"

const limit = 100 // MB

const handler = async (m, { conn, text, command }) => {
if (!text) return m.reply("> Ingresa el nombre de un video o una URL de YouTube.")

await m.react("🕒")
console.log("💎 Buscando en YouTube...")

try {
let res = await yts(text)

if (!res || !res.all || !Array.isArray(res.all) || res.all.length === 0) {  
  return m.reply("🌻 No se encontraron resultados para tu búsqueda.")  
}  

let video = res.all[0]  

if (!video) return m.reply("❌ No se pudo obtener información del video.")  

let durationSeconds = 0  
let durationTimestamp = "Desconocida"  

if (video.duration) {  
  durationSeconds = Number(video.duration.seconds) || 0  
  durationTimestamp = video.duration.timestamp || "Desconocida"  
}  

const authorName = video.author?.name || "Desconocido"  
const title = video.title || "Sin título"  
const views = video.views || "Desconocidas"  
const url = video.url || ""  
const thumbnail = video.thumbnail || ""  

const processingMessage = `*「✦」${title}*

> ❀ Canal: ${authorName}
✐ Duración: ${durationTimestamp}
☄︎ Vistas: ${views}



✿ Aguarde, unos segundos..`

let sentMessage  
if (thumbnail) {  
  try {  
    sentMessage = await conn.sendFile(m.chat, thumbnail, "thumb.jpg", processingMessage, m)  
  } catch (thumbError) {  
    console.log("⚠ No se pudo enviar la miniatura:", thumbError.message)  
    sentMessage = await m.reply(processingMessage)  
  }  
} else {  
  sentMessage = await m.reply(processingMessage)  
}  

if (command === "play" || command === "playaudio" || command === "ytmp3") {  
  await downloadAudio(conn, m, video, title)  
} else if (command === "play2" || command === "playvid" || command === "ytv" || command === "ytmp4") {  
  await downloadVideo(conn, m, video, title)  
}

} catch (error) {
console.error("❌ Error general:", error)
await m.reply(❌ Hubo un error al procesar tu solicitud:\n\n${error.message})
await m.react("❌")
}
}

// 🔊 Descargar Audio desde Adonix API
const downloadAudio = async (conn, m, video, title) => {
try {
console.log("✦ Solicitando audio...")

const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(video.url)}`)  
const json = await res.json()  

if (!json.result?.audio) throw new Error("No se pudo obtener el enlace de descarga del audio")  

const { audio, filename } = json.result  

console.log("✿ Enviando audio...")  
await conn.sendFile(  
  m.chat,  
  audio,  
  `${(filename || title).replace(/[^\w\s]/gi, '')}.mp3`,  
  `✦ *${title}*`,  
  m,  
  null,  
  { mimetype: 'audio/mpeg', ptt: true }  
)  

await m.react("✅")  
console.log("✅ Audio enviado exitosamente")

} catch (error) {
console.error("❌ Error descargando audio:", error)
await m.reply(❌ Error al descargar el audio:\n\n${error.message})
await m.react("❌")
}
}

// 📼 Descargar Video desde Adonix API
const downloadVideo = async (conn, m, video, title) => {
try {
console.log("❀ Solicitando video...")

const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(video.url)}`)  
const json = await res.json()  

if (!json.result?.video) throw new Error("No se pudo obtener el enlace de descarga del video")  

const { video: videoUrl, filename } = json.result  

// Verificar tamaño del archivo  
let sizemb = 0  
try {  
  const head = await fetch(videoUrl, { method: 'HEAD' })  
  const size = head.headers.get('content-length')  
  if (size) {  
    const bytes = parseInt(size)  
    sizemb = bytes / (1024 * 1024)  
  }  
} catch (e) {  
  console.log("⚠ No se pudo obtener el tamaño del archivo:", e.message)  
}  

if (sizemb > limit && sizemb > 0) {  
  return m.reply(`✤ El archivo es muy pesado (${sizemb.toFixed(2)} MB). El límite es ${limit} MB.`)  
}  

const doc = sizemb >= limit && sizemb > 0  

console.log("✧ Se está enviando tu vídeo..")  
await conn.sendFile(  
  m.chat,  
  videoUrl,  
  `${(filename || title).replace(/[^\w\s]/gi, '')}.mp4`,  
  `✦ *${title}*`,  
  m,  
  null,  
  { asDocument: doc, mimetype: 'video/mp4' }  
)  

await m.react("✅")  
console.log("✅ Video enviado exitosamente")

} catch (error) {
console.error("❌ Error descargando video:", error)
await m.reply(❌ Error al descargar el video:\n\n${error.message})
await m.react("❌")
}
}

handler.command = handler.help = ['play', 'playaudio', 'ytmp3', 'play2', 'ytv', 'ytmp4']
handler.tags = ['downloader']

export default handler

