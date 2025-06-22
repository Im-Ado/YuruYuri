import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta o solicitud]\n\nEjemplo:\n${usedPrefix + command} haz un código en JS que sume dos números`);

  try {
    await m.react('🧠');

    // Llamamos a la API (POST)
    let res = await fetch('https://theadonix-api.vercel.app/api/adonix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    let data = await res.json();

    if (!data.response || !data.response.respuesta) {
      await m.react('❌');
      return m.reply('❌ No pude obtener respuesta de Adonix IA.');
    }

    let reply = `🤖 *Adonix IA* 🤖\n\n*Tu pregunta:*\n${text}\n\n*Respuesta:*\n${data.response.respuesta}\n\n*Peticiones hechas al bot:* ${data.requestsCount}`;

    await m.reply(reply);
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    m.reply(`❌ Error al usar Adonix IA: ${e.message}`);
  }
};

handler.help = ['adonix <pregunta>'];
handler.tags = ['ia', 'inteligencia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;