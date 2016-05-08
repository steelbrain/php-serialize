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
  it('works with nested serializable classes too', function() {
    class ChildObject {
      constructor(name) {
        this.name = name
      }
    }
    class ChildClass {
      constructor(name) {
        this.name = name
      }
      serialize() {
        return this.name
      }
      unserialize(stuff) {
        this.name = stuff
      }
    }
    class Parent {
      constructor() {
        this._object = new ChildObject('Steel')
        this._class = new ChildClass('Brain')
      }
      serialize() {
        return serialize([this._object, this._class])
      }
      unserialize(stuff) {
        const array = unserialize(stuff, SCOPE)
        this._object = array[0]
        this._class = array[1]
      }
    }
    const SCOPE = { Parent, ChildObject, ChildClass }
    testOutput(new Parent(), SCOPE)
  })
  it('accepts serialiazable classes not available in scope when strict mode is off', function() {
    const unserialized = unserialize('C:10:"TestParent":50:{a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":0:{}}}', {}, { strict: false })
    expect(unserialized.constructor.name).toBe('__PHP_Incomplete_Class')
    expect(unserialized.__PHP_Incomplete_Class_Name).toBe('TestParent')
    expect(typeof unserialized.a).toBe('undefined')
  })
  it('accepts classes not available in scope when strict mode is off', function() {
    class TestParent {
      a = 10;
    }
    const item = new TestParent()
    const unserialized = unserialize(serialize(item), {}, { strict: false })
    expect(unserialized.constructor.name).toBe('__PHP_Incomplete_Class')
    expect(unserialized.__PHP_Incomplete_Class_Name).toBe('TestParent')
    expect(unserialized.a).toBe(10)
  })
})
