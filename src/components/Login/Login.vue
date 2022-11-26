<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 标题模块 -->
      <h1>系统登录</h1>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <!-- 用户名区域 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码区域 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { LoginAPI } from '@/api/loginAPI'
export default {
  name: 'my-login',
  data() {
    return {
      // 表单的数据绑定
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 1, max: 8, message: '长度为 1 到 8 位字符' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 1, max: 8, message: '长度为 1 到 8 位字符' },
        ],
      },
    }
  },
  methods: {
    reset() {
      this.$refs.loginFormRef.resetFields()
    },
    async login() {
      this.$refs.loginFormRef.validate(async(valid) => {
        if (!valid) return false
        const { data: res } = await LoginAPI(
          this.loginForm.username,
          this.loginForm.password,
        )
        if (res.meta.status === 200) {
          // 将用户信息保存到会话存储中
          this.$store.commit('updataUserInfo', res.data)
          this.$message.success('登录成功')
          // 切换到主界面
          this.$router.replace('/home')
        } else this.$message.error('登录失败')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: rgb(47, 58, 77);
  h1 {
    font-weight: 300;
    text-align: center;
    color: #ccc;
  }
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
  }
  /deep/.el-input__inner {
    background-color: rgb(43, 52, 69);
    color: #fff;
  }
  /deep/.el-form-item__content {
    display: flex;
    .el-button {
      flex: 1;
    }
  }
  /deep/ .el-input__icon {
    font-size: 20px;
  }
}
</style>
