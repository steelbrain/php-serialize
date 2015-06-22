"use strict"
let Chart = {
  a: 'array',
  b: 'boolean',
  C: 'object-serializable',
  d: 'double',
  i: 'integer',
  N: 'null',
  o: 'deprecated way to encode objects',
  O: 'object + class',
  r: 'reference',
  R: 'pointer reference',
  s: 'string'
}
let Assert = require('assert')
let Regex = {
  i: /i:(.*?);/
}
class Serialize{
  static serialize(){

  }
  static unserialize(Item){
    Assert.equal(typeof Item, 'string', "Serialize.unserialize expects parameter one to be string")
    return Serialize.__unserializeItem(Item)
  }
  static __unserializeItem(Item){
    let Type = Item.substr(0, 1)
    let Value
    if(Type === 'i'){
      Value = Regex.i.exec(Item)
      Assert(Value, "Syntax Error")
      return parseInt(Value[1])
    }
    return Type
  }
}
console.log(Serialize.unserialize('i:2;'))