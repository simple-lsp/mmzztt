const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const request = require('request')
// const cheerio = require('cheerio')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let exist = fs.existsSync('./photo')
if (!exist) fs.mkdirSync('./photo')

const headers = {
  'referer': 'https://mmzztt.com/',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36'
}

let load = function (id, prefix, list) {
  if (list.length === 0) return console.log('all loaded')
  let img = list.shift()
  let url = prefix + img
  let writeStream = fs.createWriteStream(`./photo/${id}/${img}`, {autoClose: true})
  let readStream = request({url, headers})
    .pipe(writeStream)
    .on('finish', _ => {
      console.log('saved', url)
      setTimeout(() => load(id, prefix, list), 800)
    })
  // .on('error', _ => res.send({success: false, message: e.toString()}))
}

app.post('/mzt/proxy', (req, res) => {
  let {url} = req.body
  console.log('get', url)
  request({url, headers}, (error, response, body) => res.send(body))
})

app.post('/mzt/download', (req, res) => {
  let {id, imgUrlPrefix, imgs} = req.body
  fs.mkdirSync(`./photo/${id}`)
  load(id, imgUrlPrefix, JSON.parse(imgs))
  res.send({success: true, message: '已开始下载'})
})
app.listen(port, () => console.log(`crawler listening at http://localhost:${port}`))

//HTML - list
// request({
//   url: 'https://www.mmzztt.com/photo/',method: 'get',headers
// }, (error, response, body) => {
//   const $ = cheerio.load(body), list = []
//   $('main .uk-card-body').each((i, el) => {
//     let a = $(el).children('h2').children('a')
//     let url = a.attr('href')
//     let title = a.text()
//     let time = $(el).children('time').text()
//     let item = {url, title, time}
//     list.push(item)
//   })
//   console.log(list)
// })

// HTML - photo list
// request(
//   {url: 'https://www.mmzztt.com/photo/67099', headers},
//   (error, response, body) => {
//     const $ = cheerio.load(body)
//     let commits = $('body').contents().filter((i, n) => n.nodeType === 8)
//     let text = commits[commits.length - 1].data
//     console.log(text)
//   })

//JPG
// let writeStream = fs.createWriteStream('./dist/favicon.png', {autoClose: true})
// let readStream = request({url: 'https://z.iimzt.com/img/favicon.png', headers})
//   .pipe(writeStream).on('finish', _ => console.log('ok'))