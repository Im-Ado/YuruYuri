const handler = async (m, { conn }) => {
  const canal = '120363420941524030@newsletter';

  const contenido = `
import yts from 'yt-search';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("📌 Ingresa un texto o link de YouTube.");
  const res = await yts(text);
  const video = res.videos[0];
  if (!video) return m.reply("❌ No se encontró el video.");
  await conn.sendMessage(m.chat, {
    audio: { url: video.url },
    mimetype: 'audio/mpeg'
  }, { quoted: m });
};
export default handler;
`;

  const buffer = Buffer.from(contenido, 'utf-8');

  await conn.sendMessage(canal, {
    document: buffer,
    mimetype: 'application/javascript', // 👈 cambio clave aquí
    fileName: '🌱 YouTube Play.js',
    caption: '🌱 𝘊𝘰𝘥𝘦 : YouTube Play\n𝘴𝘺𝘭𝘱𝘩𝘪𝘦𝘵𝘵𝘦\'𝘴 | αlρнα ν1\n\n📋 Toca "Copy" si se muestra',
    fileLength: 999999999999
  });

  m.reply('✅ Intenté enviarlo de nuevo con compatibilidad mejorada.');
};

handler.command = ['codecopy'];
handler.help = ['codecopy'];
handler.tags = ['tools'];

export default handler;