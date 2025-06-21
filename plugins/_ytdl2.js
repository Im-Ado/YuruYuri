import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📽️ Ingresa el nombre o enlace de un video para buscar.\n\nEjemplo:\n${usedPrefix + command} Feid - LUNA`);

  try {
    await m.react('🔎');

    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp4?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.result || !data.result.video) {
      await m.react('❌');
      return m.reply('❌ No se pudo obtener el video.');
    }

    const { title, video, thumbnail, filename, creator, duration, url } = data.result;

    const caption = `*「🎞️ YTMP4 - Video Descargado」*\n\n` +
      `*🎬 Título:* ${title}\n` +
      `*⏱️ Duración:* ${duration}\n` +
      `*📺 Canal:* ${creator}\n` +
      `*🔗 Link:* ${url}\n` +
      `*🛰️ Servidor:* Adonix API\n\n` +
      `_Requerido por ${m.pushName}_`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      video: { url: video },
      mimetype: 'video/mp4',
      fileName: filename
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply(`❌ Ocurrió un error: ${e.message}`);
  }
};

handler.help = ['ytmp4 <texto o url>'];
handler.tags = ['downloader', 'video'];
handler.command = ['playvideo'];

export default handler;