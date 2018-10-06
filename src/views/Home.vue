<template>
    <div class="home">
      <el-container>
        <el-aside width="auto">
           <div class="logo"></div>
           <el-menu
           :router='true'
           :collapse="isCollapse"
            :unique-opened='uo'
            class="el-menu-admin"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu :index="item.id + ''" v-for='item in menuList' :key='item.id'>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+subitem.path" v-for='subitem in item.children' :key='subitem.id'>
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header>
            <span class="myicon myicon-menu toggle-btn" @click='isCollapse = !isCollapse'></span>
            <div class="system-title">电商后台管理系统</div>
            <div>
              <!-- <span class="welcome">你好：{{$store.state.username}}</span> -->
              <span class="welcome">你好：{{$store.state.username ? $store.state.username : $store.getters.username}}</span>
              <el-button type="text" @click='logout'>退出</el-button>
            </div>
          </el-header>
          <el-main>
            <!-- 真正展示嵌套路由内容的区域 -->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>
<script>
import { getMenu } from '@/api'
export default {
  data () {
    return {
      isCollapse: false,
      uo: true,
      menuList: []
    }
  },
  methods: {
    // 退出功能
    logout () {
      // console.log(this.$store.state.username)
      // 清除存储的token值
      localStorage.removeItem('mytoken')
      // 跳转到登陆
      this.$router.push({name: 'Login'})
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  mounted () {
    getMenu().then(res => {
      this.menuList = res.data
    })
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #f1f1f1;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
}
</style>
