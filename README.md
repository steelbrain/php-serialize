PHP-Serialize
===========
PHP-Serialize is node library that helpers you encode/decoded data in PHP's Serialization format.

It also supports `Serializable ` objects decode. Here's how you can use them.

```js
const Serialize = require('php-serialize')
class User {
  constructor({ name, age }){
    this.name = name
    this.age = age
  }
  serialize(){
    return JSON.stringify({ name: this.name, age: this.age })
  }
  unserialize(rawData){
    const { name, age } = JSON.parse(rawData)
    this.name = name
    this.age = age
  }
}
const steel = new User({ name: "Steel Brain", age: 17 })
const Serialized = Serialize.serialize(steel)
const Unserialized = Serialize.unserialize(Serialized, {User: User}) // Passing available classes
console.log(Unserialized instanceof User) // true
```

#### API
```js
class Serializable {
  serialize(item: any): string
  unserialize(item: string, scope: Object = {}, options: { strict: boolean } = { strict: false }): any
}
```

#### License
This project is licensed under the terms of MIT License. See the License file for more info.
