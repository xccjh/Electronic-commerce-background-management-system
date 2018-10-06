<template>
    <div class="goods">
        <!-- 面包屑 -->
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!--搜索和添加用户按钮-->
      <div style="margin-top: 15px;">
          <el-button type="success" plain @click='showAddDialog'>添加分类</el-button>
      </div>
      <tree-grid
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory">
    </tree-grid>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="添加商品分类" :visible.sync="adddialogFormVisible">
  <el-form :model="addform" label-width="80px">
    <el-form-item label="分类名称">
      <el-input v-model="addform.cat_name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="父级名称">
    <el-cascader
        :options="catelist"
        :props='cascaderProps'
        v-model="selectedOptions"
        @change="handleChange">
    </el-cascader>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="adddialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateSubmit">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>
<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid.vue'
import { getCategories, addCategory } from '@/api/index.js'
export default {
  // 引入自定义组件。因为当前文件已经是一个组件，所以通过components属性来引入自定义组件
  components: {
    TreeGrid: TreeGrid
  },
  data () {
    return {
      adddialogFormVisible: false,
      dataSource: [],
      total: 0,
      pagenum: 1,
      pagesize: 10,
      addform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      cascaderProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      //   这里面存储着我们当前所选择的父级分类数据(id)
      selectedOptions: [],
      catelist: [],
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }]
    }
  },
  methods: {
    addCateSubmit () {
    //   console.log(this.selectedOptions)
    //   console.log(this.addform)
      if (this.selectedOptions.length === 0) {
        this.addform.cat_level = 0
        this.addform.cat_pid = 0
      } else if (this.selectedOptions.length === 1) {
        this.addform.cat_level = 1
        this.addform.cat_pid = this.selectedOptions[0]
      } else if (this.selectedOptions.length === 2) {
        this.addform.cat_level = 2
        this.addform.cat_pid = this.selectedOptions[1]
      }
      addCategory(this.addform)
        .then(res => {
          if (res.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.adddialogFormVisible = false
            this.initList()
          }
        })
    },
    //   当级联菜单选项发生改变的时候触发
    // 在这里可以获取当前所选择的分类的id,这个id就是添加分类时所需要的父级id
    handleChange (value) {
    //   console.log(value)
      this.addform.cat_pid = value
    },
    showAddDialog () {
      this.adddialogFormVisible = true
      getCategories({type: 2})
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.catelist = res.data
          }
        })
    },
    deleteCategory (val) {
      console.log('delete:' + val)
    },
    editCategory (val) {
      console.log('edit:' + val)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    },
    initList () {
      getCategories({type: 3, pagenum: this.pagenum, pagesize: this.pagesize})
        .then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.dataSource = res.data.result
            this.total = res.data.total
          }
        })
    }
  },
  mounted () {
    this.initList()
  }
}
</script>
<style lang="scss" scoped>

</style>
