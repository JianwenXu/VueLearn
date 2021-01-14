// 实现KVue构造函数
function defineReactive(obj, key, val) {
  // 如果val是对象，需要递归处理之
  observe(val)
  // 管家创建
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key);
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(newVal) {
      if (val !== newVal) {
        // 如果newVal是对象，也要做响应式处理
        observe(newVal)
        val = newVal
        console.log('set', key, newVal);
        // 通知更新
        dep.notify()
      }
    }
  })
}
// 遍历指定数据对象每个key，拦截他们
function observe(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  // 每遇到⼀个对象，就创建⼀个Observer实例
  // 创建⼀个Observer实例去做拦截操作
  new Observer(obj)
}
// proxy代理函数：让⽤户可以直接访问data中的key
function proxy(vm, key) {
  Object.keys(vm[key]).forEach(k => {
    Object.defineProperty(vm, k, {
      get() {
        return vm[key][k]
      },
      set(v) {
        vm[key][k] = v
      }
    })
  })
}
// 根据传⼊value类型做不同操作
class Observer {
  constructor(value) {
    this.value = value
    // 判断⼀下value类型
    // 遍历对象
    this.walk(value)
  }
  walk(obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}
class KVue {
  constructor(options) {
    // 0.保存options
    this.$options = options
    this.$data = options.data
    // 1.将data做响应式处理
    observe(this.$data)
    // 2.为$data做代理
    proxy(this, '$data')
    // 3.编译模板
    // new Compile('#app', this)
    // $mount(options.el);
    if (options.el) {
      this.$mount(options.el)
    }
  }

  // 转换 vnode 为 dom
  $mount(el) {
    // 1.获取宿主
    this.$el = document.querySelector(el)

    // 2. updateComponent
    const updateComponent = () => {
      const { render } = this.$options;/*  */
      // 改成虚拟 dom 后重写这部分实现
      // 下面注释掉的这 5 行是真实 dom 实现
      // const el = render.call(this)
      // const parent = this.$el.parentElement
      // parent.insertBefore(el, this.$el.nextSibling)
      // parent.removeChild(this.$el)
      // this.$el = el

      // vnode
      // render(h) this.$createElement 就是 h 函数
      const vnode = render.call(this, this.$createElement)
      // 把 vnode 转化真实节点
      this._update(vnode)
    };

    // 3. Watcher 实例创建 ---- 当前的 vue 实例一个 watcher 就够了
    new Watcher(this, updateComponent)

  }

  // $createElement 返回 vnode
  $createElement(tag, props, children) {
    return {
      tag,
      props,
      children
    };
  }

  _update(vnode) {
    // 处理初始化和更新
    // 假设老节点在 this._vnode 这里放着
    const prevNode = this._vnode;
    if (!prevNode) {
      // init
      this.__patch__(this.$el, vnode)
    } else {
      // update 在这里面 patch
      this.__patch__(prevNode, vnode)
    }
  }

  __patch__(oldVnode, vnode) {
    // init
    if (oldVnode.nodeType) {
      const parent = oldVnode.parentElement;
      const refElm = oldVnode.nextSibling
      // 递归创建 dom 树
      const el = this.createElm(vnode)

      // 插入到参考元素前面
      parent.insertBefore(el, refElm)
      parent.removeChild(oldVnode);

      // 保存 vnode 后面有用
      this._vnode = vnode
    } else {
      // update
      // 这是我们操作的目标
      const el = vnode.el = oldVnode.el

      // diff
      // props 更新
      // children更新
      const oldCh = oldVnode.children;
      const ch = vnode.children;
      // 简版：不做首尾判断，每个都更新，强制更新
      if (typeof ch === 'string') {
        if (typeof oldCh === 'string') {
          // 文本更新
          if (ch !== oldCh) {
            el.textContent = ch;
          }
        } else {
          // 以前没有文本，以前可能有孩子
          el.textContent = ch
        }
      } else {
        // 子元素有 children 的情况
        if (typeof oldCh === 'string') {
          // 清空，批量创建
          el.innerHTML = '';
          ch.forEach(v => {
            const child = this.createElm(v)
            el.appendChild(child)
          })
        } else {
          // 更新子元素
          this.updateChildren(el, oldCh, ch)
        }
      }
    }
  }

  updateChildren(parentElm, oldCh, ch) {
    // 对应位置直接更新
    // 然后扫尾, 老的长： 批量删除，新的长，批量创建
    const len = Math.min(oldCh.length, ch.length)

    for(let i = 0; i < len; i++) {
      this.__patch__(oldCh[i], ch[i])
    }

    // 扫尾
    if (ch.length > oldCh.length) {
      ch.slice(len).forEach(v => {
        const child = this.createElm(v)
        parentElm.appendChild(child)
      })
    } else if(ch.length < oldCh.length) {
      oldCh.slice(len).forEach((v) => {
        parentElm.removeChild(v.el)
      })
    }

  }

  // 本次只处理保留标签不处理自定义组件
  createElm(vnode) {
    const el = document.createElement(vnode.tag)
    // props
    // children
    if (vnode.children) {
      if (typeof vnode.children === 'string') {
        el.textContent = vnode.children
      } else {
        // 有多个子元素
        vnode.children.forEach(vnode => {
          const child = this.createElm(vnode)
          el.appendChild(child)
        })
      }
    }

    // 真实节点要保存在虚拟节点上，更新的时候用到
    vnode.el = el;
    return el;
  }
}
// 移除
// class Compile {}
class Watcher {
  constructor(vm, updaterFn) {
    this.vm = vm

    this.getter = updaterFn

    // 首次调用
    this.get()
  }

  get() {
    // 依赖收集触发
    Dep.target = this
    // 为啥这样做依赖收集，这样不就执行了吗
    // updateComponet => render => data[key]
    this.getter.call(this.vm);
    Dep.target = null
  }

  update() {
    this.get()
  }

}
// 管家：和某个key，⼀⼀对应，管理多个秘书，数据更新时通知他们做更新⼯作
class Dep {
  constructor() {
    // 改成 set 保证 watcher 不重
    this.deps = new Set()
  }

  addDep(watcher) {
    this.deps.add(watcher)
  }
  notify() {
    // set 也有 forEach 方法
    this.deps.forEach(watcher => watcher.update())
  }
}