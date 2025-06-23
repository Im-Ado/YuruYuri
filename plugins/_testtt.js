//Usando Adonix API alv
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌸 Ingresa el enlace de un video de TikTok.\n\n📌 *Ejemplo:*\n${usedPrefix + command} https://vm.tiktok.com/xxxxxx`);

  try {
    await m.react('🎴');

    const api = `https://theadonix-api.vercel.app/api/tiktok?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (!data?.result?.video) {
      await m.react('❌');
      return m.reply('❌ No se pudo obtener el video.');
    }

    const { title, author, thumbnail, duration, video, audio, likes, comments, shares, views } = data.result;

    const caption = `「✦」Descargando *${title}*
ღ *Autor :* ${author.name} (@${author.username})
❐ *Duración :* ${duration} segundos
★ *Likes :* ${likes}
✿ *Comentarios :* ${comments}
🜲 *Compartidos :* ${shares}
⌨︎︎ *Vistas :* ${views}
☁︎ *Servidor :* Adonix API`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      video: { url: video },
      mimetype: 'video/mp4',
      fileName: `${author.username}.mp4`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('⚠️');
    m.reply(`❌ Error al procesar el enlace.`);
  }
};

handler.help = ['tiktok <enlace>'];
handler.tags = ['downloader'];
handler.command = ['ttdl', 'tt', 'tiktok'];

export default handler;