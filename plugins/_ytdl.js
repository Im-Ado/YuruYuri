import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
  const query = args.join(' ');
  if (!query) return m.reply(`✐ Ingresa el nombre o link del video\n> *Ejemplo:* ${command} J Balvin - Rojo`);

  await m.react('💫');

  try {
    const api = `https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(query)}`;
    const res = await fetch(api);
    const data = await res.json();

    if (!data?.result?.audio) {
      return m.reply('❌ No se pudo obtener el audio.');
    }

    // Validación real de audio descargable
    const audioRes = await fetch(data.result.audio);
    const contentType = audioRes.headers.get('content-type');
    const audioBuffer = await audioRes.arrayBuffer();
    const audioSize = audioBuffer.byteLength;

    if (!contentType?.includes('audio') || audioSize < 10000) {
      return m.reply('❌ El audio parece estar dañado o vacío.');
    }

    // Enviar imagen + info primero
    const info = `*「✦」 ${data.result.title}*\n\n` +
      `*🧷 Autor:* ${data.result.creator}\n` +
      `*⏳ Duración:* ${data.result.duration}\n` +
      `*🌐 URL:* ${data.result.url}`;

    await conn.sendMessage(m.chat, {
      image: { url: data.result.thumbnail },
      caption: info
    }, { quoted: m });

    // Enviar el audio como PTT
    await conn.sendMessage(m.chat, {
      audio: { url: data.result.audio },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${data.result.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: data.result.title,
          body: 'Descargado con The Adonix API',
          thumbnailUrl: data.result.thumbnail,
          sourceUrl: data.result.url,
          mediaType: 2,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    m.reply('❌ Error interno al procesar el audio.');
  }
};

handler.command = ['ytmp3', 'play3'];
handler.help = ['ytmp3 <nombre o url>'];
handler.tags = ['downloader'];

export default handler;