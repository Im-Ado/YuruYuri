import fetch from 'node-fetch'

export async function before(m, { conn }) {

global.rcanal = {
contextInfo: {
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: channelRD.id,
serverMessageId: 100,
newsletterName: channelRD.name,
}}}

}