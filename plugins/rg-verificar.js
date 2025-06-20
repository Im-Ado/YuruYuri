import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

function getNumberFromJid(jid) {
  if (!jid) return 'Desconocido'
  if (typeof jid !== 'string') return 'Desconocido'
  if (jid.includes('@s.whatsapp.net')) {
    const number = jid.split('@')[0]
    const pn = new PhoneNumber(number, 'HN') // Cambia 'HN' por el código que quieras
    if (pn.isValid()) return pn.getNumber('international') // +504 XXXXXXX
    return '+' + number
  }
  return 'Desconocido'
}

let handler = async function (m, { conn, text, usedPrefix, command }) {
  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
  const mentionedJid = [who]

  const pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
  const user = global.db.data.users[m.sender]
  const name2 = conn.getName(m.sender)

  if (user.registered) {
    return m.reply(`✦.── Ya estás Registrado ──.✦\n\n¿Quieres volver a registrarte?\nUsa *${usedPrefix}unreg* para borrar tu registro.`)
  }

  if (!Reg.test(text)) {
    return m.reply(`✦.── Formato Incorrecto ──.✦\n\nUso correcto:\n*${usedPrefix + command} nombre.edad*\nEjemplo:\n*${usedPrefix + command} ${name2}.18*`)
  }

  let [_, name, __, age] = text.match(Reg)
  if (!name) return m.reply('✦.── Error ──.✦\n\n𔖲𔖮𔖭 El nombre no puede estar vacío.')
  if (!age) return m.reply('✦.── Error ──.✦\n\n𔖲𔖮𔖭 La edad no puede estar vacía.')
  if (name.length >= 100) return m.reply('✦.── Nombre muy largo ──.✦\n\n𔖲𔖮𔖭 El nombre no debe tener más de 100 caracteres.')

  age = parseInt(age)
  if (age > 1000) return m.reply('✦.── Edad demasiado alta ──.✦\n\n𔖲𔖮𔖭 Wow, el abuelo quiere jugar con el bot.')
  if (age < 5) return m.reply('✦.── Edad muy baja ──.✦\n\n𔖲𔖮𔖭 ¿Un bebé usando bots? Jsjs')

  // Registro
  user.name = `${name}✓`.trim()
  user.age = age
  user.regTime = +new Date()
  user.registered = true

  user.coin += 46
  user.exp += 310
  user.joincount += 25

  const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)

  // Si no tienes definida "moneda", defínela acá
  const moneda = '⛁'

  const regbot = `
✦ 𝗥 𝗘 𝗚 𝗜 𝗦 𝗧 𝗥 𝗔 𝗗 𝗢 ✦
•━━━━━━◇━━━━━━•
> ᰔᩚ Nombre » *${name}*
> ✎ Edad » *${age} años*
> ❀ ID » *${sn}*
•━━━━━━◇━━━━━━•
❀ 𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
> • ⛁ *${moneda}* » +46
> • ✰ *Experiencia* » +310
> • ❖ *Tokens* » +25
•━━━━━━◇━━━━━━•
> ꒰ Bienvenido/a ꒱`.trim()

  await m.react('🔥')

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: regbot,
    contextInfo: {
      externalAdReply: {
        title: `✦ 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔𝗗𝗢✦`,
        body: `🎀 Nombre: ${name} | Edad: ${age} 🎀`,
        thumbnailUrl: pp,
        sourceUrl: `https://wa.me/${m.sender.split('@')[0]}`,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: false
      }
    }
  }, { quoted: m })

  // Notificación al grupo oficial
  const grupoNotificacion = '120363401533528804@g.us'
  const mensajeNotificacion = `
✦ 𝗡𝗨𝗘𝗩𝗢 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢 ✦
•━━━━━━◇━━━━━━•
> ᰔᩚ Nombre » *${name}*
> ✎ Edad » *${age} añitos*
> ❀ ID » *${sn}*
> ✰ Número » *${getNumberFromJid(who)}*
•━━━━━━◇━━━━━━•
❀ 𝗥𝗲𝗰𝗼𝗺𝗽𝗲𝗻𝘀𝗮𝘀:
> • ⛁ *${moneda}* » +46
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
        contextInfo: {
          externalAdReply: {
            title: `✦ 𝗡𝗘𝗪 𝗨𝗦𝗘𝗥 ✦`,
            body: `• 🍨 Nombre: *${name}*\n• ☕ Edad: *${age} añitos*`,
            thumbnailUrl: ppGroup || pp,
            mediaType: 1,
            sourceUrl: `https://wa.me/${who.split('@')[0]}`,
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
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