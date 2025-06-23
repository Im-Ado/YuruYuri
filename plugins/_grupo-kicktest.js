var handler = async (m, { conn, participants, usedPrefix, command }) => {
  const emoji = '🧹'
  const emoji2 = '🚫'

  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `${emoji} Debes mencionar o responder a alguien para poder expulsarlo.`, m)
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender

  // 🔍 Buscar JID real por si WhatsApp lo oculta
  if (!user.includes('@s.whatsapp.net')) {
    let probable = participants.find(u => u.id.includes(user) || u.id.replace(/\D/g, '').includes(user))
    if (probable) user = probable.id
  }

  const groupInfo = await conn.groupMetadata(m.chat)
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  // 🧠 Detección avanzada del bot
  const botNumber = conn.user.jid.split('@')[0]
  let botData = participants.find(p => conn.decodeJid(p.id).includes(botNumber)) || null
  const isBotAdmin = botData?.admin === 'admin' || botData?.admin === 'superadmin'

  // ⛔ Verificaciones para no banear a quien no se debe
  if (user === conn.user.jid) return conn.reply(m.chat, `${emoji2} No me puedo autoexpulsar bro 💀`, m)
  if (user === ownerGroup) return conn.reply(m.chat, `${emoji2} No se puede expulsar al creador del grupo 😤`, m)
  if (user === ownerBot) return conn.reply(m.chat, `${emoji2} Ese es mi creador we, no lo toqués 🥺`, m)

  // 🛡️ Si no soy admin, avisar bonito
  if (!isBotAdmin) {
    return conn.reply(m.chat, `${emoji2} No soy admin en este grupo así que no puedo expulsar 😔\nPero ahí tenés al que querías sacar 👉 @${user.replace(/@.+/, '')}`, m, { mentions: [user] })
  }

  // ✅ Intentar expulsar
  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
  } catch (e) {
    return conn.reply(m.chat, `❌ No pude expulsarlo\nMotivo: ${e}`, m)
  }
}

handler.help = ['kick']
handler.tags = ['grupo']
handler.command = ['kick2']
handler.admin = true
handler.group = true
handler.register = true
// ❌ NO uses handler.botAdmin = true, porque ya hacemos la validación manual arriba

export default handler