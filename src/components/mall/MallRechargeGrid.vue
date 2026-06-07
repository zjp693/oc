<template>
  <view class="mall-recharge-panel">
    <view class="mall-recharge-grid">
      <view
        v-for="item in items"
        :key="item.id"
        class="mall-recharge-card"
        @click="emit('select', item.id)"
      >
        <view class="mall-recharge-card__bonus">
          <text>额外</text>
          <text>+{{ item.bonus }}</text>
          <MallCurrencyIcon type="star" size="24rpx" />
        </view>
        <image
          class="mall-recharge-card__diamond"
          :class="`mall-recharge-card__diamond--${item.price}`"
          :src="getDiamondImage(item)"
          mode="aspectFit"
        />
        <text class="mall-recharge-card__amount">{{ item.amount }}星钻</text>
        <text class="mall-recharge-card__price">{{ item.price }}元</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import MallCurrencyIcon from './MallCurrencyIcon.vue'

export interface MallRechargeItem {
  id: number
  amount: number
  bonus: number
  price: number
  stack: number
}

defineProps<{
  items: MallRechargeItem[]
  selectedId: number
}>()

const emit = defineEmits<{
  (event: 'select', id: number): void
}>()

function getDiamondImage(item: MallRechargeItem) {
  if (item.price === 30) return '/static/mall/recharge-diamond-30.png'
  if (item.price === 98) return '/static/mall/recharge-diamond-98.png'
  return '/static/mall/icon-diamond.png'
}
</script>

<style scoped lang="scss">
.mall-recharge-panel {
  width: 705rpx;
  max-width: 100%;
  height: 904rpx;
  margin: 0 auto;
  padding: 52rpx 0 64rpx;
  border-radius: 28rpx;
  box-sizing: border-box;
  background: linear-gradient(
    0.23deg,
    rgba(255, 255, 255, 0.1) 1.2%,
    rgba(255, 255, 255, 0.5) 100.4%
  );
}

.mall-recharge-grid {
  display: grid;
  grid-template-columns: repeat(3, 205rpx);
  column-gap: 15rpx;
  padding: 0 19rpx;
  box-sizing: border-box;
}

.mall-recharge-card {
  width: 205rpx;
  height: 254rpx;
  padding: 9rpx 0 12rpx;
  border: 4rpx solid transparent;
  border-radius: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.mall-recharge-card__bonus {
  width: 187rpx;
  height: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  color: #333333;
  font-size: 22rpx;
  line-height: 45rpx;
  background-image: url('/static/mall/recharge-bonus-bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.mall-recharge-card__diamond {
  width: 56rpx;
  height: 56rpx;
  margin-top: 18rpx;
}

.mall-recharge-card__diamond--30 {
  width: 122rpx;
  height: 70rpx;
  margin-top: 11rpx;
}

.mall-recharge-card__diamond--98 {
  width: 138rpx;
  height: 70rpx;
  margin-top: 11rpx;
}

.mall-recharge-card__amount {
  margin-top: 14rpx;
  color: #333333;
  font-size: 26rpx;
  line-height: 37rpx;
}

.mall-recharge-card__price {
  margin-top: 4rpx;
  color: #ff667a;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 700;
}
</style>
