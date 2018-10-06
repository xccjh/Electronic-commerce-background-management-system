<template>
    <div class="role">
       <!-- 面包屑 -->
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="success" plain @click='showadddialog'>添加角色</el-button>
      <!-- 表格--展开行 -->
      <template>
        <el-table
            border
            :data="rolesList"
            style="width: 100%">
            <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row v-for='first in scope.row.children' :key='first.id' style='margin-bottom:15px;'>
                    <el-col :span='4'>
                        <el-tag
                        closable
                        type="success"
                        @close='deleteroleright(scope.row,first.id)'>
                        {{first.authName}}
                        </el-tag>
                        <span class="el-icon-arrow-right" v-if='first.children.length !== 0'></span>
                    </el-col>
                    <el-col :span='20'>
                        <el-row v-for='second in first.children' :key='second.id' style='margin-bottom:8px'>
                            <el-col :span='4'>
                                <el-tag
                                closable
                                type="warning"
                                @close='deleteroleright(scope.row,second.id)'>
                                {{second.authName}}
                                </el-tag>
                                <span class="el-icon-arrow-right" v-if='second.children.length !== 0'></span>
                            </el-col>
                            <el-col :span='20'>
                                <el-tag
                                v-for='third in second.children' :key='third.id'
                                closable
                                type="info"
                                style='margin-right:5px;margin-bottom:5px'
                                @close='deleteroleright(scope.row,third.id)'>
                                {{third.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <span v-if='scope.row.children.length === 0'>该角色还没有分配任何的权限</span>
            </template>
            </el-table-column>
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
            label="角色名称"
            prop="roleName">
            </el-table-column>
            <el-table-column
            label="描述"
            prop="roleDesc">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" plain  title='编辑'></el-button>
                    <el-tooltip class="item" effect="light" content="删除" placement="top-start">
                    <el-button type="primary" icon="el-icon-delete" plain ></el-button>
                    </el-tooltip>
                    <el-button type="primary" icon="el-icon-check" plain  title='授权角色' @click="showGrantDialog(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
      </template>
      <!-- 分配角色对话框 -->
    <el-dialog title="分配权限" :visible.sync="grantDialogFormVisible">
        <div class="treeBox">
            <el-tree
            ref='tree'
            :data="rightsList"
            :default-expand-all='true'
            show-checkbox
            node-key="id"
            :default-checked-keys="rolerdeightlist"
            :props="defaultProps">
            </el-tree>
        </div>
    <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='grantrightsubmit'>确 定</el-button>
    </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
        <el-form :model="addform" label-width="80px">
            <el-form-item label="角色名称">
            <el-input v-model="addform.roleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" >
            <el-input v-model="addform.roleDesc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="adddialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>
<script>
import { getRolesList, getRightsList, grantroleright, addRole, deleteroleright } from '@/api/index.js'
export default {
  data () {
    return {
      // 角色列表数据
      rolesList: [],
      // 权限列表数据
      rightsList: [],
      // 当前角色的权限列表id
      rolerdeightlist: [],
      //   当前角色的id
      currentRoleId: '',
      grantDialogFormVisible: false,
      adddialogFormVisible: false,
      // 树形组件的动态绑定数据时的设置
      defaultProps: {
        children: 'children', // 指定当前节点的嵌套节点属性--决定子节点的数据的来源
        label: 'authName' // 当前节点所显示的内容的属性名称
      },
      addform: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    //   删除角色的权限
    deleteroleright (row, rightid) {
      deleteroleright(row.id, rightid).then(res => {
        if (res.meta.status === 200) {
          console.log(res)
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          row.children = res.data
        } else {
          this.$message({
            type: 'warning',
            message: res.meta.msg
          })
        }
      })
    },
    //   显示添加角色对话框
    showadddialog () {
      this.adddialogFormVisible = true
    },
    addRoleSubmit () {
      addRole(this.addform).then(res => {
        if (res.meta.status === 201) {
          this.$message({
            type: 'success',
            message: '添加角色成功'
          })
          this.initList()
          this.adddialogFormVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: '失败'
          })
        }
      })
    },
    //   初始化
    initList () {
      //   获取所有角色列表数据
      getRolesList()
        .then((res) => {
        // console.log('00000000000000000')
          console.log(res)
          // console.log('------------------')
          this.rolesList = res.data
        })
    },
    //   当前角色的授权提交
    grantrightsubmit () {
    //   grantroleright(this.currentRoleId )
    //   console.log(this.$refs.tree.getCheckedKeys())
    //   console.log(this.$refs.tree.getCheckedNodes())
    // 1.获取当前所有被选中的节点对象。它是一个数组
      var selectednodes = this.$refs.tree.getCheckedNodes()
      //   console.log(selectednodes)
      // 2.遍历数组，获取我们需要的每一个对象中的id和pid
      var originArr = selectednodes.map((item) => {
        return item.id + ',' + item.pid
      })
      //   console.log(originArr) // ['105,104,101','116,104,101']
      //   3.将获取到的数据拼接为一个整体字符中 -- 有重复值:['105','104','101','116','104','101']
      var originStr = originArr.join(',')
      //   console.log(originStr)
      //   4.使用new Set去除重复值
      var myset = new Set(originStr.split(','))
      // var myset = [...new Set(originStr)]
      //   console.log(myset)
      //   5.使用Array.from从set对象返回数组
      var finalArr = Array.from(myset)
      //   console.log(finalArr)
      //   console.log('----------------------------')
      //   发送授权请求
      grantroleright(this.currentRoleId, {rids: finalArr.join(',')})
        .then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.grantDialogFormVisible = false
            this.initList()
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
          }
        })
    },
    //   打开分配角色对话框
    showGrantDialog (row) {
    //   console.log('00000000000000000')
      console.log(row)
      //   console.log('------------------')
      // 显示分配权限对话框
      this.grantDialogFormVisible = true
      this.currentRoleId = row.id
      // 获取数据，将数据展示在树形组件中---一定要在每次打开这个授权对话框重新获取数据，否则数据不会被刷新
      getRightsList({type: 'tree'})
        .then((res) => {
        //   console.log(res)
          this.rightsList = res.data
        })
      // 打开对话框的时候去获取当前角色的权限列表id,因为每个角色的权限都可能不一样，所以每次弹框都需要重新获取这个列表id
      // 先清除上次的id号
      this.rolerdeightlist.length = 0
      // 遍历
      row.children.forEach((first, index) => {
        if (first.children && first.children.length !== 0) {
          first.children.forEach((second) => {
            if (second.children && second.children.length !== 0) {
              second.children.forEach(third => {
                this.rolerdeightlist.push(third.id)
              })
            }
          })
        }
      })
    //   console.log(this.rolerdeightlist)
    }
  }
}
</script>
<style lang="scss" scoped>
.treeBox{
    height: 300px;
    overflow: auto
}
</style>
