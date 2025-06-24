import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`Pon el nombre o link del video\nEjemplo:\n${usedPrefix + command} Bad Bunny`);

  try {
    await m.react('🕒');

    let query = args.join(' ');
    // Si es URL, la usas, si no buscas en ytsearch y tomas el primer resultado
    let url = query.match(/https?:\/\/\S+/) ? query : null;
    if (!url) {
      const yts = (await import('yt-search')).default;
      let search = await yts(query);
      if (!search.videos.length) return m.reply('No encontré nada bro');
      url = search.videos[0].url;
    }

    // Llamas a la API con URL
    let res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`);
    let data = await res.json();

    if (data.status !== 200 || !data.result || !data.result.audio) {
      await m.react('❌');
      return m.reply('No pude descargar el audio');
    }

    const { title, audio, thumbnail, filename, channel, duration, nota } = data.result;

    // Enviar miniatura con detalles
    let caption = `*「🎵 Audio descargado」*\n\n` +
      `*Título:* ${title}\n` +
      `*Canal:* ${channel}\n` +
      `*Duración:* ${duration}\n\n` +
      `_Solicitado por ${m.pushName}_\n\n` +
      `*⚡ Servidor: Adonix API*`;

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: m });

    // Enviar audio
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: filename,
      contextInfo: { externalAdReply: { title, body: 'Adonix API', thumbnailUrl: thumbnail, sourceUrl: url } }
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    await m.react('❌');
    m.reply('Error al descargar el audio we: ' + e.message);
  }
};

handler.help = ['play <nombre o link>'];
handler.tags = ['downloader'];
handler.command = ['play3'];

export default handler;