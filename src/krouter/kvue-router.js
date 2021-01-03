// 自己的路由器
// 1、VueRouter 类，是一个插件

// 用一个变量保存，好处就是打包的时候不会把Vue 打包进来
// Vue 只是作为 install 方法的一个形参传入进来的
let Vue;

class VueRouter {
  constructor(options) {
    this.$options = options;

    // 声明一个 **响应式**  current 代表当前 url 的地址，会影响 router-view 里面渲染的是什么内容
    // 渲染函数如果要重复执行，那么依赖的值必须是响应式的
    Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/');
    // this.current = window.location.hash.slice(1) || '/'

    // 监听 url 的变化
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
}

// 插件就要实现 install 方法
VueRouter.install = function (_Vue) {
  
  // 保存 Vue 构造函数的引用，因为将来 VueRouter 里面要使用它
  Vue = _Vue;

  // 输出一下 看看这个this到底是个什么东东
  // this 指的是组件实例
  console.log(this);

  // 挂载 $router 到 Vue 的原型
  // 问题1 install 执行的时候还拿不到 VueRouter 的实例
  // 解决办法：利用全局混入，延迟执行下面的代码，延迟到组件构建之后执行，这样就可以获取 router 实例
  Vue.mixin({
    // ??为啥要用 beforeCreate
    beforeCreate() {
      // this 指的是组件实例
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    }
  })

  // 3. 声明两个全局组件 router-view 和 router-link
  // <router-link to="/abc">xxx</router-link>
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required:true
      },
    },
    // vue-cli webpack 预编译的情况下 template 是不能使用的?
    // 当前执行环境是一个基于 webpack 的，默认情况下 webpack 模块打包的 vue 的版本是 runtime 版本，他是不会携带编译器的
    // 所有的.vue 文件是利用 vue-loader 的方式去预编译预加载，所以它不需要编译器，所以它只有运行时
    // 因为在 webpack 的环境下，所以可以写 JSX, 但是不推荐，因为要求当前的环境必须得支持 JSX
    render(h) {
      // <a href="#/abc">xxx</a>
      // this 指向当前的组件实例
      return h('a', {attrs: {href:'#' +this.to}}, this.$slots.default);
    }
    
  });
  Vue.component('router-view', {
    render(h) {
      // 如果想让渲染函数重新执行，那么内部依赖的数据必须是响应式的
      const current = this.$router.current
      // 根据 current 获取路由表中对应的组件并渲染它
      let component = null
      const route = this.$router.$options.routes.find(route => route.path === current)
      if (route) {
        component = route.component;
      }
      return h(component)
    }
  });
}

export default VueRouter;