import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌴 Pon el nombre o link pa buscar un video\nEjemplo:\n${usedPrefix + command} Me comí una salchipapa`);

  await m.react('🕒');

  try {
    // 🔎 Buscar el video con tu API
    const res = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.result || !data.result.audio) {
      await m.react('❌');
      return m.reply('❌ No pude encontrar el audio. Prueba con otro nombre bro');
    }

    const { title, audio, thumbnail, filename, creator, duration, url } = data.result;

    let caption = `*🎶 ¡Aquí va tu rolón! 🎶*\n\n` +
      `*🎧 Título:* ${title}\n` +
      `*⏱️ Duración:* ${duration || 'Desconocida'}\n` +
      `*🔗 Link:* ${url}\n\n` +
      `_Solicitado por ${m.pushName}_\n` +
      `*🌟 Servidor: Adonix API*`;

    // 🟢 Guardamos la URL y filename para luego
    conn.adonixDownloads = conn.adonixDownloads || {};
    conn.adonixDownloads[m.chat] = { audio, filename };

    // Enviamos imagen + botones reales 🧠
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: caption },
            footer: { text: "Selecciona una opción 🎮" },
            header: {
              title: title,
              gifPlayback: false,
              imageMessage: { url: thumbnail }
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '🎧 Descargar Audio',
                    id: `.descarga_audio`
                  })
                },
                {
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                    display_text: '🎨 Imagen Random IA',
                    id: `.imagen_adonix`
                  })
                }
              ]
            }
          }
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply(`❌ Error: ${e.message}`);
  }
};

// 🎧 Handler para botón de audio
handler.before = async function (m, { conn, command }) {
  if (command === 'descarga_audio') {
    let datos = conn.adonixDownloads?.[m.chat];
    if (!datos) return m.reply('😓 No encontré audio para descargar. Usa `.ytmp3` primero');

    await conn.sendMessage(m.chat, {
      audio: { url: datos.audio },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: datos.filename
    }, { quoted: m });

    return m.reply('✅ Audio enviado. Que lo disfrutes perro 🔊🎶');
  }

  if (command === 'imagen_adonix') {
    // 🤖 Imagen random con Adonix IA
    const prompts = ['perro con gafas', 'gato astronauta', 'robot en el futuro', 'niño anime triste', 'chica cyberpunk'];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    let res = await fetch(`https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(randomPrompt)}`);
    let json = await res.json();

    if (!json.imagen_generada) return m.reply('😿 No se pudo generar la imagen IA');

    await conn.sendMessage(m.chat, {
      image: { url: json.imagen_generada },
      caption: `🎨 *Adonix IA* te generó esto:\n📌 *Prompt:* ${randomPrompt}`
    }, { quoted: m });

    return;
  }
};

handler.help = ['ytmp3'];
handler.tags = ['downloader', 'juegos'];
handler.command = ['play3']; // Puedes añadir más

export default handler;