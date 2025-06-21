import yts from "yt-search";
import { ytv, yta } from "./_ytdl.js";
import fetch from "node-fetch";

const limit = 100;

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) {
    await m.react("💜");
    return m.reply(`✐ Ingresa un texto o URL de YouTube\n> *Ejemplo:* ${usedPrefix + command} JBalvin - Color Rojo`);
  }

  try {
    await m.react("🕒"); // buscando...

    let res = await yts(text);
    if (!res || !res.all || res.all.length === 0) {
      await m.react("✖️");
      return m.reply("❌ No se encontraron resultados para tu búsqueda.");
    }

    let video = res.all[0];
    let total = Number(video.duration.seconds) || 0;

    let cap = `*「✧」 ${video.title}*\n\n` +
      `*✦ Canal ➭* ${video.author.name}\n` +
      `*ⴵ Duración ➭* ${video.duration.timestamp}\n` +
      `*✰ Vistas ➭* ${video.views}\n` +
      `*✐ URL ➭* ${video.url}`;

    // enviar miniatura con caption decorado
    const thumbBuffer = await (await fetch(video.thumbnail)).buffer();
    await conn.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: cap
    }, { quoted: m });

    if (command === "play") {
      try {
        const api = await yta(video.url);
        if (!api?.result?.download) {
          await m.react("✖️");
          return m.reply("❌ No se pudo obtener el audio");
        }
        await conn.sendMessage(m.chat, {
          audio: { url: api.result.download },
          mimetype: "audio/mpeg",
          ptt: true,
          fileName: `${api.result.title}.mp3`
        }, { quoted: m });
        await m.react("✅");
      } catch (e) {
        await m.react("✖️");
        return m.reply("❌ Error al obtener el audio");
      }
    } else if (command === "play2" || command === "playvid") {
      try {
        const api = await ytv(video.url);
        const resFetch = await fetch(api.url);
        const contentLength = resFetch.headers.get("Content-Length");
        const bytes = parseInt(contentLength, 10);
        const sizeMB = bytes / (1024 * 1024);
        const asDoc = sizeMB >= limit;

        await conn.sendMessage(m.chat, {
          document: { url: api.url },
          mimetype: "video/mp4",
          fileName: api.title + ".mp4"
        }, { quoted: m });

        await m.react("✅");
      } catch (e) {
        await m.react("✖️");
        return m.reply("❌ Error al obtener el video");
      }
    }
  } catch (error) {
    console.error(error);
    await m.react("🌿");
    m.reply(`❌ Error: ${error.message}`);
  }
};

handler.help = ["play <texto o url>", "play2 <texto o url>", "playvid <texto o url>"];
handler.tags = ["media", "download"];
handler.command = ["play", "play4"];

export default handler;