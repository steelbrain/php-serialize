PHP-Serialize
===========
PHP-Serialize is tiny library that helpers you encode/decoded data in PHP's Serialization format.

It also supports `Serializable ` objects decode. Here's how you can use them. (Note: This example uses ES6)
```js
let Serialize = require('./Main')
class User{
  constructor(Info){
    this.Name = Info.Name
    this.Age = Info.Age
  }
  serialize(){
    return JSON.stringify({Name: this.Name, Age: this.Age})
  }
  unserialize(Data){
    Data = JSON.parse(Data)
    this.Name = Data.Name
    this.Age = Data.Age
  }
}
let Steel = new User({Name: "Steel Brain", Age: 16})
let Serialized = Serialize.serialize(Steel)
let Unserialized = Serialize.unserialize(Serialized, {User: User}) // Passing available classes
console.log(Unserialized instanceof User) // true
```

#### API
```js
class Serializable{
  serialize(Item): string
  unserialize(Item, Scope = {})
}
```

#### License
This project is licensed under the terms of MIT License. See the License file for more info.