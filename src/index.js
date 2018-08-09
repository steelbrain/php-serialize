/* @flow */

import assert from 'assert'
import { getByteLength, getClass, getIncompleteClass } from './helpers'

type Options = {
  strict: boolean,
}

function getClassNamespace(item: any, scope: Object) {
  for (const key in scope) {
    if ({}.hasOwnProperty.call(scope, key) && scope[key] === item.constructor) {
      return key
    }
  }
  return item.constructor.name
}

function serialize(item: any, scope: Object = {}): string {
  const type = typeof item
  if (item === null) {
    return 'N;'
  }
  if (type === 'number') {
    if (item === parseInt(item, 10)) {
      return `i:${item};`
    }
    return `d:${item.toString().toUpperCase()};`
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
    const constructorName = item.__PHP_Incomplete_Class_Name || getClassNamespace(item, scope)
    assert(typeof serialized === 'string', `${item.constructor.name}.serialize should return a string`)
    return `C:${constructorName.length}:"${constructorName}":${serialized.length}:{${serialized}}`
  }
  const items = []
  const constructorName = item.__PHP_Incomplete_Class_Name || getClassNamespace(item, scope)
  for (const key in item) {
    if ({}.hasOwnProperty.call(item, key) && typeof item[key] !== 'function') {
      const value = item[key]
      items.push(serialize(key, scope))
      items.push(serialize(value, scope))
    }
  }
  return `O:${constructorName.length}:"${constructorName}":${items.length / 2}:{${items.join('')}}`
}

function unserializeItem(item: Buffer, startIndex: number, scope: Object, options: Options): { index: number, value: any } {
  let currentIndex = startIndex
  const type = item.toString('utf8', currentIndex, currentIndex + 1)
  // Increment for the type and colon (or semi-colon for null) characters
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
    // +2 because of colon and starting of inverted commas at start of string
    currentIndex = lengthEnd + 2
    const value = item.toString('utf8', currentIndex, currentIndex + length)
    // +2 because of closing of inverted commas at end of string, and extra semi-colon
    currentIndex += length + 2

    return { index: currentIndex, value }
  }
  if (type === 'C') {
    // Serializable class
    const classNameLengthEnd = item.indexOf(':', currentIndex)
    const classNameLength = parseInt(item.toString('utf8', currentIndex, classNameLengthEnd), 10) || 0

    // +2 for : and start of inverted commas for class name
    currentIndex = classNameLengthEnd + 2
    const className = item.toString('utf8', currentIndex, currentIndex + classNameLength)
    // +2 for end of inverted commas and colon before inner content length
    currentIndex += classNameLength + 2

    const contentLengthEnd = item.indexOf(':', currentIndex)
    const contentLength = parseInt(item.toString('utf8', currentIndex, contentLengthEnd), 10) || 0
    // +2 for : and { at start of inner content
    currentIndex = contentLengthEnd + 2

    const classContent = item.toString('utf8', currentIndex, currentIndex + contentLength)
    // +1 for the } at end of inner content
    currentIndex += contentLength + 1

    const container = getClassReference(className, scope, options.strict)
    if (container.constructor.name !== '__PHP_Incomplete_Class') {
      assert(
        typeof container.unserialize === 'function',
        `${container.constructor.name.toLowerCase()}.unserialize is not a function`,
      )
      // console.log('classContent', classContent)
      container.unserialize(classContent)
    }
    return { index: currentIndex, value: container }
  }
  if (type === 'a') {
    // Array or Object
    let first = true
    let container = []
    const lengthEnd = item.indexOf(':', currentIndex)
    const length = parseInt(item.toString('utf8', currentIndex, lengthEnd), 10) || 0

    // +2 for ":{" before the start of object
    currentIndex = lengthEnd + 2
    currentIndex = unserializeObject(
      item,
      currentIndex,
      length,
      scope,
      function(key, value) {
        if (first) {
          container = parseInt(key, 10) === 0 ? [] : {}
          first = false
        }
        container[key] = value
      },
      options,
    )

    // +1 for the last } at the end of object
    currentIndex++
    return { index: currentIndex, value: container }
  }
  if (type === 'O') {
    // Non-Serializable Class
    const classNameLengthEnd = item.indexOf(':', currentIndex)
    const classNameLength = parseInt(item.toString('utf8', currentIndex, classNameLengthEnd), 10) || 0

    // +2 for : and start of inverted commas for class name
    currentIndex = classNameLengthEnd + 2
    const className = item.toString('utf8', currentIndex, currentIndex + classNameLength)
    // +2 for end of inverted commas and colon before inner content length
    currentIndex += classNameLength + 2

    const contentLengthEnd = item.indexOf(':', currentIndex)
    const contentLength = parseInt(item.toString('utf8', currentIndex, contentLengthEnd), 10) || 0
    // +2 for : and { at start of object
    currentIndex = contentLengthEnd + 2

    const container = getClassReference(className, scope, options.strict)
    currentIndex = unserializeObject(
      item,
      currentIndex,
      contentLength,
      scope,
      function(key, value) {
        container[key] = value
      },
      options,
    )
    // +1 for the last } at the end of object
    currentIndex += 1
    return { index: currentIndex, value: container }
  }
  throw new SyntaxError()
}

function getClassReference(className: string, scope: Object, strict: boolean): Object {
  let container
  const classReference = scope[className]
  if (!classReference) {
    if (strict) {
      assert(false, `Class ${className} not found in given scope`)
    }
    container = getIncompleteClass(className)
  } else {
    container = new (getClass(scope[className].prototype))()
  }
  return container
}

function unserializeObject(
  item: Buffer,
  startIndex: number,
  length: number,
  scope: Object,
  valueCallback: Function,
  options: Options,
): number {
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
