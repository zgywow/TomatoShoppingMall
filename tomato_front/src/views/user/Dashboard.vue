<script setup lang="ts">
import { ref, computed } from 'vue'
import { userInfo, userInfoUpdate } from '../../api/user.ts' // 确保有上传头像的接口
import { parseTime } from "../../utils"
import { router } from '../../router'
import { UserFilled } from "@element-plus/icons-vue";
import { uploadImage } from '../../api/tools.ts';

const name = ref('')
const storeName = ref('')
const tel = ref('')
const address = ref('')
const email = ref('')  // 新增的邮箱字段
const regTime = ref('')

const newName = ref('')

const displayInfoCard = ref(false)

const password = ref('')
const confirmPassword = ref('')

const avatarUrl = ref('') // 保存头像URL

const hasConfirmPasswordInput = computed(() => confirmPassword.value != '')
const isPasswordIdentical = computed(() => password.value == confirmPassword.value)
const changeDisabled = computed(() => {
  return !(hasConfirmPasswordInput.value && isPasswordIdentical.value)
})

getUserInfo()

function getUserInfo() {
  userInfo().then(res => {
    name.value = res.data.result.name
    tel.value = res.data.result.phone
    storeName.value = res.data.result.storeName
    address.value = res.data.result.address
    email.value = res.data.result.email || ''  // 获取当前邮箱
    regTime.value = parseTime(res.data.result.createTime)
    avatarUrl.value = res.data.result.avatar || ''
    newName.value = name.value
  })
}

function updateInfo() {
  userInfoUpdate({
    name: newName.value,
    password: undefined,
    address: address.value,
    email: email.value,  // 提交邮箱
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        customClass: 'customMessage',
        type: 'success',
        message: '更新成功！',
      })
      getUserInfo()
    } else if (res.data.code === '400') {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
      })
    }
  })
}

function updatePassword() {
  userInfoUpdate({
    name: undefined,
    password: password.value,
    address: undefined
  }).then(res => {
    if (res.data.code === '000') {
      password.value = ''
      confirmPassword.value = ''
      ElMessageBox.alert(
        `请重新登录`,
        '修改成功',
        {
          customClass: "customDialog",
          confirmButtonText: '跳转到登录',
          type: "success",
          showClose: false,
          roundButton: true,
          center: true
        }).then(() => router.push({ path: "/login" }))
    } else if (res.data.code === '400') {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
      })
      password.value = ''
      confirmPassword.value = ''
    }
  })
}

function handleAvatarChange(file: any) {
  // 头像上传处理逻辑
  uploadImage(file).then(res => {
    if (res.data.code === '000') {
      avatarUrl.value = res.data.result.avatar // 更新头像显示
      ElMessage({
        customClass: 'customMessage',
        type: 'success',
        message: '头像上传成功！',
      })
    } else {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
      })
    }
  })
}
</script>

<template>
  <el-main class="main-container">
    <el-card class="aside-card">
      <div class="avatar-area">
        <el-upload
          class="avatar-uploader"
          :action="handleAvatarChange"
          :show-file-list="false"
          :auto-upload="true"
        >
          <el-avatar :src="avatarUrl" :icon="UserFilled" :size="80"></el-avatar>
        </el-upload>
        <span class="avatar-text"> 欢迎您，{{ name }}</span>
      </div>

      <el-divider></el-divider>

      <el-descriptions
          :column="1"
          border
          title="个人信息"
      >
        <template #extra>
          <el-button type="primary" @click="displayInfoCard = !displayInfoCard">
            <span v-if="displayInfoCard">修改密码</span>
            <span v-else>修改个人信息</span>
          </el-button>
        </template>

        <el-descriptions-item label="联系电话">
          {{ tel }}
        </el-descriptions-item>

        <el-descriptions-item label="邮箱">
          {{ email }}
        </el-descriptions-item>

        <el-descriptions-item label="地址">
          {{ address }}
        </el-descriptions-item>

        <el-descriptions-item label="注册时间">
          {{ regTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 修改个人信息 -->
    <el-card v-if="displayInfoCard" class="change-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button @click="updateInfo">更新</el-button>
        </div>
      </template>

      <el-form>
        <el-form-item>
          <label for="name">昵称</label>
          <el-input type="text" id="name" v-model="newName"/>
        </el-form-item>

        <el-form-item>
          <label for="phone">手机号</label>
          <el-input id="phone" v-model="tel" disabled/>
        </el-form-item>

        <el-form-item>
          <label for="address">收货地址</label>
          <el-input id="address" type="textarea"
                    rows="4"
                    v-model="address" placeholder="中华门"></el-input>
        </el-form-item>

        <el-form-item>
          <label for="email">邮箱</label>
          <el-input id="email" v-model="email" type="email" placeholder="请输入邮箱"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码 -->
    <el-card v-if="!displayInfoCard" class="change-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
          <el-button @click="updatePassword" :disabled="changeDisabled">
            修改
          </el-button>
        </div>
      </template>

      <el-form>
        <el-form-item>
          <label for="password">密码</label>
          <el-input type="password" id="password" v-model="password" placeholder="•••••••••" required/>
        </el-form-item>
        <el-form-item>
          <label v-if="!hasConfirmPasswordInput" for="confirm_password">确认密码</label>
          <label v-else-if="!isPasswordIdentical" for="confirm_password" class="error-warn">密码不一致</label>
          <label v-else for="confirm_password">确认密码</label>

          <el-input type="password" id="confirm_password" v-model="confirmPassword"
                    :class="{'error-warn-input' :(hasConfirmPasswordInput && !isPasswordIdentical)}"
                    placeholder="•••••••••" required/>
        </el-form-item>
      </el-form>

    </el-card>
  </el-main>
</template>

<style scoped>
.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}

.main-container {
  display: flex;
  flex-direction: row;
  padding: 15px;
  gap: 5px;
  justify-content: center;
  background: linear-gradient(135deg, #3f87a6, #ebf8e1); /* 主题色 */
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.change-card {
  width: 66%;
}

.avatar-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
}

.avatar-text {
  font-size: x-large;
  font-weight: bolder;
  padding-right: 40px;
}

.avatar-uploader {
  display: inline-block;
  cursor: pointer;
}

</style>