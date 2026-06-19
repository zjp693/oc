<template>
  <view class="profile-stats-bar" :class="`profile-stats-bar--${mode}`">
    <view class="profile-stats-bar__items">
      <view
        v-for="item in items"
        :key="item.label"
        class="profile-stats-bar__item"
        @click="emit('stat-click', item)"
      >
        <text class="profile-stats-bar__value">{{ item.value }}</text>
        <text class="profile-stats-bar__label">{{ item.label }}</text>
      </view>
    </view>

    <view v-if="mode === 'other'" class="profile-stats-bar__actions">
      <view
        class="profile-stats-bar__follow"
        :class="{ 'profile-stats-bar__follow--active': followed }"
        hover-class="button-hover"
        @click.stop="emit('follow')"
      >
        {{ followed ? '已关注' : '关注' }}
      </view>
      <view class="profile-stats-bar__chat" hover-class="button-hover" @click.stop="emit('chat')">
        <image class="profile-stats-bar__chat-icon" src="/static/profile/icon-chat-action.png" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface ProfileStatItem {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    mode?: 'self' | 'other'
    items: ProfileStatItem[]
    followed?: boolean
  }>(),
  {
    mode: 'self',
    followed: false
  }
)

const emit = defineEmits<{
  (event: 'follow'): void
  (event: 'chat'): void
  (event: 'stat-click', item: ProfileStatItem): void
}>()
</script>

<style scoped lang="scss">
.profile-stats-bar {
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 24rpx;

  &--other {
    .profile-stats-bar__items {
      flex: 1;
      gap: 40rpx;
    }
  }

  &__items {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 48rpx;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333333;
  }

  &__value {
    font-size: 34rpx;
    line-height: 38rpx;
    font-weight: 400;
  }

  &__label {
    margin-top: 2rpx;
    font-size: 26rpx;
    line-height: 32rpx;
  }

  &__actions {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  &__follow {
    flex: 0 0 160rpx;
    width: 160rpx;
    height: 72rpx;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 2rpx solid transparent;
    border-radius: 999rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 26rpx;
    line-height: 1;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    word-break: keep-all;
    background: #ff667a;

    &--active {
      flex-basis: 160rpx;
      width: 160rpx;
      height: 72rpx;
      padding: 0;
      color: #CECECE;
      border: 1px solid rgba(206, 206, 206, 0.8);
      background: transparent;
    }
  }

  &__chat {
    margin: 0;
    padding: 11.64rpx 35rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(108,108,108,0.1);
    border: 1pt solid rgba(255,255,255,0.8);
  }

  &__chat-icon {
    width: 45rpx;
    height: 45rpx;
  }
}

.button-hover {
  opacity: 0.86;
}
</style>
