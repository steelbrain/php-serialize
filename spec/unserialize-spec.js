'use babel'

import { serialize, unserialize } from '../'

describe('unserialize', function() {
  function testOutput(testSubject, scope) {
    const serialized = serialize(testSubject)
    const unserialized = unserialize(serialized, scope)
    if (testSubject !== null) {
      expect(testSubject.constructor.name).toBe(unserialized.constructor.name)
    }
    expect(unserialized).toEqual(testSubject)
  }

  it('works well', function() {
    testOutput('Hey I am a very long string, this is to test if this package works with long strings, See #2')
    testOutput(1)
    testOutput(1.1)
    testOutput(null)
    testOutput(true)
    testOutput(false)
    testOutput([1, 2, 3])
    testOutput({ some: 'thing', hello: 'buddy', someWeirdCoolLongKey: 'SomeWeirdCoolLongValue' })
    testOutput({ some: { hey: 'Hello' } })
  })
  it('works well with serialiables too', function() {
    class User {
      constructor() {
        this.name = 'Steel Brain'
        this.age = 17
      }
      serialize() {
        return JSON.stringify({ age: this.age, name: this.name })
      }
      unserialize(stuff) {
        const decoded = JSON.parse(stuff)
        this.age = decoded.age
        this.name = decoded.name
      }
    }
    testOutput(new User(), { User })
  })
  it('works with non serializable classes too', function() {
    class User {
      constructor() {
        this.name = 'Steel Brain'
        this.age = 17
      }
    }
    testOutput(new User(), { User })
  })
})
