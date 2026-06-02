<template>
  <view class="message-page">
    <AppTopBar title="消息" inline-padding="30rpx">
      <template #trailing>
        <button class="message-page__menu" hover-class="button-hover" @click.stop="handleMenu">
          <image class="message-page__menu-icon" src="/static/message/icon-application-menu.png" mode="aspectFit" />
        </button>
      </template>
    </AppTopBar>

    <view v-if="menuOpen" class="message-page__menu-mask" @click="closeMenu"></view>
    <view v-if="menuOpen" class="message-page__popover" @click.stop>
      <button class="message-page__popover-item" hover-class="button-hover" @click="handleMarkAllRead">
        <image class="message-page__popover-icon" src="/static/message/icon-all-read.png" mode="aspectFit" />
        <text>全部已读</text>
      </button>
      <view class="message-page__popover-divider"></view>
      <button class="message-page__popover-item" hover-class="button-hover" @click="handleFollowFriends">
        <image class="message-page__popover-icon" src="/static/message/icon-follow-friend.png" mode="aspectFit" />
        <text>关注新朋友</text>
      </button>
    </view>

    <view class="message-page__body">
      <MessageList :items="displayMessages" @item-click="handleMessageClick" />
    </view>

    <view class="message-page__bottom">
      <BottomSwitchBar
        :model-value="activeTab"
        :options="bottomOptions"
        @change="handleBottomChange"
        @back="handleBack"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import MessageList from '@/components/message/MessageList.vue'
import type { MessageListItem } from '@/types/message'

type MessageTab = 'all' | 'oc'

interface BottomOption {
  label: string
  value: MessageTab
  dot?: boolean
}

const activeTab = ref<MessageTab>('all')
const menuOpen = ref(false)

const bottomOptions: BottomOption[] = [
  { label: '全部消息', value: 'all', dot: true },
  { label: 'OC对话', value: 'oc', dot: true }
]

const messages = ref<MessageListItem[]>([
  {
    id: 'follow',
    title: '新的关注',
    summary: '最新的一条通知',
    date: '2026/02/02',
    unread: 99,
    iconType: 'follow'
  },
  {
    id: 'system',
    title: '系统消息',
    summary: '最新的一条通知',
    date: '2026/02/02',
    unread: 1,
    iconType: 'system'
  },
  ...Array.from({ length: 4 }, (_, index) => ({
    id: `user-${index}`,
    title: '用户昵称昵称',
    summary: '最新的一条消息消息消息消息消息消息消息消息消息',
    date: '2026/02/02',
    unread: index === 0 ? 1 : 99,
    iconType: 'user' as const,
    conversationType: 'user' as const
  })),
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `oc-${index}`,
    title: 'OC昵称昵称',
    summary: '最新的一条消息消息消息消息消息消息消息消息消息',
    date: '2026/02/02',
    unread: 99,
    iconType: 'oc' as const,
    conversationType: 'oc' as const
  }))
])

const displayMessages = computed(() => {
  if (activeTab.value === 'oc') {
    return messages.value.filter((item) => item.conversationType === 'oc')
  }
  return messages.value
})

function handleBottomChange(value: string) {
  activeTab.value = value as MessageTab
  closeMenu()
}

function handleMessageClick(item: MessageListItem) {
  closeMenu()

  if (item.iconType === 'follow') {
    uni.navigateTo({
      url: '/pages/follow/index'
    })
    return
  }

  if (item.iconType === 'system') {
    uni.navigateTo({
      url: '/pages/system-message/index'
    })
    return
  }

  if (item.conversationType) {
    uni.navigateTo({
      url: `/pages/chat/index?id=${item.id}&type=${item.conversationType}`
    })
  }
}

function handleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function handleMarkAllRead() {
  messages.value = messages.value.map((item) => {
    if (activeTab.value === 'oc' && item.conversationType !== 'oc') return item
    return { ...item, unread: 0 }
  })
  closeMenu()
}

function handleFollowFriends() {
  closeMenu()
  uni.navigateTo({
    url: '/pages/follow-friend/index'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.message-page {
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

.message-page__menu {
  position: relative;
  width: 58rpx;
  height: 58rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.message-page__menu::after {
  border: 0;
}

.message-page__menu-icon {
  width: 41rpx;
  height: 41rpx;
}

.message-page__menu-mask {
  position: absolute;
  z-index: 19;
  inset: 0;
  background: transparent;
}

.message-page__popover {
  position: absolute;
  z-index: 20;
  top: calc(var(--status-bar-height) + 104rpx);
  right: 38rpx;
  width: 268rpx;
  padding: 8rpx 0;
  border-radius: 16rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.16);
}

.message-page__popover-item {
  width: 100%;
  height: 78rpx;
  margin: 0;
  padding: 0 26rpx;
  border-radius: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 18rpx;
  color: #333333;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 500;
  background: transparent;
}

.message-page__popover-item::after {
  border: 0;
}

.message-page__popover-icon {
  flex: 0 0 40rpx;
  width: 40rpx;
  height: 40rpx;
}

.message-page__popover-divider {
  height: 1rpx;
  margin-left: 72rpx;
  background: rgba(229, 229, 229, 0.96);
}

.message-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 30rpx calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.message-page__bottom {
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
