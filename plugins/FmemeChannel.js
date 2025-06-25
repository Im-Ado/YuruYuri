import axios from 'axios';

const handler = async (msg, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ');
  const chatId = msg.key.remoteJid;

  if (!text) {
    return conn.sendMessage(chatId, {
      text: `✳️ Ingresa el nombre o link del video\nEjemplo: *${usedPrefix + command}* never gonna give you up`
    }, { quoted: msg });
  }

  try {
    await conn.sendMessage(chatId, { react: { text: '🔎', key: msg.key } });

    // Consultar la API
    const url = `https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(text)}`;
    const { data } = await axios.get(url);

    if (!data || !data.result || !data.result.url) {
      throw new Error('No se encontró ningún resultado.');
    }

    // Puedes enviar el link o el archivo directamente, aquí el link:
    await conn.sendMessage(chatId, {
      text: `🎶 *Descarga MP3:*\n*Titulo:* ${data.result.title}\n*Duración:* ${data.result.duration}\n\n${data.result.url}`
    }, { quoted: msg });

    // Si quieres enviar el audio directamente, puedes usar:
    // await conn.sendMessage(chatId, { audio: { url: data.result.url }, mimetype: 'audio/mpeg' }, { quoted: msg });

    await conn.sendMessage(chatId, { react: { text: '✅', key: msg.key } });

  } catch (error) {
    console.error(error);
    await conn.sendMessage(chatId, {
      text: `❌ Error: ${error.message}`
    }, { quoted: msg });

    await conn.sendMessage(chatId, { react: { text: '❌', key: msg.key } });
  }
};

// Opcional, personaliza el help y demás
handler.help = ['play <texto|link>'];
handler.command = ['song'];
handler.tags = ['downloader'];
handler.register = true;

export default handler;