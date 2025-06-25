import axios from 'axios';

const handler = async (m, { conn }) => {
  // Función para enviar el meme
  const sendMeme = async () => {
    try {
      // Llamada a la API de memes
      const res = await axios.get('https://g-mini-ia.vercel.app/api/meme');
      const memeUrl = res.data.url; // URL del meme

      // Enviar el meme al canal
      await conn.sendMessage('120363420941524030@newsletter', { 
        image: { url: memeUrl }, 
        caption: 'Aquí tienes tu meme 🐶✨'
      });
    } catch (error) {
      console.error('Error al obtener el meme:', error);
    }
  };

  // Enviar el meme cada 5 minutos
  setInterval(sendMeme, 5 * 60 * 1000); // 5 minutos en milisegundos
};

// Exporte el handler
handler.command = ['sendmeme'];
export default handler;