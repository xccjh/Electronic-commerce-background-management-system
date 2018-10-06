import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 使用vuex数据是存储在state中，意味着所有你的想操作的数据都存储在这个对象中
const state = {
  // 我们有一个业务需求：在登陆成功之后，在Home组件中能够获取到之前的用户名
  username: ''
}

// mutations里面定义着操作State中数据的函数，通过这个函数我们可以自由的操作数据
// 既然是操作数据，必然有操作数据的函数
const mutations = {
  // 这里面有每一个函数都有一个默认值state.这个state就是store中定义的State对象
  // 同时你还可以传递其它的参数，但是State是第一个参数
  // 下面这个方法是用来设置用户名--将用户名存储到state中的变量
  setusername: (state, value) => {
    // 将用户名存储到state中的变量
    state.username = value
    localStorage.setItem('username', value)
  }
  // getUserName: (state) => {
  //   return state.username
  // }
}

// actions里面存储着触发mutations里面的函数的行为(函数)
const actions = {
  // 触发器：一个函数的调用会在内部调用其它的函数
  setusernameAction: ({commit}, value) => {
    commit('setusername', value)
  }
}
// 属性封装
// 可以来获取State中的数据
const getters = {
  username: (state) => {
    return localStorage.getItem('username')
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
