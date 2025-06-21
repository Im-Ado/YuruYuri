import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌴 Pon el nombre o link de un video para buscar.\nEjemplo:\n${usedPrefix + command} Rick Astley`);

  try {
    await m.react('🕒');

    // Llamamos tu API con el texto o link
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp4?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.result || !data.result.video) {
      await m.react('❌');
      return m.reply('❌ No se pudo obtener el video.');
    }

    const { title, video, thumbnail, filename, creator, duration, url } = data.result;

    let caption = `*「🎬 YTMP4 - Video descargado」*\n\n` +
      `*🎤 Título:* ${title}\n` +
      `*⏳ Duración:* ${duration}\n` +
      `*📻 Canal:* ${creator}\n` +
      `*🔗 Link:* ${url}\n\n` +
      `_Solicitado por ${m.pushName}_\n\n` +
      `*🌐 Servidor: TheAdonix API*`;

    // Enviar imagen con la info
    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: m });

    // Enviar video con el nombre correcto y sin error
    await conn.sendMessage(m.chat, {
      video: { url: video },
      mimetype: 'video/mp4',
      fileName: filename,
      contextInfo: {
        forwardingScore: 9999,
        isForwarded: true,
      }
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
handler.command = ['ytmp4', 'playvideo'];

export default handler;