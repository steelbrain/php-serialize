"use strict"
let Chart = {
  a: 'array',
  b: 'boolean',                               // Done
  C: 'object-serializable',
  d: 'double',                                // Done
  i: 'integer',                               // Done
  N: 'null',                                  // Done
  o: 'deprecated way to encode objects',
  O: 'object + class',                        // Done
  r: 'reference',
  R: 'pointer reference',
  s: 'string'                                 // Done
}
let Assert = require('assert')
let Regex = {
  i: /i:(.*?);/,
  d: /d:(.*?);/,
  O: /O:\d+:".*?":(\d+):\{(.*)\}/
}
class Serialize{
  static serialize(){

  }
  static unserialize(Item, Scope){
    if(typeof Scope !== 'object') Scope = {}
    Assert.equal(typeof Item, 'string', "Serialize.unserialize expects parameter one to be string")
    return Serialize.__unserializeItem(Item, Scope)
  }
  // Note: Trailing semi-colons are removed by the indexes
  static __unserializeItem(Item, Scope){
    let Type = Item.substr(0, 1)
    let Length
    let Value
    if(Type === 'i'){
      Value = Regex.i.exec(Item)
      Assert(Value, "Syntax Error")
      return {
        Index: Value.index + Value[0].length,
        Value: parseInt(Value[1])
      }
    } else if(Type === 's'){
      Length = parseInt(Item.substr(2, 1))
      Assert(Length === Length, "Syntax Error") // NaN !== NaN
      Item = Item.substr(4, Length + 2)
      return {
        Index: Length + Length.toString().length + 6,
        Value: Item.substr(1, Item.length - 2).replace(/\\"/g, '"') // 2 quotes
      }
    } else if(Type === 'b'){
      return {
        Value: Boolean(Item.substr(2, 1)),
        Index: 4
      }
    } else if(Type === 'N'){
      return {
        Value: null,
        Index: 2
      }
    } else if(Type === 'd'){
      Value = Regex.d.exec(Item)
      Assert(Value, "Syntax Error")
      return {
        Index: Value.index + Value[0].length,
        Value: parseFloat(Value[1])
      }
    } else if(Type === 'O'){
      let Container = {} // Create  container object
      let RegexVal = Regex.O.exec(Item)
      Assert(RegexVal, "Syntax Error")
      Length = parseInt(RegexVal[1]) * 2
      Value = RegexVal[2]
      Container = Serialize.__unserializeObject(Length, Value, {})
      return {
        Value: Container,
        Index: RegexVal.index + RegexVal[0].length
      }
      // key1,value1,key2,value2
    }
    return Type
  }
  static __unserializeObject(Length, Value, Container){
    let Temp = {Key: "", Value: ""}
    for(let I = 0; I < Length; ++I){
      let Entry = Serialize.__unserializeItem(Value, Scope)
      if(Temp.Key.length){
        Temp.Value = Entry.Value
        Container[Temp.Key] = Temp.Value
        Temp = {Key: "", Value: ""}
      } else Temp.Key = Entry.Value
      Value = Value.substr(Entry.Index)
    }
    return Container
  }
}

