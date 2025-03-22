<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 登录卡片 -->
    <div class="login-card">
      
      <!-- 品牌部分 -->
      <div class="brand-header">
        <!-- 品牌标题 -->
        <h1 class="brand-title">📚 番茄读书</h1>
        <!-- 品牌副标题 -->
        <p class="brand-subtitle">开启你的纸质书之旅</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin">
        
        <!-- 手机号输入框 -->
        <div class="form-group">
          <label for="phone">手机号</label>
          <input
              type="text"
              id="phone"
              v-model="tel" 
              @focus="handleInputFocus" 
              @blur="handleInputBlur"    
          
          />
        </div>

        <!-- 密码输入框 -->
        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="password" 
              @focus="handleInputFocus"  
              @blur="handleInputBlur"    
            
          />
        </div>

        <!-- 登录按钮 -->
        <div class="form-actions">
          <button
              type="submit"
              class="submit-btn"
              :disabled="loginDisabled" 
          >
            <!-- 如果正在提交，显示“登录中...”，否则显示“立即登录” -->
            <span v-if="!isSubmitting">立即登录</span>
            <span v-else>登录中...</span>
          </button>
        </div>

        <!-- 额外的链接部分 -->
        <div class="additional-links">
          <!-- 忘记密码的链接 -->
          <a href="#" class="link">忘记密码？</a>
          <!-- 注册页面的链接 -->
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </form>
    </div>

    <!-- 背景的书籍装饰 -->
    <div class="background-books">
      <!-- 第一块书籍装饰 -->
      <div class="book"></div>
      <!-- 第二块书籍装饰 -->
      <div class="book"></div>
      <!-- 第三块书籍装饰 -->
      <div class="book"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {router} from '../../router'
import {userInfo, userLogin} from "../../api/user.ts"

// 输入框值（需要在前端拦截不合法输入：是否为空+额外规则）
const tel = ref('')
const password = ref('')
const isSubmitting = ref(false)


// 电话号码是否为空
const hasTelInput = computed(() => tel.value != '')
// 密码是否为空
const hasPasswordInput = computed(() => password.value != '')
// 电话号码的规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const telLegal = computed(() => chinaMobileRegex.test(tel.value))
// 密码不设置特殊规则
// 登录按钮可用性
const loginDisabled = computed(() => {
  return !(hasTelInput.value && telLegal.value && hasPasswordInput.value)
})

function handleLogin() {
  // 设置正在提交状态
  isSubmitting.value = true
  
  // 调用登录接口
  userLogin({
    phone: tel.value,
    password: password.value
  }).then(res => {
    // 登录成功处理
    if (res.data.code === '000') {
      ElMessage({
        message: "登录成功！",
        type: 'success',
        center: true,
      })
      const token = res.data.result
      sessionStorage.setItem('token', token)

      // 获取用户信息
      userInfo().then(res => {
        sessionStorage.setItem('name', res.data.result.name)
        sessionStorage.setItem('role', res.data.result.role)
        if (res.data.result.role === 'STAFF') {
          sessionStorage.setItem('storeId', res.data.result.storeId)
        }
        router.push({ path: "/dashboard" })
      })
    } else if (res.data.code === '400') {
      // 登录失败处理
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
      password.value = ''  // 清空密码框
    }
  }).finally(() => {
    // 无论请求成功还是失败，提交状态都要恢复
    isSubmitting.value = false
  })
}

const handleInputFocus = (e: FocusEvent) => {
  const inputElement = e.target as HTMLInputElement;  // 强制类型转换为 HTMLInputElement
  inputElement.parentElement?.classList.add('focused');
};

const handleInputBlur = (e: FocusEvent) => {
  const inputElement = e.target as HTMLInputElement;  // 强制类型转换为 HTMLInputElement
  inputElement.parentElement?.classList.remove('focused');
  
  if (!inputElement.value) {
    inputElement.parentElement?.classList.remove('filled');
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

.login-card {
  background: linear-gradient(135deg, #3f87a6, #ebf8e1);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  z-index: 1;
  position: relative;
}

.brand-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.brand-title {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.brand-subtitle {
  color: white;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.8rem;
  position: relative;
}

.form-group label {
  display: block;
  color: #34495e;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 5px;
  pointer-events: none;
  opacity: 0.8;
}

.form-group.focused label,
.form-group.filled label {
  top: -10px;
  font-size: 0.85rem;
  color: #3498db;
  opacity: 1;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #2980b9;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.additional-links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
}

.link {
  color: #2c3e50;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #3498db;
  text-decoration: underline;
}

.background-books {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.book {
  position: absolute;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.book:nth-child(1) {
  width: 120px;
  height: 180px;
  right: 15%;
  top: 20%;
  transform: rotate(10deg);
  background: #e74c3c;
}

.book:nth-child(2) {
  width: 140px;
  height: 200px;
  right: 25%;
  bottom: 20%;
  transform: rotate(-8deg);
  background: #3498db;
}

.book:nth-child(3) {
  width: 100px;
  height: 160px;
  right: 10%;
  bottom: 30%;
  transform: rotate(5deg);
  background: #2ecc71;
}
</style>
