export default {
  url(path) {
    return window.chrome.extension.getURL(path)
  }
}
