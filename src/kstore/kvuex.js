let Vue;

class Store {
  constructor(options) {
    // 1. 保存选项
    this._mutations = options.mutations || {};
    this._actions = options.actions || {};
    this._getters = options.getters || {};

    const computed = {};
    Object.keys(this._getters).forEach(key => {
      computed[key] = function () {
        return this._getters[key].call(this, this.state)
      }
    });

    // 2. 保存一个响应式的状态
    this._vm = new Vue({
      data() {
        return {
          $$state: options.state
        }
      },
      computed
    });

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

  }
  get state() {
    console.log(this._vm);
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error('please use replaceState to reset state');
  }

  get getters() {
    console.log(222, this._vm.$options.computed)
    return this._vm.$options.computed;
  }

  commit(type, payload) {
    const entry = this._mutations[type];
    if (!entry) {
      console.error('unknown mutation');
    }
    entry(this.state, payload)
  }

  dispatch(type, payload) {
    const entry = this._actions[type];
    if (!entry) {
      console.error('unknown action');
    }
    entry(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;

  // 挂载 $store 让所有的 Vue 实例都可以访问
  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  })
}

export default {
  Store,
  install
};