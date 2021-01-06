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

    // 4. 编译
    new Compile(options.el, this)
  }
}

class Compile {
  // el 是宿主
  // vm 是 KVue 实例
  constructor(el, vm) {
    // 1. 保存一下
    this.$vm = vm;
    this.$el = document.querySelector(el);

    // 遍历
    this.compile(this.$el)
  }

  compile(el) {
    // 遍历 el DOM 树
    el.childNodes.forEach(node => {
      if (this.isElement(node)) {
        // element
        // 需要处理属性和子节点
        // console.log('编译元素', node.nodeName);
        this.compileElement(node);

        // 递归处理子节点
        if (node.childNodes && node.childNodes.length > 0) {
          this.compile(node);
        }
      } else if (this.isInter(node)) {
        // 编译插值表达式
        // console.log('编译插值表达式', node.textContent);
        // 获取表达式的值并赋值给 node
        this.compileText(node);
      }
    })

  }

  isElement(node) {
    return node.nodeType === 1;
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  isDir(attr) {
    return attr.startsWith('k-')
  }

  // 编译文本
  compileText(node) {
    node.textContent = this.$vm[RegExp.$1]
  }

  // 处理元素所有的动态属性
  compileElement(node) {
    // node.attributes 是一个类数组
    Array.from(node.attributes).forEach(attr => {
      // console.log(attr.name, attr.value);
      const attrName = attr.name;
      const exp = attr.value

      // 判断是否是一个指令
      if (this.isDir(attrName)) {
        // 执行指令处理函数
        // k-text 关心的是 text
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
    })
  }

  // k-text 处理函数
  text(node, exp) {
    node.textContent = this.$vm[exp]
  }

  html(node, exp) {
    node.innerHTML = this.$vm[exp];
  }
}