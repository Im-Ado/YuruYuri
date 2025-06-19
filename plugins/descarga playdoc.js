import fetch from 'node-fetch';

const JT = {
  contextInfo: {
    externalAdReply: {
      title: packname,
      body: textbot,
      mediaType: 1,
      previewType: 0,
      mediaUrl: null,
      sourceUrl: null,
      thumbnail: img,
      renderLargerThumbnail: true,
    },
  },
};

let handler = async (m, { conn, usedPrefix, command, text }) => {

  if (!text) return m.reply(`✐ Ingresa Un Texto Para Buscar En Youtube\n> *Ejemplo:* ${usedPrefix + command} ozuna`);

  try {
    let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();
    let results = api.data[0];

    let txt = `*「✦」 ${results.title}*

> ✦ *Canal* » ${results.author.name}
> ⴵ *Duración:* » ${results.duration}
> ✰ *Vistas:* » ${results.views}
> ✐ *Publicación* » ${results.publishedAt}
> 🜸 *Link* » ${results.url}`;

    let img = results.image;

    // Aquí se aplica el JT al mensaje con imagen y caption
    conn.sendMessage(m.chat, { image: { url: img }, caption: txt, ...JT }, { quoted: m });

    let api2 = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${results.url}`)).json();

    await conn.sendMessage(m.chat, { 
      audio: { url: api2.result.download.url }, 
      mimetype: 'audio/mpeg', 
      ptt: true 
    }, { quoted: m });

  } catch (e) {
    m.reply(`Error: ${e.message}`);
    m.react('✖️');
  }
};

handler.command = ['play', 'pdoc'];

export default handler;