// vue2 和 vue1 里面是用 Object.defineProperty() 实现数据响应式

// 将传入的obj,动态的设置一个 key ，它的值是 val

// 数组响应式
// 1.替换数组原型中的的7个方法
const originProto = Array.prototype;
// 备份一下，修改备份
const arrayProto = Object.create(originProto);
// ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']
['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].forEach(method => {
  arrayProto[method] = function() {
    // 原始操作
    originProto[method].apply(this, arguments)
    // 覆盖操作: 通知更新
    console.log('数组执行', method, '操作:');
  }
})

// 对象响应式
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

  // 判断传入的obj 类型
  if (Array.isArray(obj)) {
    // 覆盖原型，替换7个变更操作
    obj.__proto__ = arrayProto;
    // 对数组内部的元素执行响应化
    const keys = Object.keys(obj)
    for(let i = 0; i < obj.length; i++) {
      observe(obj[i])
    }
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function set(obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1
  },
  arr: [1, 2, 3]
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

obj.arr.push(4)