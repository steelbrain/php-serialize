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
