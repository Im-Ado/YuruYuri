var handler = async (m, { conn, participants, usedPrefix, command }) => {
  const emoji = '⚠️'
  const emoji2 = '🚫'

  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder expulsarlo del grupo.`, m)
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender

  // 🔍 Verificar si el user es un ID temporal y buscar el verdadero
  if (!user.includes('@s.whatsapp.net')) {
    let probable = participants.find(u => u.id.includes(user) || u.id.replace(/\D/g, '').includes(user))
    if (probable) user = probable.id
  }

  const groupInfo = await conn.groupMetadata(m.chat)
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  if (user === conn.user.jid) {
    return conn.reply(m.chat, `${emoji2} No puedo eliminar el bot del grupo.`, m)
  }

  if (user === ownerGroup) {
    return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del grupo.`, m)
  }

  if (user === ownerBot) {
    return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del bot.`, m)
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick','echar','hechar','sacar','ban']
handler.admin = true
handler.group = true
handler.register = true
handler.botAdmin = false

export default handler