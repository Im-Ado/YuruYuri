import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const fkontak = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: '0@s.whatsapp.net'
  }

  let userJid = m.messageStubParameters[0]
  let userMention = `@${userJid.split('@')[0]}`
  let pp = await conn.profilePictureUrl(userJid, 'image').catch(_ => 'https://qu.ax/eOCUt.jpg')
  let img = await (await fetch(pp)).buffer()

  const chat = global.db.data.chats[m.chat]
  const groupSize = participants.length + (m.messageStubType === 27 ? 1 : (m.messageStubType === 28 || m.messageStubType === 32 ? -1 : 0))

  const txtWelcome = '🌸 𝑩𝑰𝑬𝑵𝑽𝑬𝑵𝑰𝑫@ 🌸'
  const txtBye = '🌸 𝑯𝑨𝑺𝑻𝑨 𝑳𝑼𝑬𝑮𝑶 🌸'

  if (chat.welcome) {
    if (m.messageStubType === 27) {
      let bienvenida = `
✿ *Bienvenid@* a *${groupMetadata.subject}* 🌺
✰ ${userMention}
${global.welcom1}

✦ Ahora somos *${groupSize}* miembros
•(=^･ω･^=)• ¡Disfruta tu estadía en el grupo!

> ✧ Usa *#help* para ver los comandos disponibles
      `.trim()

      await conn.sendMini(m.chat, txtWelcome, dev, bienvenida, img, img, redes, fkontak)
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
      let despedida = `
✿ *Adiós* de *${groupMetadata.subject}* 🥀
✰ ${userMention}
${global.welcom2}

✦ Ahora somos *${groupSize}* miembros
•(=；ω；=)• ¡Te esperamos pronto de vuelta!

> ✧ Usa *#help* si necesitas ayuda 🫶
      `.trim()

      await conn.sendMini(m.chat, txtBye, dev, despedida, img, img, redes, fkontak)
    }
  }
}