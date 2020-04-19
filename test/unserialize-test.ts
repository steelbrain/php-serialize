/* eslint-disable max-classes-per-file, class-methods-use-this */

import test from 'ava'
import { serialize, unserialize } from '..'

function testWithOutput(message, callback) {
  test(message, t => {
    callback((testSubject, scope) => {
      const serialized = serialize(testSubject)
      const unserialized = unserialize(serialized, scope)
      if (testSubject !== null) {
        t.is(testSubject.constructor.name, unserialized.constructor.name)
      }
      t.deepEqual(unserialized, testSubject)
    })
  })
}

testWithOutput('it works well', testOutput => {
  testOutput('Hey I am a very long string, this is to test if this package works with long strings, See #2')
  testOutput(1)
  testOutput(1.1)
  testOutput(null)
  testOutput(true)
  testOutput(false)
  testOutput([1, 2, 3])
  testOutput({ some: 'thing', hello: 'buddy', someWeirdCoolLongKey: 'SomeWeirdCoolLongValue' })
  testOutput({ some: { hey: 'Hello' } })
  testOutput([])
  testOutput({ some: [] })
})
testWithOutput('it works well with serialiables too', testOutput => {
  class User {
    name: string
    age: number
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
testWithOutput('it works with non serializable classes too', testOutput => {
  class User {
    name: string
    age: number
    constructor() {
      this.name = 'Steel Brain'
      this.age = 17
    }
  }
  testOutput(new User(), { User })
})
testWithOutput('it works with nested serializable classes too', testOutput => {
  class ChildObject {
    name: string
    constructor(name) {
      this.name = name
    }
  }
  class ChildClass {
    name: string
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
    propObj: ChildObject
    propClass: ChildClass
    constructor() {
      this.propObj = new ChildObject('Steel')
      this.propClass = new ChildClass('Brain')
    }
    serialize() {
      return serialize([this.propObj, this.propClass])
    }
    unserialize(stuff) {
      const [propObj, propClass] = unserialize(stuff, SCOPE)
      this.propObj = propObj
      this.propClass = propClass
    }
  }
  const SCOPE = { Parent, ChildObject, ChildClass }
  testOutput(new Parent(), SCOPE)
})
test('it accepts serialiazable classes not available in scope when strict mode is off', t => {
  const unserialized = unserialize(
    'C:10:"TestParent":50:{a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":0:{}}}',
    {},
    { strict: false },
  )
  t.is(unserialized.constructor.name, '__PHP_Incomplete_Class')
  t.is(unserialized.__PHP_Incomplete_Class_Name, 'TestParent')
  t.is(typeof unserialized.a, 'undefined')
})
test('it accepts classes not available in scope when strict mode is off', t => {
  class TestParent {
    a: number
    constructor() {
      this.a = 10
    }
  }
  const item = new TestParent()
  const unserialized = unserialize(serialize(item), {}, { strict: false })
  t.is(unserialized.constructor.name, '__PHP_Incomplete_Class')
  t.is(unserialized.__PHP_Incomplete_Class_Name, 'TestParent')
  t.is(unserialized.a, 10)
})
testWithOutput('it can work with multi-byte strings', testOutput => {
  testOutput('你好世界')
  testOutput(['Helló', 'World'])
})
test('unserialize key pairs correctly, not serialized by self', t => {
  t.snapshot(unserialize(`a:1:{s:12:"97YEAY3JO237";s:2:"hi"}`))
  t.snapshot(unserialize(`a:1:{s:12:"02YJXTVI6ZOJ";s:2:"hi"}`))
  t.snapshot(unserialize(`a:1:{s:12:"X0YJXTVI6ZOJ";s:2:"hi"}`))
  t.snapshot(unserialize(`a:1:{s:2:"X0";s:2:"hi"}`))
  t.snapshot(unserialize(`a:1:{s:12:"0XYJXTVI6ZOJ";s:2:"hi"}`))
  t.snapshot(unserialize(`a:1:{s:2:"0x";s:2:"hi"}`))
  t.snapshot(unserialize(`a:1:{s:2:"0N";s:2:"hi"}`))
})
test('converts arrays with missing keys to objects', t => {
  const unserialized = unserialize('a:2:{i:25;i:105;i:31;i:106;}')
  t.deepEqual(unserialized, {
    25: 105,
    31: 106,
  })
})
