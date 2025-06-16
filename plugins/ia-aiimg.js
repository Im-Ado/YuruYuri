const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*${xia} Por favor, ingresa un texto para generar una imagen.*\n> *\`Ejemplo:\`* ${usedPrefix + command} una galaxia sobre un castillo futurista`);
  }

  try {
    await m.react('⏳');

    const response = await fetch(`https://star-void-api.vercel.app/ai/pollinations?prompt=${encodeURIComponent(text)}`);
    const json = await response.json();

    if (!json.status || !json.result?.url) {
      throw new Error('*✖️ No se pudo generar la imagen.*');
    }

    const imageUrl = json.result.url;
    const caption = `*${xia} ${text}*`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('✖️');
    m.reply('*✖️ Ocurrió un error al generar la imagen.*');
  }
};

handler.help = ['polli', 'aiimg'].map(c => c + ' <texto>');
handler.tags = ['ia', 'herramientas'];
handler.command = ['polli']

export default handler;