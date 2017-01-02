/* @flow */

/* eslint-disable camelcase */

class __PHP_Incomplete_Class {
  __PHP_Incomplete_Class_Name: string;

  constructor(name: string) {
    this.__PHP_Incomplete_Class_Name = name
  }
}

export function getClass(prototype: Object) {
  function Container() { }
  Container.prototype = prototype
  return Container
}

export function getIncompleteClass(name: string) {
  return new __PHP_Incomplete_Class(name)
}

export function getByteLength(contents: string): number {
  if (typeof Buffer !== 'undefined') {
    return Buffer.byteLength(contents, 'utf8')
  }
  return encodeURIComponent(contents).replace(/%[A-F\d]{2}/g, 'U').length
}
