let insertAfter = (newElement, targetElement) => {
  let parent = targetElement.parentNode
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling)
  }
}

let insertBefore = (newElement, targetElement) => {
  let parent = targetElement.parentNode
  parent.insertBefore(newElement, targetElement)
}

let remove = (element) => {
  if (element && element.parentNode) return element.parentNode.removeChild(element)
}

let create = (tag) => {
  let div = document.createElement('div')
  div.innerHTML = tag
  return remove(div.childNodes[0])
}

let append = (container, tag, attributes) => {
  let element = create(tag, attributes)
  container.appendChild(element)
  return element
}

let show = (element, display = 'block') => {
  element.style.display = display
}

let hide = (element) => {
  element.style.display = 'none'
}

let hasClass = (element, className) => {
  if (!element) return false
  if (element.classList) return element.classList.contains(className)
  return new RegExp(`(\\s|^)${className}(\\s|$)`).test(element.className)
}

let addClass = (element, className) => {
  if (!element) return false
  if (element.classList) element.classList.add(className)
  else if (!hasClass(element, className)) element.className += ` ${className}`
}

let removeClass = (element, className) => {
  if (!element) return false
  if (element.classList) element.classList.remove(className)
  else element.className = element.className.replace(new RegExp(`\\b${className}\\b`, 'g'), '')
}

let toggleClass = (element, className, state) => {
  if (!element) return false
  if (element.classList) element.classList[state ? 'add' : 'remove'](className)
  else {
    const name = (` ${element.className} `).replace(/\s+/g, ' ').replace(` ${className} `, '')
    element.className = name + (state ? ` ${className}` : '')
  }
}

let appendScript = (jsPath, afterTarget, cb) => {
  let temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = jsPath
  temp.onload = () => {
    //temp.parentNode.removeChild(temp)
    if (cb) cb(temp)
  }
  if (afterTarget) insertAfter(temp, afterTarget)
  else document.body.appendChild(temp)
}

export default {
  hasClass, addClass, removeClass, toggleClass, appendScript, remove, create, append, show, hide, insertAfter, insertBefore
}
