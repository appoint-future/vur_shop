<template>
  <el-container class="hone-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="@/assets/logo/logo.jpg" alt="" />
      </div>
      <h1>电商后台管理系统</h1>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside
        class="sidebar"
        :width="'12.6667rem'"
        style="overflow-x: hidden"
      >
        <!-- 折叠图形区域 -->
        <div class="toggle-menu" @click="toggleMenu">|||</div>
        <!-- 菜单栏区域 -->
        <el-menu
          background-color="#36454f"
          text-color="#fff"
          active-text-color="#409EFF"
          mode="vertical"
          :collapse="toggleCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
          style="border-right: 0"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menus"
            :key="item.id"
            :index="item.id.toString()"
            :popper-append-to-body="false"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="childrens in item.children"
              :key="childrens.id"
              :index="'/' + childrens.path"
              @click="saveActivePath('/' + childrens.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ childrens.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenusAPI } from '@/api/homeAPI'
import anime from 'animejs/lib/anime.es.js'
export default {
  name: 'my-Home',
  data() {
    return {
      menus: [],
      // 将meuns里面的每个ID对应一个icon图标
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-help',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-platform',
      },
      // 控制菜单的折叠和展示
      toggleCollapse: false,
      // 控制动画的发生
      isAnimting: false,
      // 当前激活菜单的值
      activePath: '',
    }
  },
  methods: {
    logout() {
      // 清空会话存储里面的数据
      this.$store.state.userInfo = {}
      // 跳转至登录页
      this.$router.replace('/login')
    },
    async getMenus() {
      const { data: res } = await getMenusAPI()
      if (res.meta.status === 200) {
        this.menus = res.data
      } else return this.$message.error(res.meta.message)
    },
    // 动画展开和关闭侧边栏
    toggleMenu() {
      if (!this.toggleCollapse && this.isAnimting === false) {
        this.isAnimting = true
        this.toggleCollapse = !this.toggleCollapse
        anime({
          targets: '.sidebar',
          width: ['12.677rem', '4.677rem'], // -> from '28px' to '100%',
          easing: 'easeInOutQuad',
          direction: 'normal',
          complete: () => {
            this.isAnimting = false
          },
        })
      } else if (this.toggleCollapse && this.isAnimting === false) {
        this.isAnimting = true
        this.toggleCollapse = !this.toggleCollapse
        anime({
          targets: '.sidebar',
          width: ['4.677rem', '12.677rem'], // -> from '28px' to '100%',
          easing: 'easeInOutQuad',
          direction: 'normal',
          complete: () => {
            this.isAnimting = false
          },
        })
      }
    },
    // 保存激活菜单项
    saveActivePath(active) {
      this.activePath = active
      window.sessionStorage.setItem('activePath', active)
    },
  },
  created() {
    this.getMenus()
    // 每次激活时 为激活菜单项赋值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
}
</script>

<style lang="less" scoped>
.hone-container {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
  background-color: rgb(48, 65, 86);
  .logo {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 1rem;
    img {
      width: 3rem;
      height: 3rem;
    }
  }
  h1 {
    padding: 0;
    margin: 0;
    color: #fff;
    flex: 1;
    font-size: 1.2667rem;
  }
}
.el-aside {
  background-color: #36454f;
  .toggle-menu {
    height: 1.8rem;
    background-color: #2f393f;
    text-align: center;
    line-height: 1.8rem;
    color: #fff;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
  height: calc(100vh - 61px); //61px为顶部header盒子高度
  overflow-y: auto;
}
</style>
