import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✐ Pásame el nombre o link de la canción\nEjemplo: ${usedPrefix + command} Feid Luna`);

  try {
    await m.react('🕒'); // buscando

    // Cambia esta URL a la de tu API
    const apiUrl = `https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(text)}`;
    // No hacemos json porque tu API redirige directo al mp3
    // Solo enviamos el link directo que la API redirige
    await conn.sendMessage(m.chat, {
      audio: { url: apiUrl },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${text}.mp3`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    await m.react('❌');
    m.reply('❌ No pude descargar la canción, intenta otra vez');
  }
};

handler.help = ['ytmp3 <texto o link>'];
handler.tags = ['downloader', 'music'];
handler.command = ['ytmp3', 'playaudio'];

export default handler;