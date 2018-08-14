// @flow

/* eslint-disable camelcase,import/prefer-default-export */

export function getByteLength(contents: string): number {
  if (typeof Buffer !== 'undefined') {
    return Buffer.byteLength(contents, 'utf8')
  }
  return encodeURIComponent(contents).replace(/%[A-F\d]{2}/g, 'U').length
}
