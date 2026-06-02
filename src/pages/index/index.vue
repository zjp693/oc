<template>
  <view class="login-page">
    <image class="page-bg" src="/static/login/page-bg.png" mode="aspectFill" />

    <view class="login-content">
      <view class="brand-section">
        <view class="login-title-wrap">
          <image class="startup-title" src="/static/login/login_title.png" mode="aspectFit" />
          <image class="title-stars" src="/static/login/title_stars.png" mode="aspectFit" />
        </view>
      </view>

      <view class="ghost-section">
        <image class="ghost" src="/static/login/login_ghost_avatar.png" mode="aspectFit" />
      </view>

      <view class="form-section">
        <view class="login-form-panel">
          <view class="field-block">
            <input
              v-model="account"
              class="login-input"
              placeholder="请输入账号"
              placeholder-class="input-placeholder"
              type="text"
              :adjust-position="true"
              :cursor-spacing="24"
            />
            <text class="error-text" :class="{ 'error-text-visible': accountError }">{{ accountError || '占位' }}</text>
          </view>

          <view class="field-block password-block">
            <view class="password-field">
              <input
                v-model="password"
                class="login-input password-input"
                placeholder="请输入密码"
                placeholder-class="input-placeholder"
                :password="!showPassword"
                :adjust-position="true"
                :cursor-spacing="24"
              />
              <button class="eye-button" hover-class="button-hover" @click="showPassword = !showPassword">
                <image
                  class="eye-icon"
                  :src="showPassword ? '/static/login/eye_line.png' : '/static/login/eye_off_line.png'"
                  mode="aspectFit"
                />
              </button>
            </view>
            <text class="error-text" :class="{ 'error-text-visible': passwordError }">{{ passwordError || '占位' }}</text>
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
const showPassword = ref(false)
const accountError = ref('')
const passwordError = ref('')

function handleLogin() {
  const accountValue = account.value.trim()
  const passwordValue = password.value.trim()

  accountError.value = accountValue ? '' : '注：请输入账号'
  passwordError.value = passwordValue ? '' : '注：请输入密码'

  if (!accountValue || !passwordValue) {
    return
  }

  uni.navigateTo({
    url: '/pages/loading/index'
  })
}

function handleRegister() {
  uni.navigateTo({
    url: '/pages/register/index'
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
  padding-top: 250rpx;
  padding-bottom: calc(54rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.brand-section {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login-title-wrap {
  position: relative;
  width: 597rpx;
  height: 153rpx;
}

.startup-title {
  display: block;
  width: 597rpx;
  height: 153rpx;
}

.title-stars {
  position: absolute;
  top: 20rpx;
  right: -20rpx;
  width: 76rpx;
  height: 76rpx;
}

.ghost-section {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 50rpx;
}

.ghost {
  width: 342rpx;
  height: 342rpx;
}

.form-section {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding-top: 96rpx;
  box-sizing: border-box;
}

.login-form-panel {
  width: 100%;
  padding: 0 104rpx;
  box-sizing: border-box;
}

.field-block {
  min-height: 118rpx;
}

.password-block {
  margin-top: 14rpx;
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

.password-field {
  position: relative;
}

.password-input {
  padding-right: 82rpx;
}

.eye-button {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 45rpx;
  height: 45rpx;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.eye-button::after {
  border: 0;
}

.eye-icon {
  width: 37rpx;
  height: 37rpx;
}

.input-placeholder {
  color: #a9aab0;
  font-size: 30rpx;
}

.error-text {
  display: block;
  margin-top: 10rpx;
  padding-left: 36rpx;
  color: rgba(255, 108, 123, 1);
  font-size: 22rpx;
  line-height: 32rpx;
  opacity: 0;
}

.error-text-visible {
  opacity: 1;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}

.action-button {
  width: 238rpx;
  height: 92rpx;
  margin: 0;
  padding: 0;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button::after {
  border: 0;
}

.register-button {
  position: relative;
  border: 1rpx solid #3bb8ff;
  color: #3baaf3;
  background: transparent;
}

// .register-button::before {
//   content: "";
//   position: absolute;
//   top: 9rpx;
//   right: -3rpx;
//   width: 12rpx;
//   height: 12rpx;
//   border-radius: 50%;
//   background: #6fcaff;
//   box-shadow: 5rpx -7rpx 0 -2rpx #3baaf3;
// }

.login-button {
  color: rgba(255, 255, 255, 1);
  background: linear-gradient(132.82deg, rgba(147, 210, 210, 1) 1.75%, rgba(95, 185, 232, 1) 98.89%);
  box-shadow: 0 0 9rpx 4rpx rgba(147, 210, 243, 0.73);
}

.button-hover {
  opacity: 0.82;
}

</style>
