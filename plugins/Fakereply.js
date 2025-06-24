import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const db = conn.adonixDownloads = conn.adonixDownloads || {}

  if (!text) return m.reply(`🌴 Pon el nombre o link pa buscar un video\nEjemplo:\n${usedPrefix + command} El clavo`);

  await m.react('🕒');

  try {
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.result || !data.result.audio) {
      await m.react('❌');
      return m.reply('❌ No pude obtener el audio.');
    }

    const { title, audio, thumbnail, filename, creator, duration, url } = data.result;

    let caption = `*「${wm}」*\n\n` +
      `*❒ Título:* ${title}\n` +
      `*★ Duración:* ${duration}\n` +
      `*✧ Link:* ${url}\n\n` +
      `_Solicitado por ${m.pushName}_\n` +
      `*❀ Servidor: Adonix API*`;

    // Guardar temporalmente audio
    db[m.sender] = { audio, filename };

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      footer: 'Elegí qué hacer 🎮',
      buttons: [
        { buttonId: 'descarga_adonix_audio', buttonText: { displayText: '🎧 Descargar Audio' }, type: 1 },
        { buttonId: 'imagen_adonix_ia', buttonText: { displayText: '🎨 Imagen IA Random' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply('❌ Error: ' + e.message);
  }
};

handler.before = async function (m, { conn }) {
  const db = conn.adonixDownloads = conn.adonixDownloads || {};

  if (m.text === 'descarga_adonix_audio') {
    const datos = db[m.sender];
    if (!datos) return m.reply('🛑 Usa el comando primero para generar un audio');

    await conn.sendMessage(m.chat, {
      audio: { url: datos.audio },
      mimetype: 'audio/mpeg',
      fileName: datos.filename,
      ptt: true
    }, { quoted: m });

    return m.reply('✅ Ahí va el audio perro 🔊');
  }

  if (m.text === 'imagen_adonix_ia') {
    const prompts = ['gato hacker', 'perro en la luna', 'niña anime triste', 'robot salvando al mundo'];
    const idea = prompts[Math.floor(Math.random() * prompts.length)];

    const res = await fetch(`https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(idea)}`);
    const data = await res.json();

    if (!data.imagen_generada) return m.reply('😿 No se pudo generar imagen IA');

    await conn.sendMessage(m.chat, {
      image: { url: data.imagen_generada },
      caption: `🖼️ Imagen IA generada con prompt: *${idea}*`
    }, { quoted: m });

    return;
  }
};

handler.command = ['play3'];
handler.help = ['ytmp3 <nombre o link>'];
handler.tags = ['downloader'];

export default handler;