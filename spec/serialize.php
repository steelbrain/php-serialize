<?php
function debug($item) {
  echo serialize($item), "\n";
}
class Test implements Serializable {
  function serialize() {
    return "asd";
  }
  function unserialize($item) {}
}
class TestTwo {

}

debug(null);
debug(1);
debug(1.1);
debug([1, 2, 3, 4, 5]);
debug(['hey' => 'hi']);
debug(new Test());
debug(new TestTwo());
