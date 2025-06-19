import fetch from 'node-fetch';

const SEARCH_APIS = [
  { name: 'Servidor Vreden', url: 'http://api.alyabot.xyz:3269/search_youtube?query=' },
  { name: 'Servidor Delirius', url: 'http://api2.alyabot.xyz:5216/search_youtube?query=' },
  { name: 'Servidor Stellar', url: 'https://api3.alyabot.xyz/search_youtube?query=' }
];

const DOWNLOAD_APIS = [
  { name: 'Servidor Masha', url: 'http://api.alyabot.xyz:3269/download_audio?url=' },
  { name: 'Servidor Alya', url: 'http://api2.alyabot.xyz:5216/download_audio?url=' },
  { name: 'Servidor Masachika', url: 'https://api3.alyabot.xyz/download_audio?url=' }
];

async function tryFetchJSON(servers, query) {
  for (let server of servers) {
    try {
      const res = await fetch(server.url + encodeURIComponent(query));
      if (!res.ok) continue;
      const json = await res.json();
      if (json && Object.keys(json).length) return { json, serverName: server.name };
    } catch {
      continue;
    }
  }
  return { json: null, serverName: null };
}

let handler = async (m, { text, conn, command, usedPrefix }) => {
  if (!text) return m.reply(`✐ Ingresa Un Texto Para Buscar En Youtube\n> *Ejemplo:* ${usedPrefix + command} ozuna`);

  try {
    const { json: searchJson, serverName: searchServer } = await tryFetchJSON(SEARCH_APIS, text);

    if (!searchJson || !searchJson.results || !searchJson.results.length) {  
      return m.reply('❌ No se encontraron resultados.');
    }

    const video = searchJson.results[0];
    const thumb = video.thumbnails.find(t => t.width === 720)?.url || video.thumbnails[0]?.url;
    const videoTitle = video.title;
    const videoUrl = video.url;
    const duration = Math.floor(video.duration);
    const views = video.views.toLocaleString();
    const channel = video.channel;

    let txt = `*「✦」 ${videoTitle}*\n\n` +
      `> ✦ Canal » ${channel}\n` +
      `ⴵ Duración: » ${duration}s\n` +
      `✰ Vistas: » ${views}\n` +
      `🜸 Link: » ${videoUrl}\n` +
      `❒ Servidor: » ${searchServer || 'Desconocido'}`;

    await conn.sendMessage(m.chat, { image: { url: thumb }, caption: txt }, { quoted: m });

    const { json: downloadJson } = await tryFetchJSON(DOWNLOAD_APIS, videoUrl);

    if (!downloadJson || !downloadJson.file_url) {
      return m.reply('❌ No se pudo obtener el audio');
    }

    let audioUrl = downloadJson.file_url;

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: `${videoTitle}.mp3`,
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(`❌ Error: ${e.message}`);
    m.react('✖️');
  }
};

handler.command = ['play', 'mp3', 'ytmp3', 'playmp3'];
export default handler;