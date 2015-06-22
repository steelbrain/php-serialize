"use strict"
let Chart = {
  a: 'array',
  b: 'boolean',                               // Done
  C: 'object-serializable',
  d: 'double',
  i: 'integer',                               // Done
  N: 'null',
  o: 'deprecated way to encode objects',
  O: 'object + class',
  r: 'reference',
  R: 'pointer reference',
  s: 'string'                                 // Done
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
    let Length
    let Value
    if(Type === 'i'){
      Value = Regex.i.exec(Item)
      Assert(Value, "Syntax Error")
      return {
        Index: Value.index + Value[0].length - 1, // Length is 1-based
        Value: parseInt(Value[1])
      }
    } else if(Type === 's'){
      Length = parseInt(Item.substr(2, 1))
      Assert(Length === Length, "Syntax Error") // NaN !== NaN
      Item = Item.substr(4, Length + 2)
      return {
        Index: Length + Length.toString().length + 5,
        Value: Item.substr(1, Item.length - 2).replace(/\\"/g, '"') // 2 quotes
      }
    } else if(Type === 'b'){
      return {
        Value: Boolean(Item.substr(2, 1)),
        Index: 3
      }
    }
    return Type
  }
}

