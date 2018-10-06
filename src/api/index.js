// 验证用户登陆
import axios from 'axios'
const baseURL = 'http://localhost:8888/api/private/v1/'
// 什么是基准url:我们的请求就是路由名称，但是这个路由要基于服务器，设置基准路径的目的就是能够先找到对应的服务器，再匹配它里面设置的路由
axios.defaults.baseURL = baseURL

// 添加拦截器--不是我们来调用的，而是axios自动调用
axios.interceptors.request.use(function (config) {
  // 在请求发送之前你想做的事情
  // 我们要将token这个值通过请求头的方式传递给服务器
  // 1.获取token
  var token = localStorage.getItem('mytoken')
  if (token) {
    // 2.将值传递到服务器
    // console.log(config):Authorization是后台接口与前台调用约定好的值，不能随意修改
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 实现用户登陆验证
export const login = (params) => {
  return axios.post('login', params)
    .then((result) => {
      return result.data
    })
}

// 获取用户列表
export const getUserList = (pa) => {
  return axios.get('users', pa)
    .then((result) => {
      return result.data
    })
}

// 实现用户数据添加
export const addUser = (params) => {
  return axios.post('users', params)
    .then((result) => {
      return result.data
    })
}

// 实现用户数据编辑
export const editUser = (params) => {
  return axios.put(`users/${params.id}`, params)
    .then((result) => {
      return result.data
    })
}
// 实现用户数据删除
export const deleteUser = (id) => {
  return axios.delete(`users/${id}`)
    .then((result) => {
      return result.data
    })
}
// 获取角色列表
export const getRolesList = () => {
  return axios.get('roles')
    .then((result) => {
      return result.data
    })
}

// 实现分配用户角色
export const grantUser = (params) => {
  return axios.put(`users/${params.id}/role`, {rid: params.rid})
    .then((result) => {
      return result.data
    })
}
// 实现用户状态切换
export const changeuserstate = (params) => {
  return axios.put(`users/${params.uid}/state/${params.type}`)
    .then((result) => {
      return result.data
    })
}
// 获取权限列表
export const getRightsList = (pa) => {
  return axios.get(`rights/${pa.type}`)
    .then((result) => {
      return result.data
    })
}
// 实现当前角色的权限分配
// roleId:当前角色的id
// rids:它是一个对象，键就是rids,值是以 , 分割的权限ID列表--字符串:{rids:'1,2,3,4,5'}
export const grantroleright = (roleId, rids) => {
  return axios.post(`roles/${roleId}/rights`, rids)
    .then((result) => {
      return result.data
    })
}
// 添加角色
export const addRole = (pa) => {
  return axios.post('roles', pa)
    .then(res => {
      return res.data
    })
}
// 删除角色的指定权限
export const deleteroleright = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`)
    .then((result) => {
      return result.data
    })
}
// 获取左侧菜单权限
export const getMenu = (pa) => {
  return axios.get(`menus`)
    .then((result) => {
      return result.data
    })
}
// 获取商品数据列表
export const getCategories = (pa) => {
  return axios.get(`categories`, {params: pa})
    .then((result) => {
      return result.data
    })
}
// 添加分类
export const addCategory = (pa) => {
  return axios.post('categories', pa)
    .then(res => {
      return res.data
    })
}
// 获取商品数据列表
export const getGoods = (pa) => {
  return axios.get(`goods`, {params: pa})
    .then((result) => {
      return result.data
    })
}
// 添加商品
export const addGoods = (pa) => {
  return axios.post('goods', pa)
    .then(res => {
      return res.data
    })
}
