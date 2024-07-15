import test from 'ava'
import { isSerialized } from '..'

test('test whether the content is legitimate serialized content', t => {
  t.is(isSerialized('a:1:{i:0;s:12:"add-post_tag";}'), true)
  t.is(isSerialized('d:100010001000100004049513873408;'), true)
  t.is(isSerialized('s:3276:"{"a":1}";'), true)
  t.is(isSerialized('i:100000000;'), true)
  t.is(isSerialized('d:1.7976931348623157E+308;'), true)
  t.is(isSerialized('something'), false)
  t.is(isSerialized('你好世界'), false)
  t.is(isSerialized('i:10000a0000;'), false)
  t.is(isSerialized('i:100000000'), false)
})
