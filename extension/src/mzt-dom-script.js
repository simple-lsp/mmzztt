import WindowMessaging from './messaging/window-messaging'

let href = window.location.href
let id = href.split('/').pop()

//响应 dom.js
let windowMessaging = new WindowMessaging()
let log = (...contents) => windowMessaging.postMessage('mzt.log', {id, contents})
let clear = name => windowMessaging.postMessage('mzt.clear', {id, name})
let download = _ => windowMessaging.postMessage('mzt.download', {id})

window.mzt = {id, log, clear, download}
