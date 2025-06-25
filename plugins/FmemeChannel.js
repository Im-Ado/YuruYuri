const frases = [
  '🌟 Cree en ti, incluso cuando nadie más lo haga.',
  '🚀 Cada día es una nueva oportunidad para ser mejor.',
  '🔥 El éxito es la suma de pequeños esfuerzos repetidos cada día.',
  '💪 No te rindas, lo mejor está por venir.',
  '🌈 La actitud lo cambia todo.',
  '🧠 Tu mente es poderosa, cuídala y aliméntala con cosas buenas.',
  '⏳ No tengas miedo de empezar de nuevo, es otra oportunidad de hacerlo bien.',
  '🏁 El primer paso no te lleva a donde quieres ir, pero te saca de donde estás.',
  '🌻 Sé la energía que quieres atraer.',
  '💥 Hazlo con miedo, pero hazlo.'
];

const canal = '120363420941524030@newsletter';

const handler = async (m, { conn }) => {
  const frase = frases[Math.floor(Math.random() * frases.length)];

  await conn.sendMessage(canal, {
    text: frase,
    footer: '✨ Toca abajo para copiar esta frase',
    buttons: [
      {
        buttonId: `.`, // Puedes usar '.' o cualquier id que no ejecute otra acción
        buttonText: { displayText: '📋 Copiar frase' },
        type: 1
      }
    ],
    headerType: 1
  });

  await m.reply('✅ Frase motivadora enviada al canal.');
};

handler.command = ['motivarme'];
handler.help = ['motivarme'];
handler.tags = ['fun'];

export default handler;