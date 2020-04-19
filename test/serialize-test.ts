import test from 'ava'
import path from 'path'
import fs from 'fs'

import serializeForTests from './serialize'

test('serialize compat with php', async function(t) {
  const givenOutput: string = await new Promise(function(resolve, reject) {
    fs.readFile(path.join(__dirname, 'serialize.php.out'), 'utf8', function(error, result) {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
  // NOTE: Patch PHP floating point madness
  const output = givenOutput
    .replace('1.1000000000000001', '1.1')
    .trim()
    .split('\n')
  const ourOutput = serializeForTests()
  for (let i = 0, { length } = output; i < length; i += 1) {
    t.is(output[i], ourOutput[i])
  }
})
