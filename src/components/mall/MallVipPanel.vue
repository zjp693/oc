<template>
  <view class="mall-vip-panel">
    <text class="mall-vip-panel__status">{{ statusText }}</text>
    <view class="mall-vip-panel__rewards">
      <view v-for="item in rewards" :key="item.label" class="mall-vip-reward">
        <text class="mall-vip-reward__label">{{ item.label }}</text>
        <MallCurrencyIcon :type="item.currency" size="75rpx" />
        <text class="mall-vip-reward__value">{{ item.value }}</text>
      </view>
    </view>
    <view class="mall-vip-panel__benefits">
      <view v-for="item in benefits" :key="item" class="mall-vip-panel__benefit">
        <text>{{ item }}</text>
      </view>
    </view>
    <MallBuyButton class="mall-vip-panel__button" placement="inline" :label="buttonLabel" @click="emit('buy')" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MallCurrencyIcon from './MallCurrencyIcon.vue'
import MallBuyButton from './MallBuyButton.vue'

export interface MallVipReward {
  label: string
  value: string
  currency: 'diamond' | 'star'
}

const props = defineProps<{
  rewards: MallVipReward[]
  benefits: string[]
  expiresAt?: string
}>()

const emit = defineEmits<{
  (event: 'buy'): void
}>()

const statusText = computed(() => (
  props.expiresAt ? `VIP到期时间：${props.expiresAt}` : '暂未激活VIP权限'
))
const buttonLabel = computed(() => (props.expiresAt ? '续费' : '购买月卡 ¥16'))
</script>

<style scoped lang="scss">
.mall-vip-panel {
  width: 705rpx;
  max-width: 100%;
  height: 904rpx;
  margin: 0 auto;
  padding: 52rpx 0rpx 64rpx;
  border-radius: 28rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666666;
  font-size: 26rpx;
  line-height: 37rpx;
  background: linear-gradient(
    0.23deg,
    rgba(255, 255, 255, 0.1) 1.2%,
    rgba(255, 255, 255, 0.5) 100.4%
  );
}

.mall-vip-panel__status {
  color: #999999;
}

.mall-vip-panel__rewards {
  width: 100%;
  margin-top: 50rpx;
  padding: 0 19rpx;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 205rpx);
  column-gap: 15rpx;
}

.mall-vip-reward {
  width: 205rpx;
  height: 205rpx;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 22rpx;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.mall-vip-reward__label {
  color: #333333;
  font-size: 26rpx;
  line-height: 36rpx;
}

.mall-vip-reward :deep(.mall-currency-icon) {
  margin-top: 12rpx;
}

.mall-vip-reward__value {
  margin-top: 10rpx;
  color: #ff667a;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 600;
}

.mall-vip-panel__benefits {
  margin-top: 72rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
}

.mall-vip-panel__benefit {
  width: calc(100% - 67rpx);
  height: 104rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 26rpx;
  line-height: 104rpx;
  border-radius: 0 0 19rpx 19rpx;
  background: linear-gradient(
    90.69deg,
    rgba(255, 255, 255, 0) 1.06%,
    rgba(255, 255, 255, 0.5) 32.59%,
    rgba(255, 255, 255, 0.5) 69.04%,
    rgba(255, 255, 255, 0) 99.59%
  );
}

.mall-vip-panel__button {
  width: 575rpx;
  margin-top: 56rpx;
}
</style>
