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
class TestParent implements Serializable {
  function serialize() {
    return serialize(array(
      new Test(),
      new TestTwo()
    ));
  }
  function unserialize($item) {}
}

debug(null);
debug(1);
debug(1.1);
debug(array(1, 2, 3, 4, 5));
debug(array('hey' => 'hi'));
debug(new Test());
debug(new TestTwo());
debug(new TestParent());
