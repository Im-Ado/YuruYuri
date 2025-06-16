//Creado por https://github.com/DIEGO-OFC/DORRAT-BOT-MD

import fetch from "node-fetch";

let handler = async (m, {text, usedPrefix, command, conn}) => {
  if (!text) throw `*[❕] Ingrese el nombre de una película*\n\n*❍ EJEMPLO: ${usedPrefix + command} Batman*`;

  let a = await fetch(`https://www.omdbapi.com/?t=${text}&apikey=caba8d6f`);
  let x = await a.json();

  // Verificar si hay un error en la respuesta de la API
  if (x.Response === "False") throw `*[❕] No se encontró la película: ${text}*`;

  // Definiendo las variables 'comienzo' y 'fin'
  const comienzo = "✧"; // Puedes cambiar esto por lo que desees
  const fin = "✿"; // Puedes cambiar esto por lo que desees

  let mov_txt = `*${comienzo}「 PELÍCULAS 」${fin}*\n
*Titulo ∙* ${x.Title || "-"}
*Publicado ∙* ${x.Year || "-"}
*Duracion ∙* ${x.Runtime || "-"}
*Genero ∙* ${x.Genre || "-"}
*Director ∙* ${x.Director || "-"}
*Actores ∙* ${x.Actors || "-"}
*Lenguajes ∙* ${x.Language || "-"}
*Awards ∙* ${x.Awards || "-"}
*Votos ∙* ${x.imdbVotes || "-"}
*Score ∙* ${x.Metascore || "-"}
*Tipo ∙* ${x.Type || "-"}
*Recaudado ∙* ${x.BoxOffice || "-"}
*Grabacion ∙* ${x.Country || "-"}

   ❕Pedido por @${m.sender.split("@")[0]}
*Yuri Bot*`;

  // Enviando el mensaje
  await conn.sendMessage(m.chat, {image: {url: x.Poster}, caption: mov_txt, mentions: [m.sender]}, {quoted: m});
};

handler.command = ['pelicula', 'peli'];
handler.limit = true;
export default handler;