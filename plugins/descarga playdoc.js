import fetch from 'node-fetch';

let handler = async(m, { conn, usedPrefix, command, text }) => {

if (!text) return m.reply(`✐ Ingresa Un Texto Para Buscar En Youtube\n> *Ejemplo:* ${usedPrefix + command}ozuna`);

try {
let api = await (await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${text}`)).json();

let results = api.data[0];

let txt = `*「✦」 ${results.title}*

> ✦ *Canal* » ${results.author.name}\n> ⴵ *Duración:* » ${results.duration}\n> ✰ *Vistas:* » ${results.views}
> ✐ *Publicación* » ${results.publishedAt}\n> 🜸 *Link* » ${results.url} `;

let img = results.image;

conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });

let api2 = await(await fetch(`https://api.vreden.my.id/api/ytmp3?url=${results.url}`)).json();

await conn.sendMessage(m.chat, { 
  audio: { url: api2.result.download.url }, 
  mimetype: 'audio/mpeg', 
  ptt: true // ← ahora se envía como nota de voz 
}, { quoted: m });

} catch (e) {
m.reply(`Error: ${e.message}`);
m.react('✖️');
  }
}

handler.command = ['play', 'pdoc'];

export default handler