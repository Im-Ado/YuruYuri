import axios from 'axios';

const canalMeme = '120363420941524030@newsletter';
let intervaloMemeActivo = false;

const handler = async (m, { conn }) => {
  const enviarMeme = async () => {
    try {
      const res = await axios.get('https://g-mini-ia.vercel.app/api/meme');
      const memeUrl = res.data.url;
      const titulo = res.data.title || 'Meme sin título';

      if (!memeUrl) return;

      await conn.sendMessage(canalMeme, {
        image: { url: memeUrl },
        caption: `🤣 ${titulo}\n\n✨ Enviado por tu bot.`,
      });

    } catch (err) {
      console.error('❌ Error al enviar el meme:', err);
    }
  };

  // Enviar uno inmediatamente
  await enviarMeme();
  m.reply('✅ Meme enviado y comenzando autoenvío cada 8 minutos.');

  // Activar intervalo si no está activo
  if (!intervaloMemeActivo) {
    intervaloMemeActivo = true;
    setInterval(enviarMeme, 8 * 60 * 1000); // cada 8 minutos
  }
};

handler.command = ['enviarmeme'];
handler.help = ['enviarmeme'];
handler.tags = ['fun'];

export default handler;