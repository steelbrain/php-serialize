"use strict"
let Assert = require('assert')
let Regex = {
  i: /i:(.*?);/,
  d: /d:(.*?);/,
  O: /O:\d+:".*?":(\d+):\{(.*)\}/,
  a: /a:(\d+):\{(.*)\}/,
  C: /C:\d+:"(.*?)":1:{(.*?)}/
}
class Serialize{
  static serialize(Item){
    if(Item === null){
      return 'N;'
    } else if(typeof Item === 'number'){
      if(Item % 1 === 0) return `i:${Item};`
      else return `d:${Item};`
    } else if(typeof Item === 'string'){
      return `s:${Item.length}:"${Item}";`
    } else if(typeof Item === 'boolean'){
      return `b:${Item ? '1' : '0'};`
    } else if(typeof Item === 'object'){
      let ToReturn
      if(Item instanceof Array){
        ToReturn = [`a:${Item.length}:{`]
        Item.forEach(function(Value, Key){
          ToReturn.push(Serialize.serialize(Key))
          ToReturn.push(Serialize.serialize(Value))
        })
        ToReturn.push('}')
        return ToReturn.join('')
      } else if(typeof Item.serialize === 'function'){
        let Serialized = Item.serialize()
        return `C:${Item.constructor.name.length}:"${Item.constructor.name}":${Serialized.length}:{${Serialized}}`
      } else {
        ToReturn = []
        for(let Key in Item){
          if(Item.hasOwnProperty(Key)){
            ToReturn.push(Serialize.serialize(Key))
            ToReturn.push(Serialize.serialize(Item[Key]))
          }
        }
        return `O:${Item.constructor.name.length}:"${Item.constructor.name}":${ToReturn.length / 2}:{${ToReturn.join('')}}`
      }
    }
    throw new TypeError
  }
  static unserialize(Item, Scope){
    if(typeof Scope !== 'object') Scope = {}
    Assert.equal(typeof Item, 'string', "Serialize.unserialize expects parameter one to be string")
    return Serialize.__unserializeItem(Item, Scope).Value
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
      let RegexVal = Regex.O.exec(Item)
      Assert(RegexVal, "Syntax Error")
      Length = parseInt(RegexVal[1]) * 2
      Value = RegexVal[2]
      return {
        Value: Serialize.__unserializeObject(Length, Value, {}, Scope),
        Index: RegexVal.index + RegexVal[0].length
      }
    } else if(Type === 'a'){
      let RegexVal = Regex.a.exec(Item)
      Assert(RegexVal, "Syntax Error")
      Length = parseInt(RegexVal[1]) * 2
      Value = RegexVal[2]
      return {
        Value: Serialize.__unserializeObject(Length, Value, [], Scope),
        Index: RegexVal.index + RegexVal[0].length
      }
    } else if(Type === 'C'){
      Value = Regex.C.exec(Item)
      Assert(Value, "Syntax Error")
      Assert.notEqual(typeof Scope[Value[1]], 'undefined', `Can't find \`${Value[1]}\` in given scope`)
      Assert.equal(typeof Scope[Value[1]].unserialize, 'function', `Can't find unserialize function on \`${Value[1]}\``)
      let Container = {}
      Scope[Value[1]].unserialize.call(Container, Value[2])
      return {
        Index: Value.index + Value[0].length,
        Value: Container
      }
    }
    throw new SyntaxError
  }
  static __unserializeObject(Length, Value, Container, Scope){
    let Temp = {}
    for(let I = 0; I < Length; ++I){
      let Entry = Serialize.__unserializeItem(Value, Scope)
      if(typeof Temp.Key !== 'undefined'){
        Temp.Value = Entry.Value
        Container[Temp.Key] = Temp.Value
        Temp = {}
      } else Temp.Key = Entry.Value
      Value = Value.substr(Entry.Index)
    }
    return Container
  }
}

module.exports = Serialize