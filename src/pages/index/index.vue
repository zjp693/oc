<template>
  <view class="login-page">
    <image class="page-bg" src="/static/login/login_bg.png" mode="aspectFill" />

    <view class="login-content">
      <view class="brand-section">
        <image class="startup-title" src="/static/login/startup_title.png" mode="aspectFit" />
      </view>

      <view class="ghost-section">
        <image class="ghost" src="/static/login/login_ghost_avatar.png" mode="aspectFit" />
      </view>

      <view class="form-section">
        <view class="form-panel">
          <view class="field-block">
            <input
              v-model="account"
              class="login-input"
              placeholder="请输入账号"
              placeholder-class="input-placeholder"
              type="text"
            />
            <text v-if="accountError" class="error-text">{{ accountError }}</text>
          </view>

          <view class="field-block password-block">
            <input
              v-model="password"
              class="login-input"
              placeholder="请输入密码"
              placeholder-class="input-placeholder"
              password
            />
            <text v-if="passwordError" class="error-text">{{ passwordError }}</text>
          </view>

          <view class="actions">
            <button class="action-button register-button" hover-class="button-hover" @click="handleRegister">
              注册
            </button>
            <button class="action-button login-button" hover-class="button-hover" @click="handleLogin">
              登录
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const account = ref('')
const password = ref('')
const accountError = ref('注：当前账号不存在，请重新输入')
const passwordError = ref('注：当前账号密码错误，请重新输入')

function handleLogin() {
  accountError.value = account.value.trim() ? '注：当前账号不存在，请重新输入' : '注：请输入账号'
  passwordError.value = password.value.trim() ? '注：当前账号密码错误，请重新输入' : '注：请输入密码'
}

function handleRegister() {
  uni.showToast({
    title: '注册功能待接入',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #161117;
  background: #f8f8f8;
}

.page-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.login-content {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: calc(54rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.brand-section {
  flex: 273 1 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}

.startup-title {
  width: 614rpx;
  height: 153rpx;
}

.ghost-section {
  flex: 249 1 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}

.ghost {
  width: 300rpx;
  height: 300rpx;
}

.form-section {
  flex: 375 1 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding-top: 112rpx;
  box-sizing: border-box;
}

.form-panel {
  width: 100%;
  padding: 0 63rpx;
  box-sizing: border-box;
}

.field-block {
  min-height: 118rpx;
}

.password-block {
  margin-top: 17rpx;
}

.login-input {
  width: 100%;
  height: 93rpx;
  padding: 0 37rpx;
  border-radius: 47rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.88);
  color: #333;
  font-size: 30rpx;
  line-height: 93rpx;
  text-align: center;
}

.input-placeholder {
  color: #a9aab0;
  font-size: 30rpx;
}

.error-text {
  display: block;
  margin-top: 13rpx;
  padding-left: 31rpx;
  color: #ff5167;
  font-size: 23rpx;
  line-height: 1;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 9rpx;
}

.action-button {
  width: 235rpx;
  height: 93rpx;
  margin: 0;
  padding: 0;
  border-radius: 47rpx;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 93rpx;
  text-align: center;
}

.action-button::after {
  border: 0;
}

.register-button {
  position: relative;
  border: 2rpx solid #3bb8ff;
  color: #3baaf3;
  background: transparent;
}

.register-button::before {
  content: "";
  position: absolute;
  top: 9rpx;
  right: -3rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #6fcaff;
  box-shadow: 5rpx -7rpx 0 -2rpx #3baaf3;
}

.login-button {
  color: #fff;
  background: linear-gradient(135deg, #8fd7d5 0%, #58bdea 100%);
  box-shadow: 0 9rpx 25rpx rgba(69, 181, 226, 0.42);
}

.button-hover {
  opacity: 0.82;
}

@media screen and (min-width: 600px) {
  .login-page {
    max-width: 402px;
    min-height: 874px;
    margin: 0 auto;
  }
}
</style>
