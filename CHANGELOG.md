### 5.1.0

- Add support for `BigInt` (Thanks @at0mat)

### 5.0.1

- Fix a bug in `isSerialized` (Thanks @maxbronnikov10)

### 5.0.0

- Remove dependence on `assert` native module for validation, and use simple error instead (Thanks @eliandoran)

  Because this changes the error class from `AssertionError` to `Error` which might break downstream code,
  this is being tagged as semver-major.

### 4.1.1

- Fix `Map` support for multiple elements (Thanks @trim21)

### 4.1.0

- Add support for JS `Map`s as equivalent for unordered PHP objects (Thanks @trim21)

### 4.0.2

- Workaround an npm publish issue

### 4.0.1

- Emit declarations for typings, instead of using source

### 4.0.0

- Add TS Typings - Thanks [@vace](https://github.com/vace)
- Convert arrays with missing keys to objects in unserialize
- **BREAKING** Export modules in CJS and CommonJS.
- Add support for parsing protected and private fields

## 3.0.1

- Fix handling of shallow arrays (Thanks @neoaggelos)

## 3.0.0

- Require at least Node v8
- Add `isSerialized` method, mirrored from Wordpress source

## 2.1.0

- Add support for `encoding` parameter for serialize/unserialize

## 2.0.1

- Fix validation being too strict for pairs

## 2.0.0

- Simplify internals
- Validate input and Throw syntax errors

## 1.3.1

- Fix serialization support for big numbers

## 1.3.0

- Added support for namespaced serializations

## 1.2.5

- Fixed support for multi-byte strings
- Rewrote most of decode internals to work on Buffers instead of strings (external API still the same)

## 1.2.4

- Move `flow-bin` to dev dependencies from dependencies (sorry guys!)

## 1.2.3

- Fix decoding of empty arrays (Thanks @incadawr)

## 1.2.2

- Fix encoding/decoding of multi-byte utf8 strings

## 1.2.1

- Fix a bug where objects/Array guessing would fail when values were/not numeric.

## 1.2.0

- Add support for `__PHP_Incomplete_Class`

## 1.1.1

- Add support for deep serialization (Thanks @cantremember)

## 1.1.0

- Complete rewrite
- Fixed a lot of bugs/limitations
- Added specs to ensure stability

## 1.0.0

- Initial release
