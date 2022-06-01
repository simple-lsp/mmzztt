import axios from 'axios'
import ChromeMessaging from './messaging/chrome-messaging'
import extension from './chrome/extension'
import Str from './utils/str'

function queryTab(query, cb) {
  window.chrome.tabs.query(query, cb)
}

function queryMztPhoto(cb) {
  queryTab({url: `*://mmzztt.com/photo/*`}, cb)
}

// function getCurrentTabId(callback) {
//   window.chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//     if (callback) callback(tabs.length ? tabs[0].id : null)
//   })
// }

let names
window.chrome.storage.local.get(['namesHacked'], result => {
  names = result['namesHacked'] || {}
})

const commonJS = '//z.iimzt.com/style/common.js'
const decJS = '//z.iimzt.com/style/view/'
const headers = {
  // 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
  'referer': 'https://mmzztt.com/'
}

function getSource(url) {
  let name = url.split('/').pop()
  if (names[name]) return
  console.log('getSource', url)
  axios.get(url, {headers}).then(res => {
    let content = hack(res.data)
    names[name] = true
    window.chrome.storage.local.set({[name]: content, 'namesHacked': names})
    console.log(name, 'hacked', content.length)
    queryMztPhoto(tabs => tabs.forEach(tab => window.chrome.tabs.sendMessage(tab.id, {
      title: 'hacked',
      body: {name}
    })))
  })
}

function hack(content) {
  let str = new Str(content)
  str.findFirst('JSON')
  str.backward('=')
  let urls = str.backward(',')
  str.findFirst('JSON')
  str.forward(';', true)
  str.insert(`localStorage.setItem('imgs',JSON.stringify(${urls}));`)
  return str.content
}

let chromeMessaging = new ChromeMessaging({
  'mzt.log': (request, sender, sendResponse) => {
    let {id, contents} = request.body
    console.log(`[${id}]`, ...contents)
    // sendResponse({success: true, result: 'OK'})
  },
  'mzt.clear': (request, sender, sendResponse) => {
    let {id, name} = request.body
    delete names[name]
    window.chrome.storage.local.remove(name)
    window.chrome.storage.local.set({'namesHacked': names})
    console.log(`[${id}]`, 'clear cache :', name)
    // sendResponse({success: true, result: 'OK'})
  },
  'mzt.download': (request, sender, sendResponse) => {
    let {id, imgUrlPrefix, imgs} = request.body
    // let zip = new JSZip()
    // Promise.all(imgs.map(img => axios.get(imgUrlPrefix + img, {headers})
    //     .then(res => zip.file(img, res.data))))
    //   .then(_ => zip.generateAsync({type: 'blob'})
    //     .then(content => {
    //       let url = URL.createObjectURL(content)
    //       console.log(url)
    //     }))
  }
})

window.chrome.webRequest.onBeforeRequest.addListener(details => {
  let u = details.url
  if (u.includes(commonJS)) return {redirectUrl: extension.url('hack/common.js')}
  if (u.includes(decJS) && u.includes('?v=')) {
    getSource(u.split('?')[0])
    return {cancel: true}
  }
}, {urls: [/*\/\/z.iimzt.com\/style\/*/], types: ['script']}, ['blocking'])

console.log('mzt running!')