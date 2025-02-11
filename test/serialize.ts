/* eslint-disable max-classes-per-file, class-methods-use-this */

import { serialize } from '..'

function serializeForTests() {
  const items = []
  function debug(item, scope = {}) {
    items.push(serialize(item, scope))
  }

  class Test {
    serialize() {
      return 'asd'
    }
  }
  class TestTwo {
    test: string
    constructor() {
      this.test = 'hi'
    }
  }
  class TestParent {
    serialize() {
      return serialize([new Test(), new TestTwo()])
    }
  }
  class DeepUser {}

  debug(null)
  debug(1)
  debug(1.1)
  debug(1.7976931348623157e308)
  debug('你好世界')
  debug([1, 2, 3, 4, 5])
  debug(['Helló', 'World'])
  debug({ hey: 'hi' })
  debug({ key: 'value', key2: 1 })
  debug({ key: 1, key2: 'value2' })
  debug({ key: '1value', key2: 'value2' })
  debug({ key: 'value1', key2: 'value2' })
  debug(new Test())
  debug(new TestTwo())
  debug(new TestParent())
  debug(new DeepUser(), {
    'Deep\\User': DeepUser,
  })
  debug(
    (() => {
      const arr = []
      arr[0] = 'shallow'
      arr[4] = 'array'
      return arr
    })(),
  )
  debug(new Map([[1, 'q']]))
  debug(new Map([[1, '1'], [2, '2']]))
  debug(9007199254740999n)

  return items
}

export default serializeForTests
