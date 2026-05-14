<template>
  <view class="oc-detail-profile">
    <view class="oc-detail-profile__main">
      <view class="oc-detail-profile__avatar">
        <image v-if="avatarUrl" class="oc-detail-profile__avatar-image" :src="avatarUrl" mode="aspectFill" />
        <wd-icon v-else name="image" size="28rpx" color="#8aa1ac" />
      </view>

      <view class="oc-detail-profile__info">
        <view class="oc-detail-profile__title-row">
          <text class="oc-detail-profile__title">{{ title }}</text>
          <image class="oc-detail-profile__title-stars" src="/static/oc/icon-title-stars.png" mode="aspectFit" />
        </view>
        <view class="oc-detail-profile__meta-row">
          <text>ID 434343434</text>
          <image class="oc-detail-profile__copy" src="/static/oc/icon-copy.png" mode="aspectFit" />
          <text class="oc-detail-profile__creator">创建者：</text>
          <wd-icon name="image" size="18rpx" color="#8aa1ac" />
          <text class="oc-detail-profile__creator-name">名称名称名称...</text>
        </view>
        <view class="oc-detail-profile__thumbs">
          <view v-for="item in thumbs" :key="item.id" class="oc-detail-profile__thumb">
            <image v-if="item.url" class="oc-detail-profile__thumb-image" :src="item.url" mode="aspectFill" />
            <wd-icon v-else name="image" size="20rpx" color="#8aa1ac" />
          </view>
        </view>
      </view>
    </view>

    <view class="oc-detail-profile__stats-row">
      <view class="oc-detail-profile__stats">
        <view v-for="item in stats" :key="item.label" class="oc-detail-profile__stat">
          <text class="oc-detail-profile__stat-value">{{ item.value }}</text>
          <text class="oc-detail-profile__stat-label">{{ item.label }}</text>
        </view>
      </view>

      <view class="oc-detail-profile__actions">
        <button class="oc-detail-profile__follow" hover-class="button-hover" @click="emit('follow')">
          {{ followed ? '已关注' : '关注' }}
        </button>
        <button class="oc-detail-profile__chat" hover-class="button-hover" @click="emit('chat')">对话</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    avatarUrl?: string
    followed?: boolean
  }>(),
  {
    followed: false
  }
)

const emit = defineEmits<{
  (event: 'follow'): void
  (event: 'chat'): void
}>()

const thumbs: Array<{ id: number; url?: string }> = [
  { id: 1 },
  { id: 2 },
  { id: 3 }
]

const stats = [
  { label: '粉丝', value: 23 },
  { label: '连接', value: 23 },
  { label: '幻化值', value: 23 }
]
</script>

<style scoped lang="scss">
.oc-detail-profile {
  position: relative;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.oc-detail-profile__main {
  display: flex;
  align-items: flex-end;
}

.oc-detail-profile__avatar {
  flex: 0 0 162rpx;
  width: 162rpx;
  height: 162rpx;
  border: 2rpx solid rgba(51, 51, 51, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.58);
}

.oc-detail-profile__avatar-image {
  width: 100%;
  height: 100%;
}

.oc-detail-profile__info {
  flex: 1;
  min-width: 0;
  margin-left: 30rpx;
  padding-bottom: 4rpx;
}

.oc-detail-profile__title-row {
  display: flex;
  align-items: center;
  gap: 7rpx;
}

.oc-detail-profile__title {
  max-width: 328rpx;
  color: #333333;
  font-size: 37rpx;
  line-height: 45rpx;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-detail-profile__title-stars {
  flex: 0 0 30rpx;
  width: 30rpx;
  height: 30rpx;
}

.oc-detail-profile__meta-row {
  margin-top: 6rpx;
  display: flex;
  align-items: center;
  gap: 0;
  color: #777;
  font-size: 22rpx;
  line-height: 30rpx;
  font-weight: 400;
  white-space: nowrap;
}

.oc-detail-profile__copy {
  flex: 0 0 22rpx;
  width: 22rpx;
  height: 22rpx;
  margin-left: 7rpx;
}

.oc-detail-profile__creator {
  margin-left: 15rpx;
}

.oc-detail-profile__creator-name {
  max-width: 154rpx;
  color: #ff667a;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-detail-profile__thumbs {
  margin-top: 10rpx;
  display: flex;
  gap: 24rpx;
}

.oc-detail-profile__thumb {
  width: 75rpx;
  height: 37rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(225, 225, 225, 0.9);
}

.oc-detail-profile__thumb-image {
  width: 100%;
  height: 100%;
}

.oc-detail-profile__stats-row {
  margin-top: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oc-detail-profile__stats {
  display: flex;
  align-items: center;
  gap: 48rpx;
}

.oc-detail-profile__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.oc-detail-profile__stat-value {
  color: #333;
  font-size: 32rpx;
  line-height: 36rpx;
  font-weight: 400;
}

.oc-detail-profile__stat-label {
  margin-top: 3rpx;
  color: #333;
  font-size: 24rpx;
  line-height: 28rpx;
}

.oc-detail-profile__actions {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.oc-detail-profile__follow,
.oc-detail-profile__chat {
  width: 153rpx;
  height: 70rpx;
  margin: 0;
  padding: 0;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  line-height: 70rpx;
  font-weight: 700;
}

.oc-detail-profile__follow {
  color: #333;
  border: 2rpx solid #999;
  background: rgba(255, 255, 255, 0.72);
}

.oc-detail-profile__chat {
  color: #fff;
  border: 2rpx solid #ff667a;
  background: #ff667a;
}

.oc-detail-profile__follow::after,
.oc-detail-profile__chat::after {
  border: 0;
}

.button-hover {
  opacity: 0.82;
}
</style>
