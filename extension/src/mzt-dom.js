import WindowMessaging from './messaging/window-messaging'
import ChromeMessaging from './messaging/chrome-messaging'
import extension from './chrome/extension'
import dom from './utils/dom'
import axios from 'axios'

let names
window.chrome.storage.local.get(['namesHacked'], result => names = result['namesHacked'] || {})

function insertUI(flag, name) {
  let ui = document.getElementById('mzt-ui')
  if (!ui) {
    ui = dom.create(`<div id="mzt-ui"></div>`)
    let navApp = document.getElementsByClassName('uk-navbar-item u-app')[0]
    dom.insertAfter(ui, navApp)
  }
  ui.innerHTML = flag ?
    `<a style="margin:5px;" href="javascript:mzt.download();">下载</a><a style="margin:5px;" href="javascript:mzt.clear('${name}');">清除缓存</a>` :
    `<span style="margin:5px;">正在获取图片地址</span>`
}

function initMztUI(name) {
  let flag = !!names[name]
  console.log(name, flag)
  if (!flag) return insertUI(flag, name)

  window.chrome.storage.local.get([name], result => {
    let content = result[name]
    if (!content) return console.log('error: !content')
    let blob = new Blob([content], {type: 'text/javascript'})
    let url = URL.createObjectURL(blob)
    dom.appendScript(url)
    insertUI(flag, name)
  })
}

//与 background 通信
let chromeMessaging = new ChromeMessaging({
  'hacked': (request, sender, sendResponse) => {
    let {name} = request.body
    names[name] = true
    console.log('hacked', name)
    initMztUI(name)
  }
})

//与 dom-script 通信
let windowMessaging = new WindowMessaging({
  'mzt.log'({id, contents}) {
    chromeMessaging.postMessage('mzt.log', {id, contents})
  },
  'mzt.clear'({id, name}) {
    delete names[name]
    chromeMessaging.postMessage('mzt.clear', {id, name})
    alert(`${name} deleted`)
  },
  'mzt.download'({id}) {
    let imgUrlPrefix = localStorage.getItem('imgUrlPrefix')
    let imgs = localStorage.getItem('imgs')
    // chromeMessaging.postMessage('mzt.download', {id, imgUrlPrefix, imgs})
    axios.post('http://localhost:3000/mzt/download', {id, imgUrlPrefix, imgs}).then(res => alert(res.data.message))
  }
})

//inject
document.addEventListener('DOMContentLoaded', function () {
  dom.appendScript(extension.url('js/mzt-dom-script.js'))

  let href = window.location.href
  let urlItems = href.split('/')
  if (!isNaN(urlItems.pop()) && urlItems.pop() === 'photo') {

    let img = document.getElementsByTagName('img')[0]
    let imgUrlPrefix = img.src.split('/').slice(0, -1).join('/') + '/'
    localStorage.setItem('imgUrlPrefix', imgUrlPrefix)

    let scripts = document.getElementsByTagName('script')
    for (let i = 0, l = scripts.length; i < l; i++) {
      let src = scripts[i].src.split('?')[0]
      if (src.includes('//z.iimzt.com/style/view/')) return initMztUI(src.split('/').pop())
    }
  }
})
