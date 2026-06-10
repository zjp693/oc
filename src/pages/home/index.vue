<template>
  <view class="home-page">
    <view class="desktop-page">
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
          <view v-for="item in desktopItems" :key="item.id" class="app-entry" @click="handleDesktopItem(item)">
            <view class="app-icon">
              <image v-if="item.icon" class="app-icon__image" :src="item.icon" mode="aspectFit" />
            </view>
            <text class="app-label">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <view class="desktop-page__indicator">
        <view class="desktop-page__dot"></view>
      </view>

      <view class="desktop-dock">
        <view v-for="item in dockItems" :key="item.id" class="desktop-dock__item" @click="handleDesktopItem(item)">
          <image class="desktop-dock__icon" :src="item.icon" mode="aspectFit" />
          <!-- <view v-if="item.badge" class="desktop-dock__badge"></view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import AppTopBar from '@/components/common/AppTopBar.vue'

interface DesktopEntry {
  id: string
  title: string
  icon?: string
  url?: string
  badge?: boolean
}

const desktopItems: DesktopEntry[] = [
  { id: 'oc', title: 'OC', icon: '/static/home/icon-oc.png', url: '/pages/oc/index' },
  { id: 'worldview', title: '世界观', icon: '/static/home/icon-world.png', url: '/pages/worldview/index' },
  { id: 'manuscript', title: '文稿', icon: '/static/home/icon-doc.png', url: '/pages/manuscript/index' },
  { id: 'moments', title: '朋友圈', icon: '/static/phone/icon-moments-lens.png', url: '/pages/moments/index?scene=user' },
  ...Array.from({ length: 12 }, (_, index) => ({ id: `placeholder-${index}`, title: '名称' }))
]

const dockItems: DesktopEntry[] = [
  { id: 'phone', title: '查手机', icon: '/static/home/icon-iphone.png', url: '/pages/check-phone/index' },
  { id: 'message', title: '消息', icon: '/static/home/icon-message.png', url: '/pages/message/index', badge: true },
  { id: 'mall', title: '商城', icon: '/static/home/icon-mall.png', url: '/pages/avatar/index?mode=mall&tab=hot&entry=dock' },
  { id: 'settings', title: '设置', icon: '/static/home/icon-settings.png' }
]

function handleAvatarDetail() {
  uni.navigateTo({
    url: '/pages/avatar/index'
  })
}

function handleDesktopItem(item: DesktopEntry) {
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
  padding-bottom: calc(174rpx + env(safe-area-inset-bottom));
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
  z-index: 20;
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
  z-index: 1;
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
  grid-template-columns: repeat(4, 123rpx);
  justify-content: space-between;
  row-gap: 36rpx;
  margin-top: 44rpx;
}

.app-entry {
  width: 123rpx;
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
  width: 45rpx;
  height: 45rpx;
}

.app-label {
  margin-top: 10rpx;
  color: #333;
  font-size: 23rpx;
  line-height: 28rpx;
  text-align: center;
}

.desktop-page__indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(222rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.desktop-page__dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.92);
}

.desktop-dock {
  position: absolute;
  left: 38rpx;
  right: 38rpx;
  bottom: calc(88rpx + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(4, 123rpx);
  justify-content: space-between;
}

.desktop-dock__item {
  position: relative;
  width: 123rpx;
  height: 123rpx;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
}

.desktop-dock__icon {
  width: 45rpx;
  height: 45rpx;
}

.desktop-dock__badge {
  position: absolute;
  top: 26rpx;
  right: 26rpx;
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #ff667a;
}

</style>
