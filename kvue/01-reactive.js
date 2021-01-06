// vue2 和 vue1 里面是用 Object.defineProperty() 实现数据响应式

// 将传入的obj,动态的设置一个 key ，它的值是 val

// 这是一个闭包
function defineReactive(obj, key, val) {
  
  // 递归的处理 val,这样就可以处理值为对象的值
  observe(val)

  Object.defineProperty(obj, key, {
    get: function () {
      console.log('get', key);
      return val;
    },
    set: function (v) {
      if (val !== v) {
        console.log('set', key);
        // v 可能是一个对象，也需要递归处理
        observe(v);

        val = v;
      }
    }
  })
}

// 递归的遍历 obj，动态的拦截 obj 的所有的key
function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1
  }
};
// 这样写不友好，用 observe 方法遍历一下，提供更好的API
// defineReactive(obj, 'foo', 'foo');

observe(obj);

obj.foo
obj.foo = '1111';
// obj.baz.a
// obj.baz.a = 123

// 处理嵌套
obj.baz = { a: 1 }
obj.baz.a

// 动态追加新属性
set(obj, 'dong', 'dong')

obj.dong = 'dong1'
obj.dong