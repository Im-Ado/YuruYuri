import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n\nEjemplo:\n${usedPrefix + command} haz un código JS que sume dos números`);
  }

  try {
    await m.react('🕒');

    const apiURL = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);
    const data = await res.json();

    if (!data || !data.respuesta || typeof data.respuesta !== 'string') {
      await m.react('❌');
      return m.reply('❌ No pude obtener respuesta de Adonix IA.');
    }

    // Separar código si lo hay
    const [mensaje, ...codigo] = data.respuesta.split(/```(?:javascript|js|html|)/i);
    let respuestaFinal = `🌵 *Adonix IA :*\n\n${mensaje.trim()}`;

    if (codigo.length > 0) {
      respuestaFinal += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
    }

    await m.reply(respuestaFinal);
    await m.react('✅');

  } catch (e) {
    console.error('[ERROR ADONIX IA]', e);
    await m.react('❌');
    return m.reply(`❌ Error al usar Adonix IA:\n\n${e.message}`);
  }
};

handler.help = ['adonix <pregunta>'];
handler.tags = ['ia', 'inteligencia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;