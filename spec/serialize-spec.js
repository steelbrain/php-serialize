'use babel'

import Path from 'path'
import { exec } from 'sb-exec'

describe('serialize', function() {
  const phpFilePath = Path.join(__dirname, 'serialize.php')

  it('is compatible with php', function() {
    waitsForPromise(function() {
      return exec('php', [phpFilePath]).then(function(output) {
        // NOTE: Patch PHP floating point madness
        output = output.replace('1.1000000000000001', '1.1')
        expect(output).toBe(require('./serialize')())
      })
    })
  })
})
