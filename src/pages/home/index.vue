<template>
  <view class="home-page">
    <view v-if="activeTab === 'desktop'" class="desktop-page">
      <AppTopBar variant="desktop" inline-padding="38rpx">
        <template #content>
          <view class="top-row">
            <text class="time-text">12:12</text>
            <view class="date-block">
              <text class="weather-text">温度 17°</text>
              <text class="date-text">12月12日 · 周日</text>
            </view>
          </view>
        </template>
      </AppTopBar>

      <view class="desktop-page__content">
        <view class="profile-card">
          <view class="avatar-box" @click="handleAvatarDetail">
            <view class="avatar-circle">
              <text class="avatar-mark">▧</text>
            </view>
          </view>
          <text class="user-name">User Name</text>
          <text class="motto-text">"每日语录·日常记录·随意更改·有字数限制"</text>
        </view>

        <view class="app-grid">
          <view v-for="item in desktopItems" :key="item.title" class="app-entry" @click="handleDesktopItem(item)">
            <view class="app-icon">
              <image class="app-icon__image" :src="item.icon" mode="aspectFit" />
            </view>
            <text class="app-label">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="tab-placeholder">
      <AppTopBar variant="plain" :title="currentTabTitle" inline-padding="40rpx" />
      <view class="tab-placeholder__content">
        <text class="placeholder-desc">内容区域待接入。</text>
      </view>
    </view>

    <AppTabBar v-model="activeTab" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppTabBar from '@/components/AppTabBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'

type TabKey = 'desktop' | 'chat' | 'message' | 'profile'

const activeTab = ref<TabKey>('desktop')
const desktopItems = [
  { title: 'OC', icon: '/static/home/icon-oc.png', url: '/pages/oc/index' },
  { title: '世界观', icon: '/static/home/icon-world.png', url: '/pages/worldview/index' },
  { title: '文稿', icon: '/static/home/icon-doc.png', url: '/pages/manuscript/index' },
  { title: '查手机', icon: '/static/home/icon-phone.png' },
  { title: '钱包', icon: '/static/home/icon-wallet.png' },
  { title: '商城', icon: '/static/home/icon-mall.png' },
  { title: '设置', icon: '/static/home/icon-settings.png' }
]

const tabTitleMap: Record<TabKey, string> = {
  desktop: '桌面',
  chat: '对话',
  message: '消息',
  profile: '主页'
}

const currentTabTitle = computed(() => tabTitleMap[activeTab.value])

function handleAvatarDetail() {
  uni.navigateTo({
    url: '/pages/avatar/index'
  })
}

function handleDesktopItem(item: { url?: string }) {
  if (!item.url) return
  uni.navigateTo({
    url: item.url
  })
}
</script>

<style scoped lang="scss">
.home-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: #f6fbff;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.desktop-page {
  min-height: 100vh;
  padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.desktop-page__content {
  padding: 0 38rpx;
  box-sizing: border-box;
}

.top-row {
  width: 100%;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-text {
  color: rgba(51, 51, 51, 1);
  font-size: 72rpx;
  line-height: 72rpx;
}

.date-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.weather-text,
.date-text {
  color: #333;
  font-size: 30rpx;
  line-height: 38rpx;
}

.profile-card {
  position: relative;
  // min-height: 156rpx;
  margin-top: 34rpx;
  padding: 75rpx 21rpx 34rpx;
  border-radius: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
}

.avatar-box {
  position: absolute;
  top: -104rpx;
  left: 50%;
  width: 168rpx;
  height: 168rpx;
  transform: translateX(-50%);
  border: 2rpx solid rgba(51, 51, 51, 0.14);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.3);
}

.avatar-circle {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(217, 217, 217, 1);
}

.avatar-mark {
  color: rgba(115, 138, 150, 0.9);
  font-size: 24rpx;
  line-height: 32rpx;
}

.user-name {
  color: rgba(51, 51, 51, 1);
  font-size: 40rpx;
  line-height: 56rpx;
  font-weight: 500;
  text-align: center;
}

.motto-text {
  margin-top: 14rpx;
  color: rgba(51, 51, 51, 1);
  font-size: 30rpx;
  line-height: 46rpx;
  text-align: center;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 132rpx);
  justify-content: space-between;
  row-gap: 42rpx;
  margin-top: 55rpx;
}

.app-entry {
  width: 132rpx;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-icon {
  width: 123rpx;
  height: 123rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.app-icon__image {
  width: 44rpx;
  height: 44rpx;
}

.app-label {
  margin-top: 12rpx;
  color: #333;
  font-size: 20rpx;
  line-height: 40rpx;
  text-align: center;
}

.tab-placeholder {
  min-height: 100vh;
  padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.tab-placeholder__content {
  padding: 18rpx 40rpx 0;
  box-sizing: border-box;
}

.placeholder-desc {
  margin-top: 18rpx;
  color: rgba(51, 51, 51, 0.68);
  font-size: 26rpx;
  line-height: 38rpx;
}

@media screen and (min-width: 600px) {
  .home-page {
    max-width: 402px;
    min-height: 874px;
    margin: 0 auto;
  }
}
</style>
