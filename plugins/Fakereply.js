import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌴 Pon el nombre o link pa buscar un video\nEjemplo:\n${usedPrefix + command} Prince Royce - El Clavo`);

  await m.react('🕒');

  try {
    // Busca en la API pa sacar info y link pero no manda el audio directo aún
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.result || !data.result.audio) {
      await m.react('❌');
      return m.reply('❌ No pude encontrar el audio. Intenta con otro nombre o link.');
    }

    const { title, audio, thumbnail, filename, creator, duration, url } = data.result;

    let caption = `*「🎵 ¡Qué buena canción wey! 🎵」*\n\n` +
      `*🎤 Título:* ${title}\n` +
      `*⏳ Duración:* ${duration || 'Desconocida'}\n` +
      `*👤 Canal:* ${creator || 'Nadie sabe'}\n` +
      `*🔗 Link:* ${url}\n\n` +
      `_Solicitado por ${m.pushName}_\n\n` +
      `*🌟 Servidor: Adonix API*`;

    // Manda la info con botones pa elegir qué hacer
    const buttons = [
      { buttonId: `download_audio ${audio}||${filename}`, buttonText: { displayText: '🎧 Descargar Audio' }, type: 1 },
      { buttonId: `info_audio`, buttonText: { displayText: 'ℹ️ Más info' }, type: 1 }
    ];

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      buttons,
      footer: 'Escoge una opción wey',
      headerType: 4
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply(`❌ Ocurrió un error wey: ${e.message}`);
  }
};

// Manejo de botones
handler.button = async (m, { conn }) => {
  const { id, from, sender } = m;
  if (!m.text) return;

  if (id.startsWith('download_audio')) {
    // El id es: "download_audio <url>||<filename>"
    let [_, payload] = id.split(' ');
    let [audioUrl, filename] = payload.split('||');

    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: filename,
      ptt: true
    }, { quoted: m });

    await conn.sendMessage(from, { text: '¡Audio descargado! Ahora a darle play 🎧🔥' }, { quoted: m });
  }

  if (id === 'info_audio') {
    await conn.sendMessage(from, { text: 'Más info vendrá pronto, stay tuned 😎' }, { quoted: m });
  }
};

handler.help = ['ytmp3 <texto o url>'];
handler.tags = ['downloader', 'audio', 'game'];
handler.command = ['playxd'];

handler.exp = 10;

export default handler;