<template>
  <view
    class="avatar-frame-card"
    :class="{
      'avatar-frame-card--active': selected,
      'avatar-frame-card--mall': mode === 'mall'
    }"
    @click="emit('select', item.id)"
  >
    <view class="avatar-frame-card__thumb">
      <view class="avatar-frame-card__inner">
        <wd-icon name="image" size="24rpx" color="#8aa1ac" />
      </view>
      <text v-if="item.badge" class="avatar-frame-card__badge"></text>
    </view>
    <text class="avatar-frame-card__name">{{ item.name }}</text>
    <view v-if="mode === 'mall'" class="avatar-frame-card__price">
      <template v-if="item.free">
        <text class="avatar-frame-card__price-free">免费</text>
      </template>
      <template v-else-if="item.owned">
        <text class="avatar-frame-card__price-owned">已拥有</text>
      </template>
      <template v-else>
        <MallCurrencyIcon :type="item.currency || 'diamond'" size="28rpx" />
        <text class="avatar-frame-card__price-value">{{ item.price }}</text>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import MallCurrencyIcon from '@/components/mall/MallCurrencyIcon.vue'

export interface AvatarFrameItem {
  id: number
  name: string
  price?: number
  currency?: 'diamond' | 'star'
  free?: boolean
  owned?: boolean
  badge?: boolean
}

defineProps<{
  item: AvatarFrameItem
  selected?: boolean
  mode?: 'owned' | 'mall'
}>()

const emit = defineEmits<{
  (event: 'select', id: number): void
}>()
</script>

<style scoped lang="scss">
.avatar-frame-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-frame-card__thumb {
  position: relative;
  width: 210rpx;
  height: 210rpx;
  border-radius: 38rpx;
  border: 4rpx solid transparent;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(244, 244, 244, 0.78);
}

.avatar-frame-card--active .avatar-frame-card__thumb {
  border-color: rgba(255, 86, 116, 1);
}

.avatar-frame-card__inner {
  width: 168rpx;
  height: 168rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(229, 229, 229, 1);
}

.avatar-frame-card__badge {
  position: absolute;
  top: 10rpx;
  right: 9rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ff667a;
}

.avatar-frame-card__name {
  margin-top: 10rpx;
  max-width: 210rpx;
  color: rgba(79, 79, 79, 1);
  font-size: 26rpx;
  line-height: 40rpx;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatar-frame-card__price {
  height: 32rpx;
  margin-top: 1rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: #ff667a;
  font-size: 26rpx;
  line-height: 32rpx;
  font-weight: 600;
}

.avatar-frame-card__price-free {
  color: #ff667a;
}

.avatar-frame-card__price-owned {
  color: #999999;
}

</style>
