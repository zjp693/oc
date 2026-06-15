<template>
  <view class="system-message-detail-page">
    <AppTopBar title="系统消息" inline-padding="30rpx" />

    <view class="system-message-detail-page__body">
      <scroll-view class="system-message-detail-page__scroll" scroll-y>
        <view class="system-message-detail-page__content">
          <text class="system-message-detail-page__title">{{ message.title }}</text>
          <text class="system-message-detail-page__text">{{ message.content }}</text>
          <text class="system-message-detail-page__time">{{ message.date }}&nbsp;&nbsp;{{ message.time }}</text>
        </view>
      </scroll-view>
    </view>

    <view class="system-message-detail-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'

const contentText = Array.from({ length: 210 }, () => '内容').join('')

const message = {
  title: '标题标题标题标题',
  content: contentText,
  date: '2026.12.12',
  time: '12:12:12'
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.system-message-detail-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.system-message-detail-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.system-message-detail-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.system-message-detail-page__content {
  min-height: 100%;
  padding: 16rpx 0 calc(126rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.system-message-detail-page__title {
  color: #333333;
  font-size: 34rpx;
  line-height: 46rpx;
  font-weight: 500;
}

.system-message-detail-page__text {
  margin-top: 14rpx;
  color: #333333;
  font-size: 34rpx;
  line-height: 46rpx;
  word-break: break-all;
}

.system-message-detail-page__time {
  align-self: flex-end;
  margin-top: auto;
  padding-top: 22rpx;
  color: #999999;
  font-size: 26rpx;
  line-height: 36rpx;
  white-space: nowrap;
}

.system-message-detail-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}
</style>
