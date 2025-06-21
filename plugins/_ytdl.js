import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    await m.react('🎧');
    return m.reply(`✐ Ingresa el nombre o link de un video\n> *Ejemplo:* ${usedPrefix + command} Peso Pluma - Bellakeo`);
  }

  try {
    await m.react('🔎');

    // Consulta a tu propia API
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data?.result?.audio) {
      await m.react('❌');
      return m.reply('❌ No se pudo obtener el audio.');
    }

    // Verificación extra (tamaño o headers)
    const audioHead = await fetch(data.result.audio, { method: 'HEAD' });
    const size = audioHead.headers.get('content-length');
    if (!size || Number(size) < 10000) {
      return m.reply('❌ El audio parece estar dañado o vacío.');
    }

    // Mensaje con info bonita
    let info = `
╭━━〔 *🔊 YTMP3 Descargado* 〕━━⬣
┃ 💿 *Título:* ${data.result.title}
┃ 📺 *Link:* ${data.result.url}
┃ ⏱️ *Duración:* ${data.result.duration}
┃ 👤 *Autor:* ${data.result.creator}
╰━━━━━━━━━━━━━━━━━━⬣
🎧 *Por:* Ado ( Wirk )`;

    await conn.sendMessage(m.chat, {
      image: { url: data.result.thumbnail },
      caption: info
    }, { quoted: m });

    // Enviar el audio
    await conn.sendMessage(m.chat, {
      audio: { url: data.result.audio },
      fileName: `${data.result.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m });

    await m.react('✅');

  } catch (err) {
    console.error(err);
    await m.react('💥');
    m.reply(`❌ Ocurrió un error\n${err.message}`);
  }
};

handler.command = ['play3', 'ytmp3x'];
handler.help = ['play3 <texto>', 'ytmp3x <texto>'];
handler.tags = ['descargas'];

export default handler;