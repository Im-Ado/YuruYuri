import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
  const mentionedJid = [who]

  const pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
  const user = global.db.data.users[m.sender]
  const name2 = conn.getName(m.sender)

  if (user.registered) {
    return m.reply(`✦.── Ya estás Registrado ──.✦\n\n¿Deseas volver a registrarte?\nUtiliza *${usedPrefix}unreg* para borrar tu registro.`, null, {
      contextInfo: { externalAdReply: rcanal }
    })
  }

  if (!Reg.test(text)) {
    return m.reply(`✦.── Formato Incorrecto ──.✦\n\nUso correcto:\n*${usedPrefix + command} nombre.edad*\nEjemplo:\n*${usedPrefix + command} ${name2}.18*`, null, {
      contextInfo: { externalAdReply: rcanal }
    })
  }

  let [_, name, __, age] = text.match(Reg)
  if (!name) return m.reply('✦.── Error ──.✦\n\n𔖲𔖮𔖭 El nombre no puede estar vacío.', null, {
    contextInfo: { externalAdReply: rcanal }
  })
  if (!age) return m.reply('✦.── Error ──.✦\n\n𔖲𔖮𔖭 La edad no puede estar vacía.', null, {
    contextInfo: { externalAdReply: rcanal }
  })
  if (name.length >= 100) return m.reply('✦.── Nombre muy largo ──.✦\n\n𔖲𔖮𔖭 El nombre no debe tener más de 100 caracteres.', null, {
    contextInfo: { externalAdReply: rcanal }
  })

  age = parseInt(age)
  if (age > 1000) return m.reply('✦.── Edad demasiado alta ──.✦\n\n𔖲𔖮𔖭 Wow, el abuelo quiere jugar con el bot.', null, {
    contextInfo: { externalAdReply: rcanal }
  })
  if (age < 5) return m.reply('✦.── Edad muy baja ──.✦\n\n𔖲𔖮𔖭 ¿Un bebé usando bots? Jsjs', null, {
    contextInfo: { externalAdReply: rcanal }
  })

  // Registro
  user.name = `${name}✓`.trim()
  user.age = age
  user.regTime = +new Date()
  user.registered = true

  user.coin += 46
  user.exp += 310
  user.joincount += 25

  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  const regbot = `
✦ 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗔 𝗗 𝗢 ✦
•━━━━━━◇━━━━━━•
> ᰔᩚ Nombre » *${name}*
> ✎ Edad » *${age} años*
> ❀ ID » *${sn}*
•━━━━━━◇━━━━━━•
❀ 𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
> • ⛁ *{moneda}* » +46
> • ✰ *Experiencia* » +310
> • ❖ *Tokens* » +25
•━━━━━━◇━━━━━━•
> ꒰ Bienvenido/a ꒱`.trim()

  await m.react('🔥')

  await conn.sendMessage(m.chat, {
    text: regbot,
    contextInfo: { externalAdReply: rcanal }
  }, { quoted: m })

  // Notificación al grupo oficial
  const grupoNotificacion = '120363401533528804@g.us'
  const mensajeNotificacion = `
✦ 𝗡𝗨𝗘𝗩𝗢 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢 ✦
•━━━━━━◇━━━━━━•
> ᰔᩚ Nombre » *${name}*
> ✎ Edad » *${age} años*
> ✦ ID » *${sn}*
•━━━━━━◇━━━━━━•
❀ Recompensas:
> • ⛁ *{moneda}* » +46
> • ✰ *Experiencia* » +310
> • ❖ *Tokens* » +25
•━━━━━━◇━━━━━━•
✿ *= FECHA* : ${moment().format('YYYY-MM-DD HH:mm:ss')}
`.trim()

  try {
    if (global.conn?.sendMessage) {
      const ppGroup = await conn.profilePictureUrl(who, 'image').catch(() => pp)
      await global.conn.sendMessage(grupoNotificacion, {
        image: { url: ppGroup || pp },
        caption: mensajeNotificacion,
        contextInfo: { externalAdReply: rcanal }
      })
    }
  } catch (e) {
    console.error('Error al enviar notificación al grupo:', e)
  }
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler