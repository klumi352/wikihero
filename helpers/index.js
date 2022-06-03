export const random = function() {
  return Math.random()
    .toString(36)
    .substr(2, 5)
}

export const delay = function(delay, cb = () => {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb()
      resolve()
    }, delay)
  })
}

export const wrap = function(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el)
  wrapper.appendChild(el)
}

export const transformKey = function(opts) {
  return function(value, name) {
    const trans = opts.find(([_name]) => {
      return _name === name
    })
    if (!trans) return value

    const handler = trans[1]
    return handler(value)
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const replaceAll = function(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

export const searchReplace = function(s, t) {
  const n = s.toLowerCase().indexOf(t.toLowerCase())
  if (n < 0) return s
  return (
    s.substring(0, n) +
    `<span class="trim">${s.substring(n, n + t.length)}</span>` +
    s.substring(n + t.length)
  )
}

export const findDeep = function(
  object,
  fn,
  found = {
    break: false,
    value: undefined
  }
) {
  if (typeof object !== 'object' || object == null) return undefined
  for (const i in object) {
    if (found.break) break

    const el = object[i]

    if (!fn(el, i, object)) findDeep(el, fn, found)
    // eslint-disable-next-line no-constant-condition
    else if ((found.break = true)) return (found.value = el)
  }
  return found.value
}

export const poll = function(fn, callback, errback, timeout, interval) {
  const endTime = Number(new Date()) + (timeout || 2000)
  interval = interval || 100
  ;(function p() {
    // В случае успешного выполнения условия
    if (fn()) {
      callback()
    }
    // Условие не выполнилось, но время ещё не вышло (тик интервала)
    else if (Number(new Date()) < endTime) {
      setTimeout(p, interval)
    }
    // Условие не выполнилось, а отведённое время вышло
    else {
      errback(new Error('timed out for ' + fn + ': ' + arguments))
    }
  })()
}
