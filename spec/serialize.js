'use babel'

import { serialize } from '../'

module.exports = function() {
  const items = []
  function debug(item: string) {
    items.push(serialize(item))
  }

  class Test {
    serialize() {
      return 'asd'
    }
  }
  class TestTwo {

  }
  class TestParent {
    serialize() {
      return serialize([
        new Test(),
        new TestTwo(),
      ])
    }
  }

  debug(null)
  debug(1)
  debug(1.1)
  debug([1, 2, 3, 4, 5])
  debug({ hey: 'hi' })
  debug(new Test())
  debug(new TestTwo())
  debug(new TestParent())

  return items
}
