<template>
  <view class="loading-page">
    <image class="page-bg" src="/static/login/page-bg.png" mode="aspectFill" />

    <view class="loading-content">
      <view class="loading-title-wrap">
        <image class="login-title" src="/static/login/login_title.png" mode="aspectFit" />
        <image class="title-stars" src="/static/login/title_stars.png" mode="aspectFit" />
      </view>

      <view class="ghost-track">
        <image class="ghost" src="/static/login/login_ghost_avatar.png" mode="aspectFit" />
      </view>

      <view class="loading-state">
        <image class="loader-icon" src="/static/login/loading_icon.png" mode="aspectFit" />
        <text class="loading-text">正在加载...</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

let loadingTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  loadingTimer = setTimeout(() => {
    uni.redirectTo({
      url: '/pages/home/index'
    })
  }, 3000)
})

onBeforeUnmount(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
})
</script>

<style scoped lang="scss">
.loading-page {
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

.loading-content {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 220rpx;
  padding-bottom: calc(54rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.loading-title-wrap {
  position: relative;
  // width: 537rpx;
  // height: 93rpx;
  height: 160rpx;
}

.login-title {
  display: block;
  // width: 537rpx;
  height: 160rpx;
}

.title-stars {
  position: absolute;
  top: 26rpx;
  right: -20rpx;
  width: 71rpx;
  height: 71rpx;
}

.ghost-track {
  position: relative;
  width: 100%;
  height: 334rpx;
  margin-top: 2rpx;
  overflow: visible;
}

.ghost {
  position: absolute;
  top: 0;
  left: 0;
  width: 334rpx;
  height: 334rpx;
  animation: ghost-float-across 6.8s linear infinite;
  transform-origin: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 232rpx;
}

.loader-icon {
  width: 114rpx;
  height: 114rpx;
  animation: loader-spin 2.6s cubic-bezier(0.28, 0.72, 0.36, 1) infinite;
  transform-origin: center;
}

.loading-text {
  margin-top: 18rpx;
  color: rgba(33, 33, 33, 1);
  font-size: 26rpx;
  line-height: 36rpx;
  text-align: center;
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }

  96% {
    transform: rotate(480deg);
  }

  100% {
    transform: rotate(480deg);
  }
}

@keyframes ghost-float-across {
  0% {
    transform: translate3d(208rpx, 0, 0) rotate(-5deg);
  }

  24% {
    transform: translate3d(-54rpx, 157rpx, 0) rotate(7deg);
  }

  41.99% {
    transform: translate3d(-390rpx, 58rpx, 0) rotate(-8deg);
  }

  42% {
    transform: translate3d(850rpx, 75rpx, 0) rotate(-6deg);
  }

  63% {
    transform: translate3d(517rpx, 173rpx, 0) rotate(8deg);
  }

  100% {
    transform: translate3d(208rpx, 0, 0) rotate(-5deg);
  }
}
</style>
