import test from 'ava'
import { isSerialized } from '..'

test('test whether the content is legitimate serialized content', function(t) {
  t.is(isSerialized('a:1:{i:0;s:12:"add-post_tag";}'), true)
  t.is(isSerialized('d:100010001000100004049513873408;'), true)
  t.is(isSerialized('i:100000000;'), true)
  t.is(isSerialized('d:1.7976931348623157E+308;'), false)
})
