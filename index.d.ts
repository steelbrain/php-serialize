export = Serializable

declare namespace Serializable {
  interface SerializeOption {
    encoding?: 'utf8' | 'binary'
  }
  export function serialize(item: any, scope?: Record<string, any>, options?: SerializeOption): string

  interface UnserializeOption extends SerializeOption {
    strict?: boolean
  }

  export function unserialize(item: string | Buffer, scope?: Record<string, any>, options?: UnserializeOption): any

  /**
   * Check value to find if it was serialized.
   * @param { string } item - Value to check to see if was serialized.
   * @param { boolean } strict - Whether to be strict about the end of the string. Default value: false
   * @returns { boolean }
   */
  export function isSerialized(item: string, strict?: boolean): boolean
}
