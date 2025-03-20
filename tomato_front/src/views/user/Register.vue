<script setup lang="ts">
import { ref, computed } from 'vue'
import { router } from '../../router'
import { userRegister, checkUsername } from "../../api/user.ts"

// 输入框值
const name = ref('')
const email = ref('')
const tel = ref('')
const address = ref('')
const password = ref('')
const confirmPassword = ref('')

// 标志位：标记用户名是否可用
const usernameAvailable = ref(true)

// 校验规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 计算属性：校验合法性
const hasEmailInput = computed(() => email.value !== '')
const emailValid = computed(() => emailRegex.test(email.value))
const hasTelInput = computed(() => tel.value !== '')
const telLegal = computed(() => chinaMobileRegex.test(tel.value))
const hasPasswordInput = computed(() => password.value !== '')
const hasConfirmPasswordInput = computed(() => confirmPassword.value !== '')
const hasAddressInput = computed(() => address.value !== '')
const isPasswordIdentical = computed(() => password.value === confirmPassword.value)

// 注册按钮可用性
const registerDisabled = computed(() => {
  return !(
    hasEmailInput.value &&
    emailValid.value &&
    hasTelInput.value &&
    telLegal.value &&
    hasPasswordInput.value &&
    hasConfirmPasswordInput.value &&
    hasAddressInput.value &&
    isPasswordIdentical.value &&
    usernameAvailable.value // 新增：用户名需唯一
  )
})

// 检查用户名唯一性
const checkName = async () => {
  if (!name.value) return
  const res = await checkUsername(name.value)
  if (res.data.code === '000') {
    usernameAvailable.value = true
  } else {
    usernameAvailable.value = false
    ElMessage({
      message: "用户名已存在，请重新输入！",
      type: 'error',
      center: true,
    })
  }
}

// 注册按钮触发
async function handleRegister() {
  await checkName()  // 先检查用户名
  if (!usernameAvailable.value) return  // 若用户名存在则不注册

  userRegister({
    name: name.value,
    email: email.value,
    phone: tel.value,
    password: password.value,
    address: address.value,
  }).then(res => {
    if (res.data.code === '000') {  // 注册成功
      ElMessage({
        message: "注册成功！请登录账号",
        type: 'success',
        center: true,
      })
      router.push({ path: "/login" })
    } else {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
</script>

<template>
  <el-main class="main-frame">
    <el-row class="container">
      <!-- 左侧展示区 -->
      <el-col :span="12" class="left-panel">
        <div class="info-section">
          <h2>欢迎注册！</h2>
          <p>创建一个新账户，享受我们的服务。</p>
          <img src="../../assets/logo.png" alt="注册示意图" class="illustration">
        </div>
      </el-col>

      <!-- 右侧注册表单 -->
      <el-col :span="12" class="right-panel">
        <el-card class="login-card">
          <div>
            <h1>创建账户</h1>

            <el-form>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="昵称">
                    <el-input v-model="name" placeholder="请输入昵称" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="邮箱" :class="{'error-warn': hasEmailInput && !emailValid}">
                    <el-input v-model="email" placeholder="请输入邮箱"
                              :class="{'error-warn-input': hasEmailInput && !emailValid}" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="hasTelInput ? (telLegal ? '注册手机号' : '手机号不合法') : '注册手机号'"
                                :class="{'error-warn': hasTelInput && !telLegal}">
                    <el-input v-model="tel" placeholder="请输入手机号" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="地址">
                    <el-input v-model="address" placeholder="请输入地址" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="密码">
                <el-input type="password" v-model="password" placeholder="••••••••" />
              </el-form-item>

              <el-form-item label="确认密码" :class="{'error-warn': hasConfirmPasswordInput && !isPasswordIdentical}">
                <el-input type="password" v-model="confirmPassword"
                          :class="{'error-warn-input': hasConfirmPasswordInput && !isPasswordIdentical}"
                          placeholder="••••••••" />
              </el-form-item>

              <div class="button-group">
                <el-button @click.prevent="handleRegister"
                           :disabled="registerDisabled"
                           type="primary">
                  创建账户
                </el-button>

                <router-link to="/login" v-slot="{navigate}">
                  <el-button @click="navigate">
                    去登录
                  </el-button>
                </router-link>
              </div>

            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>
<style scoped>
/* 主框架样式 */
.main-frame {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd, #f1f8e9);  /* 清新渐变背景 */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 容器布局 */
.container {
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  display: flex;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

/* 左侧展示区 */
.left-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3f87a6, #ebf8e1);
  color: #fff;
  padding: 40px;
  text-align: center;
}

.info-section h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.info-section p {
  font-size: 16px;
  margin-bottom: 20px;
}

.illustration {
  width: 70%;
  max-width: 350px;
}

/* 右侧注册表单 */
.right-panel {
  background: #ffffff;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 注册卡片 */
.login-card {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15); /* 增加阴影 */
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
}

/* 注册卡片 hover 动效 */
.login-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

/* 按钮组 */
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

/* 按钮样式 */
.el-button {
  background: #4caf50;    /* 主题色：绿色 */
  color: #fff;
  border: none;
  transition: all 0.3s;
}

.el-button:hover {
  background: #388e3c;    /* 深色 hover 效果 */
}

/* 警告样式 */
.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}
</style>
