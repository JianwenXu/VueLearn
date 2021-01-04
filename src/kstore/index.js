/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    // 问题1： state 从哪里来的
    add(state) {
      state.count++;
    }
  },
  actions: {
    // 上下文是什么，从哪里来的
    add({ commit }) {
      setTimeout(() => {
        commit('add')
      }, 1000);
    }
  },
  getters: {
    doubleCount: function(state) {
      return state.count * 2;
    },
    specialCount: (state, getters) => {
      return getters.doubleCount - 1;
    }
  },
  modules: {
  }
})
