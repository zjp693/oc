<template>
  <view class="message-item" @click="emit('click')">
    <view class="message-item__icon" :class="`message-item__icon--${iconType}`">
      <image v-if="iconType === 'follow'" class="message-item__icon-image" src="/static/message/icon-follow.png" mode="aspectFit" />
      <image v-else-if="iconType === 'system'" class="message-item__icon-image" src="/static/message/icon-system.png" mode="aspectFit" />
      <view v-else class="message-item__image-placeholder">
        <view class="message-item__image-mountain"></view>
      </view>
    </view>

    <view class="message-item__content">
      <text class="message-item__title">{{ title }}</text>
      <text class="message-item__summary">{{ summary }}</text>
    </view>

    <view class="message-item__meta">
      <text class="message-item__date">{{ date }}</text>
      <text v-if="unread" class="message-item__unread">{{ unreadText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type MessageIconType = 'follow' | 'system' | 'user' | 'oc'

const props = withDefaults(
  defineProps<{
    title: string
    summary: string
    date: string
    unread?: number
    iconType?: MessageIconType
  }>(),
  {
    unread: 0,
    iconType: 'oc'
  }
)

const emit = defineEmits<{
  (event: 'click'): void
}>()

const unreadText = computed(() => (props.unread > 99 ? '99' : String(props.unread)))
</script>

<style scoped lang="scss">
.message-item {
  width: 100%;
  min-height: 134rpx;
  padding: 18rpx 0rpx 18rpx 0rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 18rpx;
  -webkit-tap-highlight-color: transparent;
}

.message-item__icon {
  position: relative;
  flex: 0 0 104rpx;
  width: 105rpx;
  height: 105rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-item__icon--follow {
  background: transparent;
}

.message-item__icon--system {
  background: transparent;
}

.message-item__icon--user {
  background: #e7e7e7;
}

.message-item__icon--oc {
  background: #e7e7e7;
}

.message-item__icon-image {
  width: 105rpx;
  height: 105rpx;
}

.message-item__image-placeholder {
  position: relative;
  width: 22rpx;
  height: 22rpx;
  border: 4rpx solid #8aa0aa;
  border-radius: 4rpx;
  box-sizing: border-box;
}

.message-item__image-placeholder::before {
  content: "";
  position: absolute;
  right: 3rpx;
  top: 3rpx;
  width: 4rpx;
  height: 4rpx;
  border-radius: 50%;
  background: #8aa0aa;
}

.message-item__image-mountain {
  position: absolute;
  left: 3rpx;
  bottom: 3rpx;
  width: 12rpx;
  height: 8rpx;
  border-left: 4rpx solid #8aa0aa;
  border-bottom: 4rpx solid #8aa0aa;
  transform: skewX(-28deg);
}

.message-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-item__title {
  color: #3b3b3b;
  font-size: 34rpx;
  line-height: 44rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-item__summary {
  margin-top: 6rpx;
  color: #969696;
  font-size: 30rpx;
  line-height: 38rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-item__meta {
  align-self: stretch;
  flex: 0 0 142rpx;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.message-item__date {
  color: #999;
  font-size: 30rpx;
  line-height: 38rpx;
  white-space: nowrap;
}

.message-item__unread {
  width: 38rpx;
  height: 38rpx;
  margin-top: 14rpx;
  padding: 0 7rpx;
  border-radius: 999rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 23rpx;
  line-height: 32rpx;
  font-weight: 600;
  background: #ff667a;
}
</style>
