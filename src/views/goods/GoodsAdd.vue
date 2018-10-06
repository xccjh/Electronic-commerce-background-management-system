<template>
    <div class="add">
        <el-steps :active="activeName - 0" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
            <el-step title="步骤 4"></el-step>
        </el-steps>
        <template>
            <el-form ref="AddForm" :model="AddForm" label-width="80px" style='height:600px'>
                <el-tabs v-model="activeName" tab-position='left' style='margin-top:30px' @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="AddForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="AddForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="AddForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="AddForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader :options="options" v-model="selectedOptions" expand-trigger="hover" :props='catprops' @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <div class="amap-wrapper">
                            <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :headers="getToken()" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :on-success='uploadDone' :before-upload='uploadBeforeValid'>
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip" v-if='is_show'>只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 添加富文本编辑框 -->
                        <quill-editor v-model="AddForm.content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" style='height:300px'>
                        </quill-editor>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <el-button type="success" @click='addGoodsSubmit' style='position:absolute;right:50px;bottom:100px'>提交</el-button>
        </template>
        <!-- 图片预览框 -->
        <el-dialog title="提示" :visible.sync="previewdialogVisible" width="50%">
            <img :src="uploadImgSrc" alt="">
        </el-dialog>
    </div>
</template>
<script>
import { addGoods, getCategories } from '@/api/index.js'
export default {
  data () {
    return {
      activeName: 0,
      //   验证第一个面板中的数据是否合法
      //   isValid: true,
      AddForm: {
        // 商品名称
        goods_name: '',
        // 选中的商品分类
        goods_cat: '1,3,6',
        // 商品价格
        goods_price: '',
        // 商品数量
        goods_number: '',
        // 商品重量
        goods_weight: '',
        // 商品的描述
        goods_introduce: '',
        // 商品的图片
        pics: [],
        // 商品的属性，包含了动态参数 和 静态参数
        attrs: [],
        // 商品描述
        content: ''
      },

      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block']
          ]
        }
      },
      is_show: false,
      uploadImgSrc: '',
      previewdialogVisible: false,
      options: [],
      catprops: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      uploadHeaders: { Authorization: localStorage.getItem('mytoken') },
      selectedOptions: []
    }
  },
  mounted () {
    getCategories({ type: 3 }).then(res => {
      this.options = res.data
    })
  },
  methods: {
    handleChange (value) {
      //   console.log(value)
      this.AddForm.goods_cat = value.join(',')
      console.log(this.AddForm.goods_cat)
    },
    //   上传文件之前的验证--验证大小
    // 如果返回了false,会自动的触发on-remove事件
    uploadBeforeValid (file) {
      console.log(file)
      if (file.size > 500000) {
        this.is_show = true
        // 如果返回false.则中止上传操作
        return false
      } else {
        this.is_show = false
      }
    },
    //   文件上传成功时触发的事件
    uploadDone (file) {
      //   console.log(file)
      //   将当前上传成功的文件信息存储到数组
      this.AddForm.pics.push({ pic: file.data.tmp_path })
    },
    //   实现商品的添加
    addGoodsSubmit () {
      console.log(this.AddForm)
      addGoods(this.AddForm).then(res => {
        console.log(res)
        if (res.meta.status === 201) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.$router.push('/goods/list')
        }
      })
    },
    //   获取token
    getToken () {
      var token = localStorage.getItem('mytoken')
      return { Authorization: token }
    },
    //   图片删除时触发的事件
    // file:当前已经被删除的文件信息
    // fileList：当前组件中还剩余的文件信息
    handleRemove (file, fileList) {
      if (!file.response) {
        return
      }
      //   console.log(file, fileList)
      var filepath = file.response.data.tmp_path
      //   findIndex:可以查找指定数据的所在索引位置：它有一个回调函数，回调函数有一个参数，就是遍历数组时每次遍历到的成员，每次使用一个成员的数据进行函数的业务逻辑的计算，如果满足条件，则返回当前索引
      var index = this.AddForm.pics.findIndex(item => {
        return item.pic === filepath
      })
      this.AddForm.pics.splice(index, 1)
    },
    // 图片预览时触发的事件
    handlePreview (file) {
      this.previewdialogVisible = true
      //   console.log(file)
      this.uploadImgSrc =
        'http://localhost:8888/' + file.response.data.tmp_path
    },
    // 单击Tab标签导航项时触发的事件
    handleClick (tab, event) {
      //   console.log(tab, event)
      //   if (tab.name === '1') {
      //     if (!this.isValid) {
      //       this.$message({
      //         type: 'warning',
      //         message: '请输入合法的商品数据'
      //       })
      //     }
      //   }
    },
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    }
  }
}
</script>
<style lang="scss" scoped>
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>
