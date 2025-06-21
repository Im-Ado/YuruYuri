import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌴 Pon el nombre o link de un video para buscar.\nEjemplo:\n${usedPrefix + command} Prince Royce - El Clavo`);

  try {
    await m.react('🕒');

    // Llamamos tu API con el texto o link
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.result || !data.result.audio) {
      await m.react('❌');
      return m.reply('❌ No se pudo obtener el audio.');
    }

    const { title, audio, thumbnail, filename, creator, duration, url } = data.result;

    let caption = `*「${wm}」*\n\n` +
      `*🎤 Título:* ${title}\n` +
      `*⏳ Duración:* ${duration}\n` +
      `*🔗 Link:* ${url}\n\n` +
      `_Solicitado por ${m.pushName}_\n\n` +
      `*🧩 Servidor: Adonix API*`;

    // Manda la imagen con la info
    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: m });

    // Manda el audio con PTT y nombre correcto
    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: filename
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply(`❌ Ocurrió un error: ${e.message}`);
  }
};

handler.help = ['ytmp3 <texto o url>'];
handler.tags = ['downloader', 'audio'];
handler.command = ['ytmp3', 'playaudio', 'play'];

export default handler;