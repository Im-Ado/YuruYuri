import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = async (m) => {

  global.getBuffer = async function getBuffer(url, options = {}) {
    try {
      const res = await axios({
        method: "get",
        url,
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (e) {
      console.log(`Error : ${e}`)
      return null
    }
  }
  
  // Estas variables globales dependen de conn, que no está declarado acá, 
  // supongo que lo tienes global o lo defines en otro lado antes de usar handler
  global.creador = 'Wa.me/393715279301'
  global.ofcbot = conn.user.jid.split('@')[0]
  global.namechannel = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
  global.namechannel2 = '=͟͟͞❀ 𝐘𝐮𝐤𝐢 𝐒𝐮𝐨𝐮 - 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 ⏤͟͟͞͞★'
  global.namegrupo = 'ᰔᩚ ᥡᥙkі sᥙ᥆ᥙ • ᥆𝖿іᥴіᥲᥣ ❀'
  global.namecomu = 'ᰔᩚ ᥡᥙkіᑲ᥆𝗍-mძ • ᥴ᥆mᥙᥒі𝗍ᥡ ❀'
  global.listo = '✦ *Aquí tienes ฅ^•ﻌ•^ฅ*'
  
  // Perfil, con catch para evitar que crashee
  global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  global.canalIdM = [
    "120363402846939411@newsletter",
    "120363420047428304@newsletter",
    "120363420941524030@newsletter"
  ]
  global.canalNombreM = [
    "✦ sʏᴀ ᴛᴇᴀᴍ | 2025 ✧",
    "✧❅ꨄ ʏᴜʀᴜ ʏᴜʀɪ ┋ᴄʜᴀɴɴᴇʟ ☙❢❀",
    "🔥 𝗩𝗶𝗿𝗮𝗹𝗦𝘁𝗶𝗰𝗸 & 𝗠𝗲𝗺𝗲𝘀 𝗕𝘆 𝗦𝗬𝗔 🎬"
  ]
  global.channelRD = await getRandomChannel()

  const d = new Date(Date.now() + 3600000)
  const locale = 'es'
  global.d = d
  global.locale = locale
  global.dia = d.toLocaleDateString(locale, { weekday: 'long' })
  global.fecha = d.toLocaleDateString(locale, { day: 'numeric', month: 'numeric', year: 'numeric' })
  global.mes = d.toLocaleDateString(locale, { month: 'long' })
  global.año = d.toLocaleDateString(locale, { year: 'numeric' })
  global.tiempo = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

  global.rwait = '🕒'
  global.done = '✅'
  global.error = '✖️'
  global.msm = '⚠︎'

  global.emoji = '» ✧ «'
  global.emoji2 = '「✿」'
  global.emoji3 = '✦'
  global.emoji4 = '【❀】'
  global.emoji5 = '✰'
  global.emojis = pickRandom([global.emoji, global.emoji2, global.emoji3, global.emoji4])

  global.wait = '❍ Espera un momento, soy lenta...'
  global.waitt = '❍ Espera un momento, soy lenta...'
  global.waittt = '❍ Espera un momento, soy lenta...'
  global.waitttt = '❍ Espera un momento, soy lenta...'

  const canal = 'https://whatsapp.com/channel/0029VbAfPu9BqbrEMFWXKE0d'
  const comunidad = 'https://chat.whatsapp.com/I0dMp2fEle7L6RaWBmwlAa'
  const git = 'https://github.com/The-King-Destroy'
  const github = 'https://github.com/The-King-Destroy/Yuki_Suou-Bot'
  const correo = 'thekingdestroy507@gmail.com'
  global.redes = pickRandom([canal, comunidad, git, github, correo])

  const category = "imagen"
  const dbPath = './src/database/db.json'
  const db_ = JSON.parse(fs.readFileSync(dbPath))
  const randomIndex = Math.floor(Math.random() * db_.links[category].length)
  const randomlink = db_.links[category][randomIndex]
  const response = await fetch(randomlink)
  const rimg = await response.buffer()
  global.icons = rimg

  const ase = new Date()
  const hour = ase.getHours()
  let saludo
  switch (hour) {
    case 0: case 1: case 2: case 18: case 19: case 20: case 21: case 22: case 23:
      saludo = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'
      break
    case 3: case 4: case 5: case 6: case 8: case 9:
      saludo = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'
      break
    case 7:
      saludo = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'
      break
    case 10: case 11: case 12: case 13:
      saludo = 'Lɪɴᴅᴏ Dɪᴀ 🌤'
      break
    case 14: case 15: case 16: case 17:
      saludo = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'
      break
    default:
      saludo = 'Hola'
  }
  global.saludo = saludo

  global.nombre = m.pushName || 'Anónimo'
  global.taguser = '@' + m.sender.split("@")[0]
  const more = String.fromCharCode(8206)
  global.readMore = more.repeat(850)

  global.packsticker = `✧ 𝖸𝗎𝗋𝗎 𝖸𝗎𝗋𝗂 𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦 ✧\n💜 ᴜsᴜᴀʀɪᴏ: ${global.nombre}\n⛓️‍💥 ᴍᴀᴅᴇ ʙʏ ${global.botname || 'Bot'}`
  global.packsticker2 = `🍁 𝙾𝚆𝙽𝙴𝚁: Wirk`

  global.fkontak = {
    key: {
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {})
    },
    message: {
      contactMessage: {
        displayName: global.nombre,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${global.nombre},;;;\nFN:${global.nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        jpegThumbnail: null,
        thumbnail: null,
        sendEphemeral: true
      }
    }
  }

  global.fake = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.channelRD.id,
        newsletterName: global.channelRD.name,
        serverMessageId: -1
      }
    }
  }

  global.icono = pickRandom([
    'https://qu.ax/dychF.jpg',
  ])

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardingScore: 9999
    }
  }
}

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

async function getRandomChannel() {
  let randomIndex = Math.floor(Math.random() * global.canalIdM.length)
  let id = global.canalIdM[randomIndex]
  let name = global.canalNombreM[randomIndex]
  return { id, name }
}