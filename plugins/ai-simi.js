import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n\nEjemplo:\n${usedPrefix + command} haz un código JS que sume dos números`);

  try {
    await m.react('🕒');

    const url = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.respuesta) {
      await m.react('❌');
      return m.reply('❌ No pude obtener respuesta de Adonix IA.');
    }

    // Manda la respuesta formateada bien chida
    await m.reply(`🌵 *Adonix IA :*\n\n${data.respuesta}`);

    await m.react('✅');

  } catch (e) {
    await m.react('❌');
    m.reply(`❌ Error al usar Adonix IA: ${e.message}`);
  }
};

handler.help = ['adonix <pregunta>'];
handler.tags = ['ia', 'inteligencia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;