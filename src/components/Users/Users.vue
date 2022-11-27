<template>
  <div class="users-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格区域 -->
    <div class="table-box">
      <!-- 搜索添加区域 -->
      <div class="search-add">
        <el-input
          placeholder="请输入内容"
          clearable
          @clear="getUserList"
          v-model="queryInfo.query"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <!-- 弹出框模块 -->
        <el-dialog
          title="添加用户"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
          width="40%"
        >
          <el-form :model="addUserForm" :rules="rules" ref="addUserForm">
            <!-- 名称区域 -->
            <el-form-item prop="username">
              <el-input
                v-model.trim="addUserForm.username"
                prefix-icon="el-icon-s-custom"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <!-- 密码区域 -->
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model.trim="addUserForm.password"
                prefix-icon="el-icon-lock"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <!-- 邮箱区域 -->
            <el-form-item prop="email">
              <el-input
                v-model.trim="addUserForm.email"
                prefix-icon="el-icon-message"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <!-- 手机号区域 -->
            <el-form-item prop="mobile">
              <el-input
                v-model.trim="addUserForm.mobile"
                prefix-icon="el-icon-mobile-phone"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="subUserInfo">提 交</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 表格主体区域 -->
      <el-table border stripe :data="userList" class="list">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="175rem">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="175rem">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="175rem">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="175rem">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="175rem">
          <!-- 可以通过slot-scope属性 再.row获得这一行的数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175rem">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showModifyDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[3, 4, 5, 6]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 修改用户信息的弹出框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="modifyUserInfoVisible"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-form
          :model="modifyUserInfoForm"
          :rules="rules"
          ref="modifyUserForm"
        >
          <!-- 名称区域 -->
          <el-form-item>
            <el-input
              v-model.trim="modifyUserInfoForm.username"
              prefix-icon="el-icon-s-custom"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <!-- 邮箱区域 -->
          <el-form-item prop="email">
            <el-input
              v-model.trim="modifyUserInfoForm.email"
              prefix-icon="el-icon-message"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 手机号区域 -->
          <el-form-item prop="mobile">
            <el-input
              v-model.trim="modifyUserInfoForm.mobile"
              prefix-icon="el-icon-mobile-phone"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyUserInfo">提 交</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog title="分配角色" :visible.sync="setRoleVisible" width="40%">
        <span>
          <el-form>
            <el-form-item label="当前的用户" label-width="90px">
              <el-input v-model="username" disabled></el-input>
            </el-form-item>
            <el-form-item label="当前的角色" label-width="90px">
              <el-input v-model="role" disabled></el-input>
            </el-form-item>
            <el-form-item label="分配新角色" label-width="90px">
              <el-select v-model="selectRoleId" placeholder="请选择">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignmentRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getUserListAPI,
  changeUserStateAPI,
  addUserAPI,
  queryUserInfoAPI,
  modifyUserInfoAPI,
  removeUserAPI,
  assignmentRoleAPI,
} from '@/api/userAPI'
import { getRolesListAPI } from '@/api/powerAPI'
export default {
  name: 'my-Users',
  data() {
    return {
      // 用户列表
      userList: [],
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pageNum: 1,
        // 每页显示条数
        pageSize: 3,
      },
      // 总条数
      total: 0,
      // 判断是否展示弹出框
      dialogFormVisible: false,
      // 添加的用户信息
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户时的验证信息
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 11, message: '长度为 6 ~ 11 位字符' },
        ],
        email: [
          {
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '请输入正确格式的邮箱',
            trigger: 'change',
          },
        ],
        mobile: [
          {
            pattern:
              /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
            message: '请输入正确格式的手机号',
            trigger: 'change',
          },
        ],
      },
      // 修改用户的弹出框的可见性
      modifyUserInfoVisible: false,
      // 修改的用户信息
      modifyUserInfoForm: {},
      // 分配角色的对话框的显示与隐藏
      setRoleVisible: false,
      // 保存用户的姓名
      username: '',
      // 保存用户的角色
      role: '',
      // 保存用户的id
      id: '',
      // 选择器被选中的那个选项的value
      selectRoleId: '',
      // 全部角色
      rolesList: [],
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await getUserListAPI(this.queryInfo)
      if (res.meta.status === 200) {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    // 每页条数改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      // 每页条数改变时重新发起请求
      this.getUserList()
    },
    // 页码改变事件
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum
      // 页码改变时 重新发起请求
      this.getUserList()
    },
    // 用户状态改变
    async changeState(uId, type) {
      const { data: res } = await changeUserStateAPI(uId, type)
      if (res.meta.status === 200) {
        this.$message.success('更新状态成功')
      } else this.$message.error('更新状态失败')
    },
    // 添加新用户的按钮
    async addUser() {
      this.dialogFormVisible = true
    },
    // 添加用户
    subUserInfo() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.addUserForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await addUserAPI(this.addUserForm)
          if (res.meta.status === 201) {
            this.$message.success('添加成功')
          } else {
            return this.$message.error(res.meta.msg)
          }
          // 清空表格数据
          this.addUserForm = {}
          // 关闭对话框
          this.dialogFormVisible = false
          // 重新获取用户列表
          this.getUserList()
        }
      })
    },
    // 弹出修改用户信息的对话框
    async showModifyDialog(id) {
      this.modifyUserInfoVisible = true
      // 获取用户信息
      const { data: res } = await queryUserInfoAPI(id)
      if (res.meta.status === 200) {
        this.modifyUserInfoForm = res.data
      }
    },
    // 修改用户信息
    async modifyUserInfo() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.modifyUserForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await modifyUserInfoAPI(this.modifyUserInfoForm)
          if (res.meta.status === 200) {
            this.$message.success('修改成功')
          } else {
            return this.$message.success(res.meta.msg)
          }
          // 清空表格数据
          this.modifyUserInfoForm = {}
          // 关闭对话框
          this.modifyUserInfoVisible = false
          // 重新获取用户数据
          this.getUserList()
        }
      })
    },
    // 删除用户
    removeUserById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        // eslint-disable-next-line space-before-function-paren
        .then(async () => {
          // 删除用户
          const { data: res } = await removeUserAPI(id)
          if (res.meta.status === 200) {
            // 重新获取用户列表
            if (this.userList.length === 1) {
              this.queryInfo.pageNum--
            }
            this.getUserList()
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else this.$message.error(res.meta.msg)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 显示分配角色的对话框
    setRole(scope) {
      this.setRoleVisible = true
      this.username = scope.username
      this.role = scope.role_name
      this.id = scope.id
      // 打开前清空selectRoleId
      this.selectRoleId = ''
      // 获取全部角色
      this.getRolesList()
    },
    // 获取全部角色
    async getRolesList() {
      const { data: res } = await getRolesListAPI()
      if (res.meta.status === 200) {
        this.rolesList = res.data
      } else return this.$message.error(res.meta.msg)
    },
    // 点击确定按钮，分配角色
    async assignmentRole() {
      const { data: res } = await assignmentRoleAPI(this.id, this.selectRoleId)
      if (res.meta.status === 200) {
        this.$message.success('分配角色成功')
        // 重新获取用户信息
        this.getUserList()
      } else return this.$message.error(res.meta.msg)
      this.setRoleVisible = false
    },
  },
  created() {
    this.getUserList()
  },
}
</script>

<style lang="less" scoped>
.users-container {
  margin-right: 3rem;
}
.list {
  width: 100%;
  margin: 1rem 0 1rem 0;
}
.search-add {
  display: flex;
  width: 43%;
  .el-input {
    margin-right: 1rem;
  }
}
</style>
