<template>
  <view class="chat-settings-page" :class="`chat-settings-page--${conversationType}`">
    <AppTopBar title="设置对话" inline-padding="30rpx" />

    <view class="chat-settings-page__body">
      <view class="chat-settings-profile">
        <view class="chat-settings-profile__avatar" :class="`chat-settings-profile__avatar--${conversationType}`">
          <view class="chat-settings-profile__avatar-inner">
            <image
              v-if="profile.avatarUrl"
              class="chat-settings-profile__avatar-image"
              :src="profile.avatarUrl"
              mode="aspectFill"
            />
            <text v-else-if="profile.avatarMark" class="chat-settings-profile__avatar-mark">
              {{ profile.avatarMark }}
            </text>
            <wd-icon v-else name="image" size="30rpx" color="#8aa1ac" />
          </view>
        </view>
        <text class="chat-settings-profile__name">{{ profile.name }}</text>
      </view>

      <view class="chat-settings-panel">
        <view class="chat-settings-row">
          <text class="chat-settings-row__label">消息免打扰</text>
          <wd-switch
            v-model="muted"
            size="20px"
            active-color="#ff667a"
            inactive-color="#d8d8d8"
          />
        </view>
        <view class="chat-settings-panel__divider"></view>
        <view class="chat-settings-row">
          <text class="chat-settings-row__label">置顶聊天</text>
          <wd-switch
            v-model="pinned"
            size="20px"
            active-color="#ff667a"
            inactive-color="#d8d8d8"
          />
        </view>
      </view>

      <template v-if="conversationType === 'oc'">
        <button class="chat-settings-action" hover-class="button-hover" @click="handleClearMessages">
          清空聊天记录
        </button>
        <button class="chat-settings-action" hover-class="button-hover" @click="handleCloseConversation">
          彻底关闭对话
        </button>
      </template>
    </view>

    <view class="chat-settings-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import type { MessageConversationType } from '@/types/message'

const conversationType = ref<MessageConversationType>('user')
const muted = ref(false)
const pinned = ref(false)

const profile = computed(() => {
  if (conversationType.value === 'oc') {
    return {
      name: 'OC昵称昵称',
      avatarUrl: '',
      avatarMark: ''
    }
  }

  return {
    name: '用户昵称昵称',
    avatarUrl: '',
    avatarMark: '▧'
  }
})

onLoad((query) => {
  const type = query?.type
  if (type === 'oc' || type === 'user') {
    conversationType.value = type
  }
})

function handleClearMessages() {
  uni.showToast({
    title: '清空聊天记录待接入',
    icon: 'none'
  })
}

function handleCloseConversation() {
  uni.showToast({
    title: '关闭对话待接入',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.chat-settings-page {
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.chat-settings-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 19rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.chat-settings-page--oc .chat-settings-page__body {
  padding: 0 36rpx calc(128rpx + env(safe-area-inset-bottom));
}

.chat-settings-profile {
  margin-top: 18rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-settings-page--oc .chat-settings-profile {
  margin-top: 18rpx;
}

.chat-settings-profile__avatar {
  border: 2rpx solid rgba(51, 51, 51, 0.14);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.28);
}

.chat-settings-page--oc .chat-settings-profile__avatar {
  border-color: rgba(51, 51, 51, 0.22);
  background: rgba(255, 255, 255, 0.18);
}

.chat-settings-profile__avatar--oc {
  border-radius: 0;
}

.chat-settings-profile__avatar--user {
  border-radius: 0;
}

.chat-settings-profile__avatar-inner {
  width: 127rpx;
  height: 127rpx;
  margin: 12rpx;
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
}

.chat-settings-page--oc .chat-settings-profile__avatar-inner {
  border: 0;
}

.chat-settings-profile__avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.chat-settings-profile__avatar-mark {
  color: rgba(115, 138, 150, 0.82);
  font-size: 24rpx;
  line-height: 32rpx;
}

.chat-settings-profile__name {
  margin-top: 22rpx;
  max-width: 420rpx;
  color: #333333;
  font-size: 34rpx;
  line-height: 44rpx;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-settings-page--oc .chat-settings-profile__name {
  margin-top: 28rpx;
  max-width: 460rpx;
  font-size: 32rpx;
  line-height: 44rpx;
}

.chat-settings-panel {
  margin-top: 38rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
}

.chat-settings-page--oc .chat-settings-panel {
  margin-top: 38rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.92);
}

.chat-settings-row {
  height: 74rpx;
  padding: 0 22rpx 0 28rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.chat-settings-page--oc .chat-settings-row {
  height: 78rpx;
  padding: 0 26rpx;
}

.chat-settings-row__label {
  color: #333333;
  font-size: 30rpx;
  line-height: 40rpx;
  white-space: nowrap;
}

.chat-settings-panel__divider {
  height: 1rpx;
  margin-left: 28rpx;
  background: rgba(229, 229, 229, 0.86);
}

.chat-settings-page--oc .chat-settings-panel__divider {
  margin-left: 26rpx;
}

.chat-settings-action {
  width: 100%;
  height: 82rpx;
  margin: 18rpx 0 0;
  padding: 0 26rpx;
  border-radius: 16rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #999999;
  font-size: 30rpx;
  line-height: 82rpx;
  background: rgba(255, 255, 255, 0.92);
}

.chat-settings-action::after {
  border: 0;
}

.chat-settings-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

.button-hover {
  opacity: 0.82;
}
</style>
