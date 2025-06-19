import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno de la lista disponible.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    };

    const response = await axios.request(config);
    if (response.data?.success) {
      const { id, title, info } = response.data;
      const downloadUrl = await ddownr.cekProgress(id);
      return { id, title, image: info.image, downloadUrl };
    } else {
      throw new Error("⛔ No se pudo obtener los detalles del video.");
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    };

    while (true) {
      const response = await axios.request(config);
      if (response.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 1500)); // delay cortito para más rapidez
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  await m.react('🌸');

  if (!text.trim()) return conn.reply(m.chat, `❀ Ingresa un nombre para buscar\n> *Ejemplo:* ${usedPrefix + command} ozuna`, m);

  try {
    const search = await yts(text);
    if (!search.all.length) return m.reply("⚠ No se encontraron resultados para tu búsqueda.");

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `✱ *${title}* ❀
*✦ Duración :* ${timestamp}
*✦ Vistas :* ${vistas}
*✦ Canal :* ${videoInfo.author?.name || "Desconocido"}
* Publicado :* ${ago}
*✦ Enlace :* ${url}
`;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: "✧ ʏᴜʀᴜ ʏᴜʀɪ ✧",
          body: textbot,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
      ...JT
    }, { quoted: m });

    await m.react('🕐');

    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");

      await conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: "audio/mpeg",
        ptt: true,
        fileName: `${title}.mp3`
      }, { quoted: m });

    } else if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: "🌸 Aquí tienes tu video descargado por *Yuru Yuri Bot* ✨",
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`⚠ Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply("⛔ *Error:* No se encontró un enlace de descarga válido.");
      }
    } else {
      throw "❌ Comando no reconocido.";
    }

  } catch (error) {
    return m.reply(`⚠ Error inesperado: ${error.message}`);
  }
};

handler.command = handler.help = ["play", "ytk"];
handler.tags = ["downloader"];

export default handler;

function formatViews(views) {
  if (typeof views !== "number") return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}