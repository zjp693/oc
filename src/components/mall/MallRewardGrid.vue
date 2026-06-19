<template>
  <view class="mall-reward-grid" :class="{ 'mall-reward-grid--single': rewards.length === 1 }">
    <view v-for="item in rewards" :key="item.label" class="mall-reward-card">
      <text class="mall-reward-card__label">{{ item.label }}</text>
      <MallCurrencyIcon :type="item.currency" size="75rpx" />
      <text class="mall-reward-card__value" :class="{ 'mall-reward-card__value--highlight': item.highlight }">
        {{ item.value }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import MallCurrencyIcon from './MallCurrencyIcon.vue'

export interface MallRewardItem {
  label: string
  value: string
  currency: 'diamond' | 'star'
  highlight?: boolean
}

defineProps<{
  rewards: MallRewardItem[]
}>()
</script>

<style scoped lang="scss">
.mall-reward-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 205rpx);
  justify-content: center;
  column-gap: 15rpx;
}

.mall-reward-grid--single {
  grid-template-columns: 205rpx;
}

.mall-reward-card {
  width: 205rpx;
  height: 205rpx;
  min-width: 0;
  padding: 18rpx 0 16rpx;
  border-radius: 22rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.mall-reward-card__label {
  color: #333333;
  font-size: 26rpx;
  line-height: 36rpx;
  white-space: nowrap;
}

.mall-reward-card :deep(.mall-currency-icon) {
  margin-top: 12rpx;
}

.mall-reward-card__value {
  margin-top: 10rpx;
  color: #ff667a;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 600;
  white-space: nowrap;
}

.mall-reward-card__value--highlight {
  font-weight: 700;
}
</style>
