import fetch from "node-fetch"
import yts from "yt-search"

const limit = 100 // MB

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("> Ingresa el nombre de un video o una URL de YouTube.")

  await m.react("🕛")
  console.log("💎 Buscando en YouTube...")

  try {
    let res = await yts(text)

    if (!res?.all?.length) {
      return m.reply("🌻 No se encontraron resultados para tu búsqueda.")
    }

    let video = res.all[0]
    if (!video) return m.reply("❌ No se pudo obtener información del video.")

    const title = video.title || "Sin título"
    const authorName = video.author?.name || "Desconocido"
    const durationTimestamp = video.duration?.timestamp || "Desconocida"
    const views = video.views || "Desconocidas"
    const thumbnail = video.thumbnail || ""

    const processingMessage = `*「✦」${title}*
> *❀ Canal:* ${authorName}
> *✐ Duración:* ${durationTimestamp}
> *☄︎ Vistas:* ${views}

✿ Aguarde, unos segundos..`

    // Primero mostrar mensaje rápido sin esperar thumbnail
    let sentMessage = await m.reply(processingMessage)

    // Después en segundo plano intenta enviar la miniatura
    if (thumbnail) {
      conn.sendFile(m.chat, thumbnail, "thumb.jpg", '', m).catch(e => console.log("⚠ Miniatura falló:", e.message))
    }

    if (["play", "playaudio", "ytmp3"].includes(command)) {
      downloadAudio(conn, m, video, title)
    } else if (["play2", "playvid", "ytv", "ytmp4"].includes(command)) {
      downloadVideo(conn, m, video, title)
    }

  } catch (error) {
    console.error("❌ Error general:", error)
    await m.reply(`❌ Hubo un error al procesar tu solicitud:\n\n${error.message}`)
    await m.react("❌")
  }
}

const downloadAudio = async (conn, m, video, title) => {
  try {
    console.log("✦ Solicitando audio...")
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(video.url)}`)
    const json = await res.json()
    if (!json.result?.audio) throw new Error("No se pudo obtener el enlace de descarga del audio")

    const { audio, filename } = json.result

    console.log("✿ Enviando audio...")
    conn.sendFile(
      m.chat,
      audio,
      `${(filename || title).replace(/[^\w\s]/gi, '')}.mp3`,
      `✦ *${title}*`,
      m,
      null,
      { mimetype: 'audio/mpeg', ptt: true }
    ).then(() => {
      m.react("✅")
      console.log("✅ Audio enviado")
    }).catch(e => {
      console.error("❌ Error audio:", e)
      m.reply(`❌ Falló el envío:\n${e.message}`)
      m.react("❌")
    })

  } catch (error) {
    console.error("❌ Error descargando audio:", error)
    m.reply(`❌ Error al descargar el audio:\n\n${error.message}`)
    m.react("❌")
  }
}

const downloadVideo = async (conn, m, video, title) => {
  try {
    console.log("❀ Solicitando video...")
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp4?url=${encodeURIComponent(video.url)}`)
    const json = await res.json()
    if (!json.result?.video) throw new Error("No se pudo obtener el enlace del video")

    const { video: videoUrl, filename } = json.result

    // Rápido verificar tamaño sin detener
    fetch(videoUrl, { method: 'HEAD' }).then(async head => {
      const size = head.headers.get('content-length')
      const sizemb = size ? parseInt(size) / (1024 * 1024) : 0
      if (sizemb > limit && sizemb > 0) {
        return m.reply(`✤ El archivo es muy pesado (${sizemb.toFixed(2)} MB). El límite es ${limit} MB.`)
      }

      console.log("✧ Enviando video...")
      conn.sendFile(
        m.chat,
        videoUrl,
        `${(filename || title).replace(/[^\w\s]/gi, '')}.mp4`,
        `✦ *${title}*`,
        m,
        null,
        { asDocument: sizemb >= limit, mimetype: 'video/mp4' }
      ).then(() => {
        m.react("✅")
        console.log("✅ Video enviado")
      }).catch(e => {
        console.error("❌ Error video:", e)
        m.reply(`❌ Falló el envío:\n${e.message}`)
        m.react("❌")
      })

    }).catch(e => {
      console.log("⚠ No se pudo verificar el tamaño:", e.message)
    })

  } catch (error) {
    console.error("❌ Error descargando video:", error)
    m.reply(`❌ Error al descargar el video:\n\n${error.message}`)
    m.react("❌")
  }
}

handler.command = handler.help = ['play', 'playaudio', 'ytmp3', 'play2', 'ytv', 'ytmp4']
handler.tags = ['downloader']

export default handler