// @flow

export type ParserType =
  | 'null'
  | 'number'
  | 'boolean'
  | 'string'
  | 'array-object'
  | 'serializable-class'
  | 'unserializable-class'

const PARSER_TYPES: { [string]: ParserType } = {
  N: 'null',
  i: 'number',
  d: 'number',
  b: 'boolean',
  s: 'string',
  a: 'array-object',
  C: 'serializable-class',
  O: 'unserializable-class',
}

export default class Parser {
  index: number
  contents: Buffer
  constructor(contents: Buffer, index: number) {
    this.contents = contents
    this.index = index
  }
  error(message: string = 'Syntax Error') {
    return new Error(`Encountered ${message} at index ${this.index} while unserializing payload`)
  }
  readAhead(index: number) {
    const contents = this.peakAhead(index)
    this.index += index
    return contents
  }
  peakAhead(index: number): string {
    return this.contents.toString('utf8', this.index, this.index + index)
  }
  seekExpected(contents: string) {
    const slice = this.peakAhead(contents.length)
    if (slice !== contents) {
      throw this.error()
    }
  }
  getType(): ParserType {
    const [type, ps] = this.readAhead(2)
    const parserType = PARSER_TYPES[type]

    if (!parserType) {
      throw this.error()
    }
    if (parserType === 'null' ? ps !== ';' : ps !== ':') {
      throw this.error()
    }
    return (type: any)
  }
}
