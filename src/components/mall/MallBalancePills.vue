<template>
  <view class="mall-balance-pills">
    <view class="mall-balance-pill mall-balance-pill--diamond">
      <MallCurrencyIcon type="diamond" size="56rpx" />
      <view class="mall-balance-pill__body">
        <text class="mall-balance-pill__text">{{ diamondText }}</text>
        <view class="mall-balance-pill__side-space"></view>
      </view>
    </view>
    <view class="mall-balance-pill mall-balance-pill--star">
      <MallCurrencyIcon type="star" size="56rpx" />
      <view class="mall-balance-pill__body">
        <text class="mall-balance-pill__text">{{ starText }}</text>
        <image class="mall-balance-pill__plus" src="/static/mall/icon-plus.png" mode="aspectFit" @click.stop="emit('exchange')" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MallCurrencyIcon from './MallCurrencyIcon.vue'

const props = defineProps<{
  diamond: number
  star: number
}>()

const emit = defineEmits<{
  (event: 'exchange'): void
}>()

const diamondText = computed(() => formatAmount(props.diamond))
const starText = computed(() => formatAmount(props.star))

function formatAmount(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(value % 1000 ? 2 : 0)}k` : String(value)
}
</script>

<style scoped lang="scss">
.mall-balance-pills {
  display: flex;
  align-items: center;
  gap: 30rpx;
  overflow: visible;
}

.mall-balance-pill {
  position: relative;
  width: 160rpx;
  height: 50rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow: visible;
}

.mall-balance-pill--star {
  width: 183rpx;
}

.mall-balance-pill :deep(.mall-currency-icon) {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 50%;
  transform: translateY(-50%) !important;
}

.mall-balance-pill--diamond :deep(.mall-currency-icon) {
  left: 8rpx;
}

.mall-balance-pill__body {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 127rpx;
  z-index: 1;
  padding: 0 12rpx 0 32rpx;
  border-radius: 34rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8rpx;
  color: #fff;
  font-size: 27rpx;
  line-height: 37rpx;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.mall-balance-pill__text {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-weight: 700;
  font-style: italic;
  line-height: 50rpx;
  transform: skewX(-6deg);
}

.mall-balance-pill--star .mall-balance-pill__body {
  width: 159rpx;
  background-image: url('/static/mall/balance-star-bg.png');
}

.mall-balance-pill--diamond .mall-balance-pill__body {
  width: 131rpx;
  padding-left: 40rpx;
  background-image: url('/static/mall/balance-diamond-bg.png');
}

.mall-balance-pill__plus {
  width: 37rpx;
  height: 37rpx;
}

.mall-balance-pill__side-space {
  width: 1rpx;
  height: 1rpx;
}

.mall-balance-pill__plus {
  padding: 7rpx;
  box-sizing: border-box;
  background-image: url('/static/mall/balance-plus-circle.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
</style>
