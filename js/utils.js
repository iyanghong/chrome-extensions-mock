function createElement({tagName, id, classList, style, text, children, html, events = {}}) {
    let el = document.createElement(tagName)

    if (id) {
        el.id = id
    }

    if (text) {
        el.innerText = text
    }
    if (html) {
        el.innerHTML = html
    }


    if (classList) {
        if (!isArray(classList)) {
            classList = classList.split(' ')
        }
        classList.forEach(item => {
            el.classList.add(item)
        })
    }

    if (style) {
        if (typeof style === 'string') {
            el.style.cssText = style
        } else {
            for (let name in style) {
                el.style[name] = style[name]
            }
        }
    }
    for (let event in events) {
        if (typeof events[event] === 'function') {
            el.addEventListener(event, events[event])
        }
    }


    if (children) {
        if (isArray(children)) {
            children.forEach(child => {
                el.appendChild(createElement(child))
            })
        } else {
            el.innerText = children
        }
    }


    return el
}

function isArray(arg) {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
}