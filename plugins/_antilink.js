let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
  if (!m.isGroup) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat.antilink) return;

  if (isAdmin || isOwner || m.fromMe || isROwner) return;

  const text = m?.text || '';
  const isGroupLink = linkRegex.test(text) || linkRegex1.test(text);
  if (!isGroupLink) return;

  const userTag = `@${m.sender.split('@')[0]}`;
  const delet = m.key.participant;
  const msgID = m.key.id;

  // Ignora si es el link del mismo grupo
  if (isBotAdmin) {
    const ownGroupLink = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`;
    if (text.includes(ownGroupLink)) return;
  }

  // 🔥 Acción: eliminar mensaje
  if (isBotAdmin) {
    try {
      await conn.sendMessage(m.chat, {
        text: `✦ ${userTag} fue eliminado por enviar un enlace prohibido.`,
        mentions: [m.sender],
        contextInfo: global.rcanal
      }, { quoted: m });

      // 🔥 Elimina el mensaje del usuario
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: msgID,
          participant: delet
        }
      });

      // 🔥 Expulsa al usuario
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

    } catch (err) {
      console.error('❌ Error al expulsar o borrar:', err);
      await conn.sendMessage(m.chat, {
        text: `⚠️ No pude expulsar a ${userTag}. Puede que no tenga permisos o no se pudo eliminar el mensaje.`,
        mentions: [m.sender]
      }, { quoted: m });
    }
  } else {
    await conn.sendMessage(m.chat, {
      text: `⚠️ *Anti-link activado*, pero no soy admin pa expulsar a ${userTag}`,
      mentions: [m.sender]
    }, { quoted: m });
  }

  return !0;
}