/* @flow */

import assert from 'assert'

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
    const toReturn = [`a:${item.length}{`]
    for (const key in item) {
      if (item.hasOwnProperty(key) && (key !== 'length' || isArray)) {
        const value = item[key]
        toReturn.push(serialize(key), serialize(value))
      }
    }
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

function unserialize(item: string): any {

}

export { serialize, unserialize }
export default { serialize, unserialize }
