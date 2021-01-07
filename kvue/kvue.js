function defineReactive(obj, key, val) {
  
  // 递归的处理 val,这样就可以处理值为对象的值
  observe(val)

  // Dep 在这里创建
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get: function () {
      console.log('get', key);
      // 依赖收集
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set: function (v) {
      if (val !== v) {
        console.log('set', key);
        // v 可能是一个对象，也需要递归处理
        observe(v);

        val = v;

        // watchers.forEach(w =>w.update())
        dep.notify()
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
      // 找到数组的原型
      // 覆盖那些能够修改数组的更新方法，使其可以通知更新
      // 将得到的新的原型设置到数组实例原型上
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

function proxy(vm, vmKey) {
  // TODO 真正使用的时候这里可能需要做一些边界判断
  // 比如说这个 key 是不是已经占用了什么的 
  Object.keys(vm['$' + vmKey]).forEach(key => {
    Object.defineProperty(vm, key, {
      get: function () {
        return vm['$' + vmKey][key]
      },
      set: function (v) {
        vm['$' + vmKey][key] = v
      }
    })
  })
}

class KVue {
  constructor(options) {
    // 1.保存选项
    this.$options = options
    this.$data = options.data
    this.$methods = options.methods

    // 2.响应式处理
    // Vue 里面有哪些响应式数据: data, props, computed, watch
    // 所有在视图相关的都是响应式数据
    observe(this.$data)

    // 3. 为了让用户方便，代理 $data 到 KVue 实例
    proxy(this, 'data');
    proxy(this, 'methods');

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

  // 更新函数
  update(node, exp, dir, params) {
    // init
    const fn = this[dir + 'Updater'];
    fn && fn(node, this.$vm[exp], params, exp);

    // update: 创建 watcher
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val, params, exp);
    })
  }

  // 编译文本
  compileText(node) {
    this.update(node, RegExp.$1, 'text');
  }

  // 真正的实操方法
  textUpdater(node, val) {
    node.textContent = val
  }

  htmlUpdater = (node, val) => {
    node.innerHTML = val;
  }

  onUpdater = (node, val, params) => {
    node['on' + params] =val.bind(this.$vm);
  }

  bindUpdater = (node, val, params) => {
    node[params] = val;
  }

  modelUpdater = (node, val, _, exp) => {
    this.bindUpdater(node, val, 'value')
    this.onUpdater(node, function (e) {
      this[exp] = e.target.value;
    }, 'input');
  }

  // 处理元素所有的动态属性
  compileElement(node) {
    // node.attributes 是一个类数组
    Array.from(node.attributes).forEach(attr => {
      const attrName = attr.name;
      const exp = attr.value

      // 判断是否是一个指令
      if (this.isDir(attrName)) {
        // 执行指令处理函数
        // k-text 关心的是 text
        const [, dir, , params] = attrName.match(/^k-(\w+)(:(\w+))?$/)
        // const dir = attrName.substring(2)
        // 处理指令后面的参数
        
        this[dir] && this[dir](node, exp, params)
      }
    })
  }

  // k-text 处理函数
  text(node, exp) {
    this.update(node, exp, 'text')
  }

  html(node, exp) {
    this.update(node, exp, 'html')
  }

  on(node, exp, params) {
    this.update(node, exp, 'on', params)
  }

  bind(node, exp, params) {
    this.update(node, exp, 'bind', params);
  }

  model(node, exp) {
    this.update(node, exp, 'model')
  }
}

// 为了简化
// const watchers = [];

// 小秘书
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn

    // watchers.push(this)
    // 读取一下 key 的值，触发其 get 从而收集依赖
    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }

  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// 依赖，和响应式对象的每个 key 一一对应
class Dep {
  constructor() {
    this.deps = []
  }

  // 订阅的过程
  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update());
  }
}