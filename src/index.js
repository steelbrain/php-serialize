/* @flow */

import assert from 'assert'
import { getClass } from './helpers'

const REGEX = {
  i: /i:([\d]+);/,
  d: /d:([\d\.]+);/,
  C: /C:[\d]+:"([\S ]+?)":([\d]+):/,
  O: /O:[\d]+:"([\S ]+?)":([\d]+):/
}
type Options = {
  strict?: boolean
}

function serialize(item: any): string {
  const type = typeof item
  if (item === null) {
    return 'N;'
  }
  if (type === 'number') {
    if (item % 1 === 0) {
      return `i:${item};`
    }
    return `d:${item};`
  }
  if (type === 'string') {
    return `s:${item.length}:"${item}";`
  }
  if (type === 'boolean') {
    return `b:${item ? '1' : '0'};`
  }
  if (type !== 'object') {
    throw new TypeError()
  }

  const isArray = Array.isArray(item)
  if (isArray || item.constructor.name === 'Object') {
    // Array or raw object
    const toReturn = []
    let size = 0
    for (const key in item) {
      if (item.hasOwnProperty(key) && (key !== 'length' || isArray)) {
        size++
        const value = item[key]
        const saneKey = isArray ? parseInt(key, 10) : key
        toReturn.push(serialize(saneKey), serialize(value))
      }
    }
    toReturn.unshift(`a:${size}:{`)
    toReturn.push('}')
    return toReturn.join('')
  }
  if (typeof item.serialize === 'function') {
    const serialized = item.serialize()
    assert(typeof serialized === 'string', `${item.constructor.name}.serialize should return a string`)
    return `C:${item.constructor.name.length}:"${item.constructor.name}":${serialized.length}:{${serialized}}`
  }
  const items = []
  for (const key in item) {
    if (item.hasOwnProperty(key) && typeof item[key] !== 'function') {
      const value = item[key]
      items.push(serialize(key))
      items.push(serialize(value))
    }
  }
  return `O:${item.constructor.name.length}:"${item.constructor.name}":${items.length / 2}:{${items.join('')}}`
}

function unserializeItem(item: string, scope: Object, options: Options): { index: number, value: any } {
  const type = item.substr(0, 1)
  if (type === 'i' || type === 'd') {
    const match = REGEX[type].exec(item)
    assert(Array.isArray(match), 'Syntax Error')
    return { index: match[0].length, value: type === 'i' ? parseInt(match[1], 10) : parseFloat(match[1]) }
  }
  if (type === 'N') {
    return { index: 2, value: null }
  }
  if (type === 'b') {
    return { index: 4, value: item.substr(2, 1) === '1' }
  }
  if (type === 's') {
    const lengthEnd = item.indexOf(':', 2)
    const length = parseInt(item.slice(2, lengthEnd), 10) || 0
    const sliced = item.substr(4 + (lengthEnd - 2), length)
    return { index: 4 + lengthEnd + length, value: sliced }
  }
  if (type === 'C') {
    const info = REGEX.C.exec(item)
    assert(Array.isArray(info), 'Syntax Error')
    const className = info[1]
    const contentLength = parseInt(info[2], 10)
    const contentOffset = info.index + info[0].length + 1
    const classContent = item.slice(contentOffset, contentOffset + contentLength)
    assert(typeof scope[className] !== 'undefined', `Class ${className} not found in given scope`)
    assert(typeof scope[className].prototype.unserialize === 'function',
      `${className}.prototype.unserialize is not a function`)
    const container = new (getClass(scope[className].prototype))()
    container.unserialize(classContent)
    return { index: contentOffset + contentLength + 1, value: container }
  }
  if (type === 'a') {
    let first = true
    let container
    const lengthEnd = item.indexOf(':', 2)
    const length = parseInt(item.slice(2, lengthEnd), 10) || 0
    const index = unserializeObject(length, item.slice(4 + (lengthEnd - 2)), scope, function(key, value) {
      if (first) {
        container = parseInt(value, 10) === parseInt(value, 10) ? [] : {}
        first = false
      }
      if (container.constructor.name === 'Array') {
        container.push(value)
      } else container[key] = value
    }, options)
    return { index: 4 + (lengthEnd - 2) + index + 1, value: container }
  }
  if (type === 'O') {
    const info = REGEX.O.exec(item)
    assert(Array.isArray(info), 'Syntax Error')
    const className = info[1]
    const contentLength = parseInt(info[2], 10)
    const contentOffset = info.index + info[0].length + 1
    assert(typeof scope[className] !== 'undefined', `Class ${className} not found in given scope`)
    const container = new (getClass(scope[className].prototype))()
    const index = unserializeObject(contentLength, item.slice(contentOffset), scope, function(key, value) {
      container[key] = value
    }, options)
    return { index: contentOffset + index + 1, value: container }
  }
  throw new SyntaxError()
}

function unserializeObject(count: number, content: string, scope: Object, valueCallback: Function, options: Options): number {
  const realCount = count * 2
  let index = 0
  let key = null
  for (let i = 0; i < realCount; ++i) {
    const item = unserializeItem(content.slice(index), scope, options)
    if (key !== null) {
      valueCallback(key, item.value)
      key = null
    } else {
      key = item.value
    }
    index += item.index
  }
  return index
}

function unserialize(item: string, scope: Object = {}, options: Options = {}): any {
  return unserializeItem(item, scope, options).value
}

module.exports = { serialize, unserialize }
