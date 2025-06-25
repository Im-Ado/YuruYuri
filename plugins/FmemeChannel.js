const handler = async (m, { conn }) => {
  const canal = '120363420941524030@newsletter';

  // Código que quieres enviar
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

  // Convertimos el texto en buffer
  const buffer = Buffer.from(contenido, 'utf-8');

  // Enviar como documento tipo JavaScript (permite botón "Copy")
  await conn.sendMessage(canal, {
    document: buffer,
    mimetype: 'application/x-javascript',
    fileName: '🌱 YouTube Play.js',
    caption: ' code : YouTube Play\nJsh\n\n📋 Toca "Copy" para copiar el código.',
    fileLength: 999999999999
  });

  m.reply('✅ Código enviado al canal con botón Copy');
};

handler.command = ['codecopy'];
handler.help = ['codecopy'];
handler.tags = ['tools'];

export default handler;