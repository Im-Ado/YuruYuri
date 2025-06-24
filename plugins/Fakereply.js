import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Pon nombre o link de la canción\nEjemplo:\n${usedPrefix + command} Bad Bunny`);

  try {
    await m.react('🕒');

    let query = args.join(' ');
    let url;

    // Si el input es URL lo usas, si no buscas con yt-search
    if (/https?:\/\//.test(query)) {
      url = query;
    } else {
      let search = await yts(query);
      if (!search.videos.length) return m.reply('No encontré nada we');
      url = search.videos[0].url;
    }

    // Llamar a tu API con url
    let res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`);
    let data = await res.json();

    if (data.status !== 200 || !data.result || !data.result.audio) {
      await m.react('❌');
      return m.reply('No pude descargar el audio');
    }

    let { title, audio, filename } = data.result;

    // Enviar audio SIN contextInfo
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: filename
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    await m.react('❌');
    m.reply('Error al descargar el audio: ' + e.message);
  }
};

handler.help = ['play3 <nombre o link>'];
handler.tags = ['downloader'];
handler.command = ['play3'];

export default handler;