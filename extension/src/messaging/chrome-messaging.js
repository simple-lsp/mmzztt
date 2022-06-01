export default class ChromeMessaging {
  constructor(handles, name = 'ChromeMessaging') {
    this.name = name
    if (!handles) handles = {}
    this._handlers = handles
    this._eventHandler = this.disposeMessage.bind(this)
    if (this.usable) window.chrome.runtime.onMessage.addListener(this._eventHandler)
  }

  get usable() {
    return window.chrome && window.chrome.runtime
  }

  disposeMessage(request, sender, sendResponse) {
    if (!request || !request.title) return
    let title = request.title, h = this._handlers
    if (h.hasOwnProperty(title)) {
      //console.log(`[${this.name}] received:`, request.title, request.body, ' from:', sender.tab ? sender.tab.url : sender)
      let sr = sendResponse
      sendResponse = (...res) => {
        console.log(`[${this.name}] response:`, request.title, ...res)
        sr.apply(null, res)
      }
      h[title](request, sender, sendResponse)
      return true
    }
    return false
  }

  addHandler(title, handler) {
    this._handlers[title] = handler
  }

  postMessage(title, body, callback) {
    // extensionId?: string,
    // message: any,
    // options?: object,
    // callback?: function,
    window.chrome.runtime.sendMessage({title, body}, callback)
  }
}
