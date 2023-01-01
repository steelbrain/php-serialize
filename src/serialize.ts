import { isInteger, getByteLength } from './helpers'
import { isInteger, getByteLength } from './helpers'

function getClassNamespace(item: any, scope: Record<string, any>) {
  return (
    Object.keys(scope).find(key => item instanceof scope[key]) || item.__PHP_Incomplete_Class_Name || item.constructor.name
  )
}

function serializeObject(item: any, scope: Record<string, any>): string {
  const processed = Array.isArray(item)
    ? item.map((value, index) => `${serialize(index, scope)}${serialize(value, scope)}`)
    : Object.keys(item).map(key => `${serialize(key, scope)}${serialize(item[key], scope)}`)
  const { length } = processed.filter(entry => typeof entry !== 'undefined')
  return `${length}:{${processed.join('')}}`
}

export default function serialize(
  item: any,
  scope: Record<string, any> = {},
  givenOptions: { encoding?: BufferEncoding } = {},
): string {
  const type = typeof item
  const options: any = { ...givenOptions }
  if (typeof options.encoding === 'undefined') {
    options.encoding = 'utf8'
  }

  if (item === null) {
    return 'N;'
  }
  if (type === 'number') {
    if (isInteger(item)) {
      return `i:${item};`
    }
    return `d:${item.toString().toUpperCase()};`
  }
  if (type === 'string') {
    return `s:${getByteLength(item, options)}:"${item}";`
  }
  if (type === 'boolean') {
    return `b:${item ? '1' : '0'};`
  }
  if (type !== 'object') {
    throw new TypeError(`Unexpected type '${type}' encountered while attempting to serialize`)
  }
  if (Array.isArray(item) || item.constructor.name === 'Object') {
    return `a:${serializeObject(item, scope)}`
  }

  if (item instanceof Map) {
    return `a:${item.size}:{` + Array.from(item.entries()).map(([value, key]) => {
      return `${serialize(value, scope)}${serialize(key, scope)}`
    }) + '}'
  }

  const constructorName = getClassNamespace(item, scope)
  if (typeof item.serialize === 'function') {
    const serialized = item.serialize()
    invariant(typeof serialized === 'string', `${item.constructor.name}.serialize should return a string`)
    return `C:${constructorName.length}:"${constructorName}":${getByteLength(serialized, options)}:{${serialized}}`
  }
  return `O:${constructorName.length}:"${constructorName}":${serializeObject(item, scope)}`
}
