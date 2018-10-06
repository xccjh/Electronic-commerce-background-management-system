import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import User from '@/views/user/User.vue'
import Right from '@/views/rights/Right.vue'
import Role from '@/views/rights/Role.vue'
import Goods from '@/views/goods/Goods.vue'
import Categories from '@/views/goods/Categories.vue'
import Params from '@/views/goods/Params.vue'
import Add from '@/views/goods/GoodsAdd.vue'
import List from '@/views/goods/GoodsList.vue'
import Reports from '@/views/report/Reports.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      redirect: {'name': 'Login'}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: {'name': 'Welcome'},
      // 添加嵌套路由
      children: [
        {
          path: 'welcome',
          name: 'Welcome',
          component: Welcome
        },
        {
          path: 'users',
          name: 'User',
          component: User
        },
        {
          path: 'rights',
          name: 'Right',
          component: Right
        },
        {
          path: 'roles',
          name: 'Role',
          component: Role
        },
        {
          path: 'goods',
          name: 'Goods',
          component: Goods,
          redirect: {name: 'List'},
          children: [
            {
              path: 'add',
              name: 'Add',
              component: Add
            },
            {
              path: 'list',
              name: 'List',
              component: List
            }
          ]
        },
        {
          path: 'params',
          name: 'Params',
          component: Params
        },
        {
          path: 'categories',
          name: 'Categories',
          component: Categories
        },
        {
          path: 'reports',
          name: 'Reports',
          component: Reports
        }
      ]
    }
  ]
})
