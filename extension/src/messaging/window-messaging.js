export default class WindowMessaging {
  constructor(handles) {
    if (!handles) handles = {}
    this._handlers = handles
    window.addEventListener('message', this.disposeMessage.bind(this), false)
  }

  disposeMessage(e) {
    if (!e.data) return
    let {title, body} = e.data, h = this._handlers
    if (h.hasOwnProperty(title)) h[title](body, title)
  }

  addHandler(title, handler) {
    this._handlers[title] = handler
  }

  postMessage(title, body, targetOrigin = '*') {
    window.postMessage({title, body}, targetOrigin)
  }
}
