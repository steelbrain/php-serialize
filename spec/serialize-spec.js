import test from 'ava'
import path from 'path'
import { exec } from 'sb-exec'

const serializeOutput = require('./serialize')

const phpFilePath = path.join(__dirname, 'serialize.php')
test('serialize compat with php', async function(t) {
  const givenOutput = await exec('php', [phpFilePath])
  // NOTE: Patch PHP floating point madness
  const output = givenOutput
    .replace('1.1000000000000001', '1.1')
    .trim()
    .split('\n')
  const ourOutput = serializeOutput()
  for (let i = 0, { length } = output; i < length; ++i) {
    t.is(output[i], ourOutput[i])
  }
})
