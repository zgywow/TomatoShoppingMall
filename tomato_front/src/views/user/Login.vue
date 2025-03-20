<template>
  <div class="login-container">
    <div class="login-card">
      <div class="brand-header">
        <h1 class="brand-title">📚 番茄读书</h1>
        <p class="brand-subtitle">开启你的纸质书之旅</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">用户名/邮箱</label>
          <input
              type="text"
              id="username"
              v-model="form.username"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
              type="password"
              id="password"
              v-model="form.password"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
          />
        </div>

        <div class="form-actions">
          <button
              type="submit"
              class="submit-btn"
              :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">立即登录</span>
            <span v-else>登录中...</span>
          </button>
        </div>

        <div class="additional-links">
          <a href="#" class="link">忘记密码？</a>
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </form>
    </div>

    <div class="background-books">
      <div class="book"></div>
      <div class="book"></div>
      <div class="book"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {router} from '../../router';
const form = ref({
  username: '',
  password: ''
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    // 这里添加实际的登录逻辑
    console.log('登录信息：', form.value);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 处理登录成功后的跳转
    // router.push('/dashboard');
  } catch (error) {
    console.error('登录失败:', error);
    // 显示错误提示
  } finally {
    isSubmitting.value = false;
  }
};

const handleInputFocus = (e) => {
  e.target.parentElement.classList.add('focused');
};

const handleInputBlur = (e) => {
  e.target.parentElement.classList.remove('focused');
  if (!e.target.value) {
    e.target.parentElement.classList.remove('filled');
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