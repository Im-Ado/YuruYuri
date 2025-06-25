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

const canalFrases = '120363420941524030@newsletter';

const handler = async (m, { conn }) => {
  const frase = frases[Math.floor(Math.random() * frases.length)];

  await conn.sendMessage(canalFrases, {
    text: frase,
    footer: '✨ Toca para copiar ✨',
    buttons: [
      {
        quickReplyButton: {
          displayText: '📋 Copy',
          id: frase
        }
      }
    ],
    mentions: [],
  });
  
  m.reply('✅ Frase enviada al canal motivacional.');
};

handler.command = ['motivarme'];
handler.help = ['motivarme'];
handler.tags = ['fun'];

export default handler;