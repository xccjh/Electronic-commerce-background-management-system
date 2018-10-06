<template>
    <div>
        <el-row>
        <el-col :span="24">
            <!-- @keydown.enter="getList":这种方式加人原生的button等才有用。。对于el-input无用 -->
            <!-- el-input不是一个标签，而是一个组件。如果想为组件添加事件，那么需要使用到.native修饰符 -->
            <el-input placeholder="请输入内容" class="search-input" v-model="keywords" style='width:400px'>
            <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain @click='$router.push({"path":"add"})'>添加商品</el-button>
        </el-col>
        </el-row>
        <!-- 列表区域 -->
    <el-table
      :data="goodslist"
      border
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        width="155"
        label="商品价格(元)">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        prop="add_time"
        width="140"
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time}}
        </template>
      </el-table-column>
      <el-table-column
      width="130"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    </div>
</template>
<script>
import { getGoods } from '@/api/index.js'
export default {
  data () {
    return {
      // 搜索的关键字
      keywords: '',
      // 商品列表数据
      goodslist: [],
      // 当前显示的页码值
      pagenum: 1,
      // 默认每页显示多少条数据
      pagesize: 10,
      // 总记录条数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    getGoodsList () {
      getGoods({query: this.keywords, pagenum: this.pagenum, pagesize: this.pagesize}).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
        this.goodslist = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      this.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页码值 改变的事件
    handleCurrentChange (newPage) {
      this.pagenum = newPage
      this.getGoodsList()
    },
    // 根据Id删除对应的商品
    removeGoods (row) {
      console.log(row)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
