<template>
  <view class="register-page">
    <image class="page-bg" src="/static/login/page-bg.png" mode="aspectFill" />

    <button class="back-button" hover-class="button-hover" @click="handleBack"
      aria-label="返回">
      <view class="back-chevron" />
    </button>

    <view class="register-content">
      <view class="register-title-wrap">
        <image class="register-title" src="/static/login/register_title.png"
          mode="aspectFit" />
        <image class="title-stars" src="/static/login/title_stars.png"
          mode="aspectFit" />
      </view>

      <view class="register-form-panel">
        <view class="field-block">
          <input v-model="account" class="register-input"
            placeholder="请输入账号（8至13位纯数字）" placeholder-class="input-placeholder"
            type="number" />
          <text class="error-text"
            :class="{ 'error-text-visible': accountError }">{{ accountError ||
            '占位' }}</text>
        </view>

        <view class="field-block">
          <view class="password-field">
            <input v-model="password" class="register-input password-input"
              placeholder="请输入密码（数字+字母）" placeholder-class="input-placeholder"
              :password="!showPassword" />
            <button class="eye-button" hover-class="button-hover"
              @click="showPassword = !showPassword">
              <image class="eye-icon"
                :src="showPassword ? '/static/login/eye_line.png' : '/static/login/eye_off_line.png'"
                mode="aspectFit" />
            </button>
          </view>
          <text class="error-text"
            :class="{ 'error-text-visible': passwordError }">{{ passwordError ||
            '占位' }}</text>
        </view>

        <view class="field-block confirm-block">
          <view class="password-field">
            <input v-model="confirmPassword"
              class="register-input password-input" placeholder="请再次输入密码"
              placeholder-class="input-placeholder"
              :password="!showConfirmPassword" />
            <button class="eye-button" hover-class="button-hover"
              @click="showConfirmPassword = !showConfirmPassword">
              <image class="eye-icon"
                :src="showConfirmPassword ? '/static/login/eye_line.png' : '/static/login/eye_off_line.png'"
                mode="aspectFit" />
            </button>
          </view>
          <text class="error-text"
            :class="{ 'error-text-visible': confirmError }">{{ confirmError ||
            '占位' }}</text>
        </view>

        <button class="submit-button" hover-class="button-hover"
          @click="handleSubmit">注册</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const account = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const accountError = ref('')
  const passwordError = ref('')
  const confirmError = ref('')

  function handleBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      uni.navigateBack()
      return
    }

    uni.redirectTo({
      url: '/pages/index/index'
    })
  }

  function handleSubmit() {
    const accountValue = account.value.trim()
    const passwordValue = password.value.trim()
    const confirmValue = confirmPassword.value.trim()

    if (!accountValue) {
      accountError.value = '注：请输入账号'
    } else if (!/^\d{8,13}$/.test(accountValue)) {
      accountError.value = accountValue.length > 13 ? '注：账号过长，请重新输入' : '注：账号过短，请重新输入'
    } else {
      accountError.value = '注：当前账号已被注册，请重新输入账号'
    }

    if (!passwordValue) {
      passwordError.value = '注：请输入密码'
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(passwordValue)) {
      passwordError.value = '注：密码需包含数字和字母'
    } else {
      passwordError.value = ''
    }

    if (!confirmValue) {
      confirmError.value = '注：请再次输入密码'
    } else if (confirmValue !== passwordValue) {
      confirmError.value = '注：两次输入的密码不同，请重新输入密码'
    } else {
      confirmError.value = ''
    }
  }
</script>

<style scoped lang="scss">
  .register-page {
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
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  .back-button {
    position: absolute;
    top: 109rpx;
    left: 38rpx;
    z-index: 2;
    width: 45rpx;
    height: 45rpx;
    margin: 0;
    padding: 0;
    border-radius: 50%;
    background: transparent;
  }

  .back-button::after {
    border: 0;
  }

  .back-chevron {
    position: absolute;
    top: 12rpx;
    left: 15rpx;
    width: 18rpx;
    height: 18rpx;
    border-left: 7rpx solid #20262f;
    border-bottom: 7rpx solid #20262f;
    transform: rotate(45deg);
  }

  .back-chevron::after {
    content: "";
    position: absolute;
    top: -19rpx;
    right: -14rpx;
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background: #83d5ff;
    box-shadow: 5rpx -5rpx 0 -2rpx #42b9ff;
  }

  .register-content {
    position: relative;
    z-index: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 238rpx;
    padding-bottom: calc(54rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .register-title-wrap {
    position: relative;
    width: 328rpx;
    height: 155rpx;
  }

  .register-title {
    display: block;
    width: 328rpx;
    height: 155rpx;
  }

  .title-stars {
    position: absolute;
    top: 22rpx;
    right: -26rpx;
    width: 71rpx;
    height: 71rpx;
  }

  .register-form-panel {
    width: 100%;
    margin-top: 153rpx;
    padding: 0 108rpx 0 127rpx;
    box-sizing: border-box;
  }

  .field-block {
    min-height: 148rpx;
  }

  .confirm-block {
    margin-top: 0;
  }

  .register-input {
    margin-top: 4rpx;
    width: 100%;
    height: 90rpx;
    padding: 0 36rpx;
    border-radius: 50rpx;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.88);
    color: #333;
    font-size: 30rpx;
    line-height: 90rpx;
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
    top: 23rpx;
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
    padding-left: 38rpx;
    color: rgba(255, 108, 123, 1);
    font-size: 22rpx;
    line-height: 32rpx;
    opacity: 0;
  }

  .error-text-visible {
    opacity: 1;
  }

  .submit-button {
    // width: 519rpx;
    height: 94rpx;
    margin-top: 30rpx;
    padding: 0;
    border-radius: 93rpx;
    color: rgba(255, 255, 255, 1);
    font-size: 30rpx;
    font-weight: 400;
    line-height: 93rpx;
    text-align: center;
    background: linear-gradient(132.82deg, rgba(147, 210, 210, 1) 1.75%, rgba(95, 185, 232, 1) 98.89%);
    box-shadow: 0 0 9rpx 4rpx rgba(147, 210, 243, 0.73);
  }

  .submit-button::after {
    border: 0;
  }

  .button-hover {
    opacity: 0.82;
  }

  @media screen and (min-width: 600px) {
    .register-page {
      max-width: 402px;
      min-height: 874px;
      margin: 0 auto;
    }
  }
</style>
