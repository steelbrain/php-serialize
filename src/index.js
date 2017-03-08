/* @flow */

import assert from 'assert'
import { getByteLength, getClass, getIncompleteClass } from './helpers'

const REGEX = {
  i: /i:([\d]+);/,
  d: /d:([\d.]+);/,
  C: /C:[\d]+:"([\S ]+?)":([\d]+):/,
  O: /O:[\d]+:"([\S ]+?)":([\d]+):/,
}

type Options = {
  strict: boolean
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
    return `s:${getByteLength(item)}:"${item}";`
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
      if ({}.hasOwnProperty.call(item, key) && (key !== 'length' || isArray)) {
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
  const constructorName = item.__PHP_Incomplete_Class_Name || item.constructor.name.length
  for (const key in item) {
    if ({}.hasOwnProperty.call(item, key) && typeof item[key] !== 'function') {
      const value = item[key]
      items.push(serialize(key))
      items.push(serialize(value))
    }
  }
  return `O:${constructorName}:"${item.constructor.name}":${items.length / 2}:{${items.join('')}}`
}

function unserializeItem(item: Buffer, startIndex: number, scope: Object, options: Options): { index: number, value: any } {
  let currentIndex = startIndex
  const type = item.toString('utf8', currentIndex, currentIndex + 1)
  // Increment for the type and color (or semi-color for null) characters
  currentIndex += 2

  if (type === 'N') {
    // Null
    return { index: currentIndex, value: null }
  }
  if (type === 'i' || type === 'd') {
    // Integer or Double (aka float)
    const valueEnd = item.indexOf(';', currentIndex)
    const value = item.toString('utf8', currentIndex, valueEnd)
    // +1 because of extra semi-colon at the end
    currentIndex += value.length + 1
    return { index: currentIndex, value: type === 'i' ? parseInt(value, 10) : parseFloat(value) }
  }
  if (type === 'b') {
    // Boolean
    const value = item.toString('utf8', currentIndex, currentIndex + 1)
    // +2 for 1 digital value and a semi-colon
    currentIndex += 2
    return { index: currentIndex, value: value === '1' }
  }
  if (type === 's') {
    // String
    const lengthEnd = item.indexOf(':', currentIndex)
    const length = parseInt(item.slice(currentIndex, lengthEnd), 10) || 0
    // +2 because of color and starting of inverted commas at start of string
    currentIndex = lengthEnd + 2
    const value = item.toString('utf8', currentIndex, currentIndex + length)
    // +2 because of closing of inverted commas at end of string, and extra semi-colon
    currentIndex += length + 2

    return { index: currentIndex, value }
  }
  if (type === 'C') {
    // Serializable class
    console.log('got a serialiazable class')
    const info = REGEX.C.exec(item)
    assert(Array.isArray(info), 'Syntax Error')
    const className = info[1]
    const contentLength = parseInt(info[2], 10)
    const contentOffset = info.index + info[0].length + 1
    const classContent = item.slice(contentOffset, contentOffset + contentLength)
    const classReference = scope[className]
    let container
    if (!classReference) {
      if (options.strict) {
        assert(false, `Class ${className} not found in given scope`)
      }
      container = getIncompleteClass(className)
    } else {
      assert(typeof scope[className].prototype.unserialize === 'function',
        `${className}.prototype.unserialize is not a function`)
      container = new (getClass(scope[className].prototype))()
      // $FlowIgnore: We validate it before, it has it. I'm sure
      container.unserialize(classContent)
    }
    return { index: contentOffset + contentLength + 1, value: container }
  }
  if (type === 'a') {
    // Array or Object
    let first = true
    let container = []
    const lengthEnd = item.indexOf(':', currentIndex)
    const length = parseInt(item.toString('utf8', currentIndex, lengthEnd), 10) || 0

    // +2 for ":{" before the start of array
    currentIndex = lengthEnd + 2
    currentIndex = unserializeObject(item, currentIndex, length, scope, function(key, value) {
      if (first) {
        container = parseInt(key, 10) === 0 ? [] : {}
        first = false
      }
      container[key] = value
    }, options)

    // +1 for the last } at the end of array
    currentIndex++
    return { index: currentIndex, value: container }
  }
  if (type === 'O') {
    // Non-Serializable Class
    const info = REGEX.O.exec(item)
    assert(Array.isArray(info), 'Syntax Error')
    const className = info[1]
    const contentLength = parseInt(info[2], 10)
    const contentOffset = info.index + info[0].length + 1
    const classReference = scope[className]
    let container: Object
    if (!classReference) {
      if (options.strict) {
        assert(false, `Class ${className} not found in given scope`)
      }
      container = getIncompleteClass(className)
    } else {
      container = new (getClass(scope[className].prototype))()
    }
    // const index = unserializeObject(contentLength, item.slice(contentOffset), scope, function(key, value) {
    //   container[key] = value
    // }, options)
    return { index: contentOffset + index + 1, value: container }
  }
  throw new SyntaxError()
}

function unserializeObject(item: Buffer, startIndex: number, length: number, scope: Object, valueCallback: Function, options: Options): number {
  let key = null
  let currentIndex = startIndex

  for (let i = 0; i < length * 2; ++i) {
    const entry = unserializeItem(item, currentIndex, scope, options)
    if (key !== null) {
      valueCallback(key, entry.value)
      key = null
    } else {
      key = entry.value
    }
    currentIndex = entry.index
  }

  return currentIndex
}

function unserialize(item: string, scope: Object = {}, givenOptions: Object = {}): any {
  const options = Object.assign({}, givenOptions)
  if (typeof options.strict === 'undefined') {
    options.strict = true
  }
  return unserializeItem(Buffer.from(item), 0, scope, options).value
}

module.exports = { serialize, unserialize }
