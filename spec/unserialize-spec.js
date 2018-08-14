import test from 'ava'
import { serialize, unserialize } from '../'

function testWithOutput(message, callback) {
  test(message, function(t) {
    function testOutput(testSubject, scope) {
      const serialized = serialize(testSubject)
      const unserialized = unserialize(serialized, scope)
      if (testSubject !== null) {
        t.is(testSubject.constructor.name, unserialized.constructor.name)
      }
      t.deepEqual(unserialized, testSubject)
    }

    callback(t, testOutput)
  })
}

testWithOutput('it works well', function(t, testOutput) {
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
testWithOutput('it works well with serialiables too', function(t, testOutput) {
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
testWithOutput('it works with non serializable classes too', function(t, testOutput) {
  class User {
    constructor() {
      this.name = 'Steel Brain'
      this.age = 17
    }
  }
  testOutput(new User(), { User })
})
testWithOutput('it works with nested serializable classes too', function(t, testOutput) {
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
testWithOutput('it accepts serialiazable classes not available in scope when strict mode is off', function(t) {
  const unserialized = unserialize(
    'C:10:"TestParent":50:{a:2:{i:0;C:4:"Test":3:{asd}i:1;O:7:"TestTwo":0:{}}}',
    {},
    { strict: false },
  )
  t.is(unserialized.constructor.name, '__PHP_Incomplete_Class')
  t.is(unserialized.__PHP_Incomplete_Class_Name, 'TestParent')
  t.is(typeof unserialized.a, 'undefined')
})
testWithOutput('it accepts classes not available in scope when strict mode is off', function(t) {
  class TestParent {
    a = 10
  }
  const item = new TestParent()
  const unserialized = unserialize(serialize(item), {}, { strict: false })
  t.is(unserialized.constructor.name, '__PHP_Incomplete_Class')
  t.is(unserialized.__PHP_Incomplete_Class_Name, 'TestParent')
  t.is(unserialized.a, 10)
})
testWithOutput('it can work with multi-byte strings', function(t, testOutput) {
  testOutput('你好世界')
  testOutput(['Helló', 'World'])
})
