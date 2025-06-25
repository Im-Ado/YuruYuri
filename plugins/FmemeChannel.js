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

  await conn.sendMessage(canal, {
    text: `📄 Código YouTube Play\n\n🧠 Mantén presionado para copiar:\n\n\`\`\`${contenido.trim()}\`\`\``,
    headerType: 1
  });

  m.reply('✅ Código enviado como texto simple (compatible con todos).');
};

handler.command = ['codecopy'];
handler.help = ['codecopy'];
handler.tags = ['tools'];

export default handler;