'use strict'

export function getClass(prototype: Object) {
  function Container() { }
  Container.prototype = prototype
  return Container
}
