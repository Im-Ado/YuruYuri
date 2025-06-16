// ./lib/xdtest.js
import axios from 'axios'
import cheerio from 'cheerio'

export async function ytmp3scraper(youtubeUrl) {
  try {
    const res = await axios.get('https://ytmp3.cc/en13/')
    const cookies = res.headers['set-cookie']
    
    const tokenRes = await axios.get('https://ytmp3.cc/en13/analyze/ajax', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': cookies.join('; ')
      },
      params: {
        url: youtubeUrl
      }
    })

    const $ = cheerio.load(tokenRes.data)
    const audio = $('#mp3 > a')
    const video = $('#mp4 > a')

    return {
      status: true,
      title: $('h1').text() || 'Video',
      mp3: audio.attr('href') || null,
      mp4: video.attr('href') || null
    }

  } catch (e) {
    return {
      status: false,
      error: e.message
    }
  }
}