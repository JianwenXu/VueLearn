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
  
  // 每出现一个对象，创建一个 Observer 实例
  new Observer(obj)
}

class Observer {
  constructor(obj) {
    // 只是保存一下，目前这一行代码没有什么实际的价值
    this.value = obj;

    // 判断对象类型
    if (Array.isArray(obj)) {
      // TODO
    } else {
      this.walk(obj)
    }
  }

  // 对象响应式
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function proxy(vm) {
  // TODO 真正使用的时候这里可能需要做一些边界判断
  // 比如说这个 key 是不是已经占用了什么的 
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get: function () {
        return vm.$data[key]
      },
      set: function (v) {
        vm.$data[key] = v
      }
    })
  })
}

class KVue {
  constructor(options) {
    // 1.保存选项
    this.$options = options
    this.$data = options.data

    // 2.响应式处理
    // Vue 里面有哪些响应式数据: data, props, computed, watch
    // 所有在视图相关的都是响应式数据
    observe(this.$data)

    // 3. 为了让用户方便，代理 $data 到 KVue 实例
    proxy(this)
  }
}