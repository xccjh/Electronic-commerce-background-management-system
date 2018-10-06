<template>
    <div class="goods">
         <!-- 面包屑 -->
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card" style='height:600px'>
        <router-view></router-view>
      </el-card>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>

</style>
