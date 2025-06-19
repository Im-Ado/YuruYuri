import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`✐ Ingresa Un Texto Para Buscar En Youtube\n> *Ejemplo:* ${usedPrefix + command} ozuna`);

  try {
    let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();
    let results = api.data[0];

    let txt = `*「✦」 ${results.title}*

> ✦ *Canal* » ${results.author.name}
> ⴵ *Duración:* » ${results.duration}
> ✰ *Vistas:* » ${results.views}
> ✐ *Publicación:* » ${results.publishedAt}
> ❒ *Tamaño:* » ${results.HumanReadable}
> 🜸 *Link:* » ${results.url}`;

    let img = results.image;

    await conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });

    let api2 = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${results.url}`)).json();
    let audioUrl = api2?.result?.download?.url;
    let fileSize = api2?.result?.size;

    if (!audioUrl) return m.reply('❌ No se pudo obtener el audio');

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${results.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: results.title,
          body: `Tamaño: ${fileSize || 'desconocido'} • Por ${results.author.name}`,
          mediaType: 1,
          previewType: 0,
          thumbnail: await (await fetch(img)).buffer(),
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error: ${e.message}`);
    m.react('✖️');
  }
};

handler.command = ['play', 'pdoc'];

export default handler;