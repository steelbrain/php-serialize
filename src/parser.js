// @flow

export type ParserType =
  | 'null'
  | 'int'
  | 'float'
  | 'boolean'
  | 'string'
  | 'array-object'
  | 'serializable-class'
  | 'notserializable-class'

const PARSER_TYPES: { [string]: ParserType } = {
  N: 'null',
  i: 'int',
  d: 'float',
  b: 'boolean',
  s: 'string',
  a: 'array-object',
  C: 'serializable-class',
  O: 'notserializable-class',
}

export default class Parser {
  index: number
  contents: Buffer
  constructor(contents: Buffer, index: number) {
    this.contents = contents
    this.index = index
  }
  error(message: string = 'Syntax Error') {
    return new Error(`${message} at index ${this.index} while unserializing payload`)
  }
  readAhead(index: number) {
    const contents = this.peakAhead(index)
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
  peakAhead(index: number): string {
    return this.contents.toString('utf8', this.index, this.index + index)
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
    const length = parseInt(this.readUntil(':'), 10)
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
