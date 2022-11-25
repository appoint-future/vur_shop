<template>
  <div class="home-container">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'my-Home',
  methods: {
    logout() {
      // 清空会话存储里面的数据
      this.$store.state.userInfo = {}
      // 跳转至登录页
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
