// eslint-disable-next-line camelcase,@typescript-eslint/class-name-casing
export class __PHP_Incomplete_Class {
  __PHP_Incomplete_Class_Name: string

  constructor(name: string) {
    this.__PHP_Incomplete_Class_Name = name
  }
}

export function getByteLength(contents: string, options: { encoding: BufferEncoding }): number {
  if (typeof Buffer !== 'undefined') {
    return Buffer.byteLength(contents, options.encoding)
  }
  return encodeURIComponent(contents).replace(/%[A-F\d]{2}/g, 'U').length
}

// isInteger = is NOT a float but still a number
export function isInteger(value: any): boolean {
  return typeof value === 'number' && parseInt(value.toString(), 10) === value
}

export function getIncompleteClass(name: string) {
  return new __PHP_Incomplete_Class(name)
}

export function getClass(prototype: Record<string, any>) {
  function PhpClass() {
    // No Op
  }
  PhpClass.prototype = prototype
  return PhpClass
}
