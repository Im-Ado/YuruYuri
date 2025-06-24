import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args.length) return m.reply(`Pon el nombre o link pa buscar\nEjemplo:\n${usedPrefix}${command} bad bunny`);

  await m.react('🕒');

  try {
    let query = args.join(' ');
    let url;

    // Si es URL usa directo
    if (/^https?:\/\//.test(query)) {
      url = query;
    } else {
      // Busca con yt-search y saca el primer video
      let search = await yts(query);
      if (!search.videos.length) {
        await m.react('❌');
        return m.reply('No encontré ningún video con ese nombre.');
      }
      url = search.videos[0].url;
    }

    // Llama tu API con la url
    let res = await fetch(`https://theadonix-api.vercel.app/api/ytmp42?url=${encodeURIComponent(url)}`);
    let data = await res.json();

    if (data.status !== 200 || !data.result || !data.result.audio) {
      await m.react('❌');
      return m.reply(`No pude descargar el audio.\nRespuesta API:\n${JSON.stringify(data)}`);
    }

    let { title, audio, filename, channel, nota } = data.result;

    let caption = `*${title}*\n*Canal:* ${channel || 'Desconocido'}\n\n${nota || ''}\n_Solicitado por ${m.pushName}_`;

    // Envía el mensaje con audio sin contextInfo
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      fileName: filename
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    await m.react('❌');
    m.reply(`Error pa descargar audio: ${e.message}`);
  }
};

handler.help = ['play3 <nombre o url>'];
handler.tags = ['downloader', 'audio'];
handler.command = ['play3'];

export default handler;