# PHP-Serialize

It also supports `Serializable` objects decode. Here's how you can use them.

```js
const Serialize = require('php-serialize')
class User {
  constructor({ name, age }) {
    this.name = name
    this.age = age
  }
  serialize() {
    return JSON.stringify({ name: this.name, age: this.age })
  }
  unserialize(rawData) {
    const { name, age } = JSON.parse(rawData)
    this.name = name
    this.age = age
  }
}
const steel = new User({ name: 'Steel Brain', age: 17 })
const serialized = Serialize.serialize(steel)
const unserialized = Serialize.unserialize(serialized, { User: User }) // Passing available classes
console.log(unserialized instanceof User) // true

const serializedForNamespace = Serialize.serialize(steel, {
  'MyApp\\User': User,
})
// ^ Above code will serialize User class to given name
```

#### API

```js
class Serializable {
  serialize(
    item: any,
    phpToJsScope: Object = {},
    options: { encoding: 'utf8' | 'binary' } = { encoding: 'utf8' }
  ): string
  unserialize(
    item: string,
    scope: Object = {},
    options: { strict: boolean, encoding: 'utf8' | 'binary' } = { strict: false, encoding: 'utf8' }
  ): any
  isSerialized(
    item: any,
    strict: false
  ): boolean
}
```

#### License

This project is licensed under the terms of MIT License. See the License file for more info.
