// vue2 和 vue1 里面是用 Object.defineProperty() 实现数据响应式

// 将传入的obj,动态的设置一个 key ，它的值是 val

// 这是一个闭包
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get: function () {
      console.log('get', key);
      return val;
    },
    set: function (v) {
      if (val !== v) {
        console.log('set', key);
        val = v;
      }
    }
  })
}

const obj = {};
defineReactive(obj, 'foo', 'foo');
obj.foo
obj.foo = '1111';
console.log(obj.foo);