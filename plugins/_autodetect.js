let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

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

  let chat = global.db.data.chats[m.chat]
  let usuario = `@${m.sender.split`@`[0]}`
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

  // Mensajes bonitos ✨
  const nombre = `《✧》${usuario} ha cambiado el nombre del grupo.\n\n> ❀ Nuevo nombre:\n> *${m.messageStubParameters[0]}*`
  const foto = `《✧》Se ha cambiado la imagen del grupo.\n\n> ❀ Acción hecha por:\n> » ${usuario}`
  const edit = `《✧》${usuario} ha permitido que *${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'}* puedan configurar el grupo.`
  const newlink = `《✧》El enlace del grupo ha sido *restablecido*.\n\n> ❀ Acción hecha por:\n> » ${usuario}`
  const status = `《✧》El grupo ha sido *${m.messageStubParameters[0] == 'on' ? 'cerrado 🔒' : 'abierto 🔓'}* por ${usuario}\n\n> ❀ Ahora *${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'}* pueden enviar mensajes.`
  const admingp = `《✧》@${m.messageStubParameters[0].split`@`[0]} ahora es *admin* del grupo.\n\n> ❀ Acción hecha por:\n> » ${usuario}`
  const noadmingp = `《✧》@${m.messageStubParameters[0].split`@`[0]} dejó de ser *admin* del grupo.\n\n> ❀ Acción hecha por:\n> » ${usuario}`

  // Condiciones por tipo de acción
  if (chat.detect && m.messageStubType == 21) {
    await conn.sendMessage(m.chat, {
      text: nombre,
      mentions: [m.sender],
      contextInfo: global.rcanal
    }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: foto,
      mentions: [m.sender],
      contextInfo: global.rcanal
    }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 23) {
    await conn.sendMessage(m.chat, {
      text: newlink,
      mentions: [m.sender],
      contextInfo: global.rcanal
    }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 25) {
    await conn.sendMessage(m.chat, {
      text: edit,
      mentions: [m.sender],
      contextInfo: global.rcanal
    }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 26) {
    await conn.sendMessage(m.chat, {
      text: status,
      mentions: [m.sender],
      contextInfo: global.rcanal
    }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 29) {
    await conn.sendMessage(m.chat, {
      text: admingp,
      mentions: [m.sender, m.messageStubParameters[0]],
      contextInfo: global.rcanal
    }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 30) {
    await conn.sendMessage(m.chat, {
      text: noadmingp,
      mentions: [m.sender, m.messageStubParameters[0]],
      contextInfo: global.rcanal
    }, { quoted: fkontak })

  } else {
    if (m.messageStubType == 2) return
    console.log({
      messageStubType: m.messageStubType,
      messageStubParameters: m.messageStubParameters,
      type: WAMessageStubType[m.messageStubType],
    })
  }
}

export default handler