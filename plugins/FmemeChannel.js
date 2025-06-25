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

const handler = async (m, { conn, command }) => {
  const mensajes = frases.slice(0, 10).map(f => [
    '', // título (opcional)
    f,  // cuerpo
    'https://i.imgur.com/U8nD4Ka.jpg', // imagen decorativa (puedes cambiarla)
    [], // botones secciones (no usado aquí)
    [['📋 Copiar frase', f]], // botón para que el texto se copie
    [], // extra
    []  // extra
  ]);

  await conn.sendCarousel(
    canal,
    '💫 Frases motivadoras para vos',
    'Seleccioná la que más te inspire',
    mensajes,
    m
  );

  m.reply('✅ Frases motivadoras enviadas al canal.');
};

handler.command = ['motivarme2'];
handler.help = ['motivarme2'];
handler.tags = ['fun'];

export default handler;