<template>
  <div class="roles-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格区域 -->
    <div class="table-box">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <!-- 表格主体区域 -->
      <el-table border stripe :data="rolesList" class="list">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统把屏幕平分为24份 -->
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              type="flex"
              align="middle"
            >
              <!-- 一级权限区域 -->
              <el-col :span="5" :push="1">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限区域 -->
              <el-col :span="19">
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  type="flex"
                  align="middle"
                  class="rights-two"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="175rem"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="175rem"
        ></el-table-column>
        <el-table-column label="操作" width="175rem">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeRole(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="setRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限的弹出框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightsVisible"
        width="40%"
        @close="finishSetRights"
      >
        <!-- 权限树状节点 -->
        <el-tree
          :data="rightList"
          default-expand-all
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="defaultCheckout"
          ref="tree"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsVisible = false">取 消</el-button>
          <el-button type="primary" @click="assignPermissions">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加角色的弹出框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleVisible"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-form :model="addRoleForm" :rules="rules" ref="addRoleForm">
          <!-- 角色名称 -->
          <el-form-item label="角色名称" label-width="80px" prop="roleName">
            <el-input
              v-model="addRoleForm.roleName"
              autocomplete="off"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <!-- 角色描述 -->
          <el-form-item
            label="角色描述"
            label-width="80px"
            prop="roleDescription"
          >
            <el-input
              v-model="addRoleForm.roleDescription"
              autocomplete="off"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="subAddRoleForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑角色的弹出框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editRoleVisible"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-form :model="editRoleForm" :rules="rules" ref="editRoleForm">
          <!-- 角色名称 -->
          <el-form-item label="角色名称" label-width="80px" prop="roleName">
            <el-input
              v-model="editRoleForm.roleName"
              autocomplete="off"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <!-- 角色描述 -->
          <el-form-item
            label="角色描述"
            label-width="80px"
            prop="roleDescription"
          >
            <el-input
              v-model="editRoleForm.roleDescription"
              autocomplete="off"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="subEditRoleForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRightsListAPI,
  getRolesListAPI,
  removeRolesAPI,
  assignPermissionsAPI,
  addRoleAPI,
  editRoleAPI,
  removeRoleAPI,
} from '@/api/powerAPI'
export default {
  name: 'my-Roles',
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 展示和隐藏弹出框
      setRightsVisible: false,
      // 权限数据
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认选中的节点  根据id
      defaultCheckout: [],
      // 点击权限分配后保存的角色id
      rolesId: '',
      // 添加角色的弹出框的显示与隐藏
      addRoleVisible: false,
      // 添加角色的数据
      addRoleForm: {
        roleName: '',
        roleDescription: '',
      },
      // 验证添加角色的表单数据
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 1, max: 6, message: '长度为 1 ~ 6 个字符' },
        ],
        roleDescription: [
          {
            min: 0,
            max: 15,
            message: '最大长度不超过15个字符',
            trigger: 'blur',
          },
        ],
      },
      // 编辑角色的弹出框的显示和隐藏
      editRoleVisible: false,
      // 编辑角色的表格数据
      editRoleForm: {
        roleName: '',
        roleDescription: '',
      },
      // 保存用户id
      id: '',
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await getRolesListAPI()
      if (res.meta.status === 200) {
        this.rolesList = res.data
      } else return this.$message.error(res.meta.msg)
    },
    // 删除角色权限
    removeRightsById(role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        // eslint-disable-next-line space-before-function-paren
        .then(async () => {
          const { data: res } = await removeRolesAPI(role.id, rightId)
          if (res.meta.status === 200) {
            // 更新权限
            role.children = res.data
          } else return this.$message.error(res.meta.msg)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 分配权限
    async setRights(roles) {
      this.setRightsVisible = true
      // 将角色id保存到data中
      this.rolesId = roles.id
      // 获取树状权限
      const { data: res } = await getRightsListAPI('tree')
      if (res.meta.status === 200) {
        this.rightList = res.data
        // 勾上角色已有的权限
        this.getLeafKeys(roles, this.defaultCheckout)
      } else return this.$message.error(res.meta.msg)
    },
    // 获取三级节点下的id属性
    getLeafKeys(node, arr) {
      // 如果没有子对象 则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果不是三级节点 则获取其节点递归寻找
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 点击确定分配权限
    async assignPermissions() {
      // 获取到所有勾选和半勾选的权限id
      const checkedKeys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ]
      // 将数组用逗号分隔 拼接成一个字符串
      const keysArr = checkedKeys.join(',')
      const { data: res } = await assignPermissionsAPI(this.rolesId, keysArr)
      if (res.meta.status === 200) {
        this.$message.success('分配权限成功')
        this.getRolesList()
      } else return this.$message.error(res.meta.msg)
      this.setRightsVisible = false
    },
    // 关闭分配权限的对话框
    finishSetRights() {
      this.defaultCheckout = []
    },
    // 展开添加角色的弹出框
    addRole() {
      this.addRoleVisible = true
    },
    // 添加角色
    subAddRoleForm() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.addRoleForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await addRoleAPI(this.addRoleForm)
          if (res.meta.status === 201) {
            this.$message.success('添加角色成功')
            // 成功获取数据
            this.getRolesList()
          } else this.$message.error(res.meta.msg)
        } else {
          return this.$message.error('表格数据格式错误')
        }
        // 清空数据
        this.addRoleForm.roleName = ''
        this.addRoleForm.roleDescription = ''
        // 关闭弹出框
        this.addRoleVisible = false
      })
    },
    // 打开编辑角色的弹出框
    editRole(scope) {
      this.editRoleVisible = true
      this.id = scope.id
    },
    // 提交编辑角色的内容
    subEditRoleForm() {
      // eslint-disable-next-line space-before-function-paren
      this.$refs.editRoleForm.validate(async (valid) => {
        if (valid) {
          const { data: res } = await editRoleAPI(
            this.id,
            this.editRoleForm.roleName,
            this.editRoleForm.roleDescription)
          if (res.meta.status === 200) {
            this.$message.success('添编辑成功')
            // 重新获取数据
            this.getRolesList()
          } else this.$message.error(res.meta.msg)
        } else {
          return this.$message.error('表格数据格式错误')
        }
        // 清空数据
        this.editRoleForm.roleName = ''
        this.editRoleForm.roleDescription = ''
        this.id = ''
        // 关闭弹出框
        this.editRoleVisible = false
      })
    },
    // 删除角色
    async removeRole(scope) {
      // 保存角色id
      this.id = scope.id
      const choose = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).catch((err) => err)
      if (choose === 'cancel') return this.$message.info('已取消删除')
      if (choose === 'confirm') {
        const { data: res } = await removeRoleAPI(this.id)
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          // 重新获取角色
          this.getRolesList()
          // 清空id
          this.id = ''
        } else return this.$message.error(res.meta.msg)
      }
    },
  },
  created() {
    this.getRolesList()
  },
}
</script>

<style lang="less" scoped>
.roles-container {
  margin-right: 3rem;
}

.el-tag {
  margin: 0.4rem;
}

.el-row {
  border-bottom: 1px solid #ccc;
}
.el-row:nth-child(1) {
  border-top: 1px solid #ccc;
}
.rights-two:nth-child(1) {
  border-top: 0;
}
.rights-two:nth-last-child(1) {
  border-bottom: 0;
}
</style>
