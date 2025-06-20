import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    await m.react('💜');
    return m.reply(`✐ Ingresa Un Texto Para Buscar En YouTube\n> *Ejemplo:* ${usedPrefix + command} JBalvin - Color Rojo`);
  }

  try {
    await m.react('🕒'); // buscando...

    const searchApi = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      await m.react('✖️');
      return m.reply('❌ No se encontraron resultados.');
    }

    const video = searchData.data[0];

    let txt = `*「✧」 ${video.title}*\n\n` +
      `*✦ Canal »* ${video.author.name}\n` +
      `*ⴵ Duración: »* ${video.duration}\n` +
      `*✰ Vistas: »* ${video.views}\n` +
      `*✐ Publicado: »* ${video.publishedAt}\n` +
      `*🜸 Link: »* ${video.url}`;

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: txt
    }, { quoted: m });

    const downloadApi = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
    const downloadResponse = await fetch(downloadApi);
    const downloadData = await downloadResponse.json();

    if (!downloadData?.result?.download?.url) {
      await m.react('✖️');
      return m.reply('❌ No se pudo obtener el audio');
    }

    await conn.sendMessage(m.chat, {
      audio: { url: downloadData.result.download.url },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${video.title}.mp3`
    }, { quoted: m });

    await m.react('✅'); // éxito

  } catch (error) {
    console.error(error);
    await m.react('🌿');
    m.reply(`❌ Error: ${error.message}`);
  }
};

handler.command = ['play', 'playaudio'];
handler.help = ['play <texto>', 'playaudio <texto>'];
handler.tags = ['media'];

export default handler;