// eslint-disable-next-line import/no-cycle
import type { Options } from './unserialize'

export type ParserType =
  | 'null'
  | 'int'
  | 'float'
  | 'boolean'
  | 'string'
  | 'array-object'
  | 'serializable-class'
  | 'notserializable-class'
  | 'recursion'

const PARSER_TYPES: Record<string, ParserType> = {
  N: 'null',
  i: 'int',
  d: 'float',
  b: 'boolean',
  s: 'string',
  a: 'array-object',
  C: 'serializable-class',
  O: 'notserializable-class',
  r: 'recursion',
  R: 'recursion'
}

export default class Parser {
  index: number
  contents: Buffer
  options: Options
  constructor(contents: Buffer, index: number, options: Options) {
    this.contents = contents
    this.index = index
    this.options = options
  }
  error(message = 'Syntax Error') {
    return new Error(`${message} at index ${this.index} while unserializing payload`)
  }
  advance(index: number) {
    this.index += index
  }
  readAhead(index: number) {
    const contents = this.peekAhead(index)
    this.index += index
    return contents
  }
  readUntil(expected: string) {
    const index = this.contents.indexOf(expected, this.index)
    if (index === -1) {
      throw this.error(`Expected '${expected}'`)
    }
    return this.readAhead(index - this.index)
  }
  peekAhead(index: number): string {
    return this.contents.toString(this.options.encoding, this.index, this.index + index)
  }
  seekExpected(contents: string) {
    const slice = this.readAhead(contents.length)
    if (slice !== contents) {
      this.index -= contents.length
      throw this.error(`Expected '${contents}'`)
    }
  }
  getType(): ParserType {
    const [type, ps] = this.readAhead(2)
    const parserType = PARSER_TYPES[type]

    if (!parserType) {
      throw this.error('Unknown type')
    }
    if (parserType === 'null' ? ps !== ';' : ps !== ':') {
      throw this.error()
    }
    return parserType
  }
  getLength(): number {
    const length = Number.parseInt(this.readUntil(':'), 10)
    if (Number.isNaN(length)) {
      throw this.error()
    }
    return length
  }
  getByLength<T>(startSequence: string, endSequence: string, callback: (length: number) => T): T {
    const length = this.getLength()
    this.seekExpected(`:${startSequence}`)
    const result = callback(length)
    this.seekExpected(endSequence)

    return result
  }
}
