<template>
    <div class="login">
        <div class="container">
            <el-form ref="loginForm" :model="form" :rules="rules">
                <img src="../assets/avatar.jpg" class="avatar" alt="">
               <el-form-item prop="username">
                   <el-input v-model="form.username" placeholder='用户名' prefix-icon="myicon myicon-user"></el-input>
               </el-form-item>
                <el-form-item prop="password">
                   <el-input type='password' v-model="form.password" placeholder='密码' prefix-icon="myicon myicon-key"></el-input>
               </el-form-item>
               <el-form-item >
                   <el-button type="primary" class="login-btn" @click='loginValide("loginForm")'>登陆</el-button>
               </el-form-item> -->
            </el-form>
        </div>
    </div>
</template>
<script>
import {login} from '@/api/index.js'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginValide (formName) {
      // 验证用户输入
      this.$refs[formName].validate((valid) => {
        // 如果通过验证则valid为true
        if (valid) {
          // 如果用户输入合法则去实现登陆提交操作
          login(this.form)
            .then((res) => {
              console.log(res)
              // 只有一个建议：打印再说
              if (res.meta.status === 200) {
                // 将当前的用户名存储到Store中
                // 如果是直接调用mutations中的函数，那么就应该使用commit,但是它是同步调用
                // this.$store.commit('setusername', res.data.username)
                // 如果想以异步的方式调用函数，那么就应该使用dispatch，它是触发actions中的方法
                this.$store.dispatch('setusernameAction', res.data.username)
                // 将token值存储起来：使用localStorage
                localStorage.setItem('mytoken', res.data.token)
                //   登陆成功：实现跳转
                this.$router.push({name: 'Home'})
              } else if (res.meta.status === 400) {
                //   弹出消息框
                this.$message.error(res.meta.msg)
              }
            })
        } else {
          this.$message.error('数据输入不合法')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
