module.exports = class Str {
  constructor(content) {
    this.content = content
    this.index = 0
  }

  findFirst(str, indexToStrEnd) {
    this.index = this.content.indexOf(str)
    if (indexToStrEnd) this.index += str.length
    return this.index
  }

  backward(str, indexToStrEnd) {
    let {content: c, index: i} = this
    let l = str.length, temp = ''
    i -= l
    while (i > 0) {
      if (c.slice(i, i + l) === str) {
        this.index = i
        if (indexToStrEnd) this.index += str.length
        return temp
      }
      temp = c.charAt(i) + temp
      i--
    }
  }

  forward(str, indexToStrEnd) {
    let {content: c, index: i} = this
    let t = c.length, l = str.length, temp = ''
    while (i < t) {
      if (c.slice(i, i + l) === str) {
        this.index = i
        if (indexToStrEnd) this.index += str.length
        return temp
      }
      temp += c.charAt(i)
      i++
    }
  }

  insert(str) {
    let {content: c, index: i} = this
    this.content = c.slice(0, i) + str + c.slice(i)
  }
}