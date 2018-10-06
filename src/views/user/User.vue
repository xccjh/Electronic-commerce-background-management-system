<template>
    <div class="user">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--搜索和添加用户按钮-->
      <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model='searchValue' class="input-with-select search-input" @keydown.native.enter="searchUserList">
              <el-button slot="append" icon="el-icon-search" @click='searchUserList'></el-button>
          </el-input>
          <el-button type="success" plain @click='showAddDialog'>添加用户</el-button>
      </div>
      <!-- 数据展示区域：表格 -->
      <template>
          <el-table
              :data="userList"
              border
              style="width: 100%; margin-top:10px;">
              <el-table-column
              type="index"
              width="50">
              </el-table-column>
              <el-table-column
              prop="username"
              label="姓名"
              width="180">
              </el-table-column>
              <el-table-column
              prop="email"
              label="邮箱"
              width="180">
              </el-table-column>
              <el-table-column
              prop="mobile"
              label="电话">
              </el-table-column>
              <el-table-column label="状态"  width="80">
                <template slot-scope="scope">
                    <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change='changeUserState(scope.row)'>
                    </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" plain @click='showEditDialog(scope.row)' title='编辑'></el-button>
                    <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                    <el-button type="primary" icon="el-icon-delete" plain @click='deleteUser(scope.row.id)'></el-button>
                    </el-tooltip>
                    <el-button type="primary" icon="el-icon-check" plain  title='授权角色' @click='showGrantDialog(scope.row)'></el-button>
                </template>
              </el-table-column>
          </el-table>
      </template>
      <!-- 分页 -->
      <el-pagination
          class="user-page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
          <el-form :model="addform" :rules='rules' label-width="100px" ref='addform'>
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="addform.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                  <el-input v-model="addform.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addform.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                  <el-input v-model="addform.mobile"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUserSubmit('addform')">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="editDialogFormVisible">
          <el-form :model="editform" :rules='rules' label-width="100px" ref='editform'>
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="editform.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editform.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                  <el-input v-model="editform.mobile"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUserSubmit('editform')">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 分配用户角色对话框 -->
      <el-dialog title="添加用户" :visible.sync="grantDialogFormVisible">
          <el-form :model="grantform" label-width="100px" ref='grantform'>
              <el-form-item label="用户名:">
                  <el-input v-model="grantform.username" disabled style='width:80px'></el-input>
              </el-form-item>
              <el-form-item label="角色:">
              <el-select v-model="grantform.rid" placeholder="请选择">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="grantDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="grantUserSubmit">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>
<script>
// 引入 api接口
import { getUserList, addUser, editUser, deleteUser, getRolesList, grantUser, changeuserstate } from '@/api/index.js'
export default {
  data () {
    return {
      value2: '',
      searchValue: '',
      pagenum: 1,
      pagesize: 10,
      total: 0,
      userList: [],
      rolesList: [],
      addDialogFormVisible: false,
      addformLabelWidth: '100',
      editDialogFormVisible: false,
      grantDialogFormVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editform: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      grantform: {
        username: '',
        id: '', // 用户id
        rid: '' // 当前用户所分配的角色id
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '电话不能为空' }
        ]
      }
    }
  },
  methods: {
    // 1.分页事件：当每页显示的记录数设置变化的时候触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    // 2.分页事件：当当前页码发生变化的时候触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    },
    // 3.实现用户数据的搜索
    searchUserList () {
      this.initList()
    },
    // 4.显示添加用户对话框
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    // 5.添加用户的功能实现
    addUserSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 实现数据的新增
          addUser(this.addform)
            .then((res) => {
              console.log(res)
              if (res.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: res.meta.msg
                })
                this.initList()
                this.addDialogFormVisible = false
              } else {
                this.$message({
                  type: 'success',
                  message: res.meta.msg
                })
              }
            })
        } else {
          this.$message({
            type: 'warning',
            message: '数据输入不合法'
          })
        }
      })
    },
    // 6.打开编辑用户对话框--加载默认数据
    showEditDialog (row) {
      console.log(row)
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
      this.editform.id = row.id
      this.editDialogFormVisible = true
    },
    // 7.实现用户的编辑操作
    editUserSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 实现数据的编辑
          editUser(this.editform)
            .then((res) => {
              console.log(res)
              if (res.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.meta.msg
                })
                this.initList()
                this.editDialogFormVisible = false
              } else {
                this.$message({
                  type: 'success',
                  message: res.meta.msg
                })
              }
            })
        } else {
          this.$message({
            type: 'warning',
            message: '数据输入不合法'
          })
        }
      })
    },
    // 8.根据id号删除单个用户
    deleteUser (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户数据`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.initList()
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 9.弹出授权角色对话框
    showGrantDialog (row) {
      // 让框框显示
      this.grantDialogFormVisible = true
      // 用户ID
      this.grantform.id = row.id
      this.grantform.username = row.username
      // 加载角色默认数据--下拉列表的默认数据加载
      getRolesList()
        .then((res) => {
          console.log(res)
          this.rolesList = res.data
        })
    },
    // 10：提交角色授权
    grantUserSubmit () {
      console.log(this.grantform)
      if (!this.grantform.rid) {
        this.$message({
          type: 'warning',
          message: '请先选择角色，否则无法提交'
        })
        return
      }
      grantUser(this.grantform)
        .then((res) => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.grantDialogFormVisible = false
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
          }
        })
    },
    // 11.切换用户状态
    changeUserState (row) {
      // changeuserstate({uid: '', type: ''})
      console.log(row)
      changeuserstate({uid: row.id, type: row.mg_state})
        .then((res) => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.initList()
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
          }
        })
    },
    // 12.加载用户列表数据
    initList () {
      getUserList({
        params: {
          query: this.searchValue,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        console.log(res)
        this.userList = res.data.users
        this.total = res.data.total
      })
    }
  },
  // 我们在页面加载完毕就立刻获取数据
  mounted () {
    // this.initList()
    this.handleSizeChange(this.pagesize)
  }
}
</script>
<style lang="scss" scoped>
.user {
  .search-input {
    width: 300px;
  }
  .user-page {
    background-color: rgb(214, 210, 210);
    margin-top: 10px;
  }
}
</style>
