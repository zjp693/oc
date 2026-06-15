<template>
  <view class="system-message-page">
    <AppTopBar title="系统消息" inline-padding="30rpx" />

    <view class="system-message-page__body">
      <scroll-view class="system-message-page__scroll" scroll-y>
        <view class="system-message-page__list">
          <view
            v-for="item in systemMessages"
            :key="item.id"
            class="system-message-card"
            @click="handleOpenDetail(item.id)"
          >
            <view class="system-message-card__meta">
              <text class="system-message-card__source">系统消息</text>
              <text class="system-message-card__time">{{ item.date }}&nbsp;&nbsp;{{ item.time }}</text>
            </view>

            <text class="system-message-card__title">{{ item.title }}</text>
            <text class="system-message-card__summary">{{ item.summary }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="system-message-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'

interface SystemMessage {
  id: number
  title: string
  summary: string
  date: string
  time: string
}

const summaryText = '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'

const systemMessages: SystemMessage[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: '内容标题标题',
  summary: summaryText,
  date: '2026.12.12',
  time: '12:12:12'
}))

function handleOpenDetail(id: number) {
  uni.navigateTo({
    url: `/pages/system-message-detail/index?id=${id}`
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.system-message-page {
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

.system-message-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.system-message-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.system-message-page__list {
  padding: 14rpx 0 calc(124rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.system-message-card {
  padding: 20rpx 0rpx 24rpx;
  box-sizing: border-box;
  border-bottom: 2rpx solid rgba(229, 229, 229, 0.86);
  -webkit-tap-highlight-color: transparent;
}

.system-message-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.system-message-card__source,
.system-message-card__time {
  color: #888888;
  font-size: 26rpx;
  line-height: 36rpx;
  white-space: nowrap;
}

.system-message-card__title {
  margin-top: 24rpx;
  display: block;
  color: #333333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.system-message-card__summary {
  margin-top: 12rpx;
  display: -webkit-box;
  color: #333333;
  font-size: 30rpx;
  line-height: 34rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.system-message-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}
</style>
