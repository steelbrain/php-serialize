"use strict"
let Serialize = require('./Main')
let Assert = require('assert')

Assert.equal(
  Serialize.unserialize(Serialize.serialize(1)), 1, "Works with integers"
)

Assert.equal(
  Serialize.unserialize(Serialize.serialize(true)), true, "Works with booleans"
)

Assert.equal(
  Serialize.unserialize(Serialize.serialize(1.1)), 1.1, "Works with Floats"
)

Assert.equal(
  Serialize.unserialize(Serialize.serialize("a")), "a", "Works with Strings"
)

Assert.equal(
  Serialize.unserialize(Serialize.serialize(null)), null, "Works with null"
)

Assert.deepEqual(
  Serialize.unserialize(Serialize.serialize({a: "a"})), {a: "a"}, "Works with Objects"
)

Assert.deepEqual(
  Serialize.unserialize(Serialize.serialize([1, 2])), [1, 2], "Works with Arrays"
)

class Test{
  serialize(){
    return "a"
  }
  unserialize(data){
    this.a = data
  }
}

Assert.equal(
  Serialize.unserialize(Serialize.serialize(new Test), {Test}).a, "a", "Works with serializable objects"
)