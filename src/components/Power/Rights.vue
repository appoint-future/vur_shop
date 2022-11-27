<template>
  <div class="rights-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格区域 -->
    <div class="table-box">
      <!-- 表格主体区域 -->
      <el-table border stripe :data="rightList" class="list">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="175rem"
        ></el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="175rem"
        ></el-table-column>
        <el-table-column prop="level" label="权限等级" width="175rem">
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag
              size="medium"
              v-else-if="scope.row.level === '1'"
              type="success"
              >二级</el-tag
            >
            <el-tag size="medium" v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getRightsListAPI } from '@/api/powerAPI'
export default {
  name: 'my-Rights',
  data() {
    return {
      // 权限列表
      rightList: [],
    }
  },
  methods: {
    // 获取列表权限列表
    async getRightsList() {
      const { data: res } = await getRightsListAPI('list')
      if (res.meta.status === 200) {
        this.rightList = res.data
      } else return this.$message.error(res.meta.msg)
    },
  },
  created() {
    this.getRightsList()
  },
}
</script>

<style lang="less" scoped>
.rights-container {
  margin-right: 3rem;
}
</style>
