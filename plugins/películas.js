//Creado por https://github.com/DIEGO-OFC/DORRAT-BOT-MD
// Y editado por Ado 
// github.com/Im-Ado

import fetch from "node-fetch";

let handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) throw `*[❕] Ingrese el nombre de una película*\n\n*❍ EJEMPLO: ${usedPrefix + command} Batman*`;

  let a = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=caba8d6f`);
  let x = await a.json();

  if (x.Response === "False") throw `*[❕] No se encontró la película: ${text}*`;

  const comienzo = "✦";
  const fin = "✦";

  let mov_txt = `
${comienzo} 𝗣 𝗘 𝗟 Í 𝗖 𝗨 𝗟 𝗔 𝗦 ${fin}
•━━━━━━━━━━━━━•
> 🎬 *Título:* ${x.Title || "-"}
> 📆 *Publicado:* ${x.Year || "-"}
> ⏱ *Duración:* ${x.Runtime || "-"}
> 🎭 *Género:* ${x.Genre || "-"}
> 🎥 *Director:* ${x.Director || "-"}
> 👥 *Actores:* ${x.Actors || "-"}
> 🗣 *Lenguajes:* ${x.Language || "-"}
> 🏆 *Premios:* ${x.Awards || "-"}
> ⭐ *Votos IMDb:* ${x.imdbVotes || "-"}
> 💯 *Score Metascore:* ${x.Metascore || "-"}
> 🎞 *Tipo:* ${x.Type || "-"}
> 💰 *Recaudado:* ${x.BoxOffice || "-"}
> 🌍 *País:* ${x.Country || "-"}
•━━━━━━━━━━━━━•
🤍 Pedido por @${m.sender.split("@")[0]}
*Yuru Yuri Bot*`;

  await conn.sendMessage(
    m.chat,
    {
      image: { url: x.Poster || 'https://files.catbox.moe/xr2m6u.jpg' },
      caption: mov_txt.trim(),
      mentions: [m.sender],
    },
    { quoted: m }
  );
};

handler.command = ['pelicula', 'peli'];
handler.limit = true;
export default handler;