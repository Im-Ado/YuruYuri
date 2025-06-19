import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✐ Ingresa un texto para buscar en YouTube\n> *Ejemplo:* ${usedPrefix + command} ozuna`);

  try {
    let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();
    let results = api.data[0];

    let txt = `*「✦」 ${results.title}*

✦ *Canal =* ${results.author.name}
ⴵ *Duración =* ${results.duration}
✰ *Vistas =* ${results.views}
✐ *Publicación =* ${results.publishedAt}
🜸 *Link =* ${results.url}`;

    let img = results.image;

    await conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });

    let api2 = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${results.url}`)).json();

    if (!api2?.result?.download?.url) return m.reply('❌ No se encontró el audio para descargar');

    await conn.sendMessage(m.chat, {
      audio: { url: api2.result.download.url },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${results.title}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`❌ Error: ${e.message}`);
    m.react('✖️');
  }
};

handler.command = ['play', 'pdoc'];

export default handler;