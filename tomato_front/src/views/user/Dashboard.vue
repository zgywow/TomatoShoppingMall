<template>
  <div class="dashboard-container">
    <el-card class="profile-card" shadow="hover">
      <div class="avatar-section">
        <el-avatar :size="100" :src="userInfo.avatar" class="user-avatar" />
        <h2 class="username">{{ userInfo.username }}</h2>
      </div>

      <div class="info-section">
        <!-- 展示模式 -->
        <template v-if="!isEditing">
          <el-row class="info-item" v-for="(value, key) in displayItems" :key="key">
            <el-col :span="6" class="item-label">{{ labels[key] }}：</el-col>
            <el-col :span="16" class="item-content">{{ value || '未设置' }}</el-col>
            <el-col :span="2">
              <el-button type="primary" link @click="startEditing">编辑</el-button>
            </el-col>
          </el-row>
        </template>

        <!-- 编辑模式 -->
        <el-form v-else :model="editUserInfo" label-width="100px" class="edit-form">
          <el-form-item label="用户名">
            <el-input v-model="editUserInfo.username" disabled />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="editUserInfo.realName" />
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="editUserInfo.email" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="editUserInfo.phone" />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="editUserInfo.address" />
          </el-form-item>
          <div class="form-actions">
            <el-button type="success" @click="saveProfile">保存</el-button>
            <el-button @click="cancelEditing">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

// 用户信息
const userInfo = reactive({
  username: 'tomato_reader',
  realName: '番茄读者',
  email: 'tomato@read.com',
  phone: '138-1234-5678',
  address: '上海市徐汇区番茄大厦',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 编辑状态
const isEditing = ref(false)
const editUserInfo = reactive({})

// 字段标签映射
const labels = {
  username: '用户名',
  realName: '真实姓名',
  email: '电子邮箱',
  phone: '手机号码',
  address: '收货地址'
}

// 展示字段过滤
const displayItems = computed(() => {
  const { avatar, ...rest } = userInfo
  return rest
})

// 开始编辑
const startEditing = () => {
  Object.assign(editUserInfo, userInfo)
  isEditing.value = true
}

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false
}

// 保存修改
const saveProfile = () => {
  Object.assign(userInfo, editUserInfo)
  // 这里可以添加API调用
  isEditing.value = false
  ElMessage.success('个人信息已更新')
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

.profile-card {
  border-radius: 15px;
  transition: all 0.3s;
}

.avatar-section {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  margin-bottom: 15px;
}

.username {
  color: #2c3e50;
  margin: 0;
}

.info-section {
  padding: 20px;
}

.info-item {
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
}

.info-item:last-child {
  border-bottom: none;
}

.item-label {
  font-weight: 500;
  color: #666;
}

.item-content {
  color: #888;
}

.edit-form {
  margin-top: 20px;
}

.form-actions {
  margin-top: 30px;
  text-align: right;
}

.el-button {
  margin-left: 10px;
}
</style>