<template>
  <view v-if="modelValue" class="mall-exchange-dialog">
    <view class="mall-exchange-dialog__box">
      <text class="mall-exchange-dialog__title">兑换星引</text>

      <view class="mall-exchange-dialog__summary">
        <view class="mall-exchange-dialog__asset">
          <MallCurrencyIcon type="diamond" size="52rpx" />
          <text>星钻</text>
        </view>
        <view class="mall-exchange-dialog__amount">
          <text class="mall-exchange-dialog__amount-label">兑换数量</text>
          <text>{{ amount }} / {{ max }}</text>
        </view>
        <view class="mall-exchange-dialog__asset">
          <MallCurrencyIcon type="star" size="52rpx" />
          <text>星引</text>
        </view>
      </view>

      <view class="mall-exchange-dialog__slider-row">
        <button class="mall-exchange-dialog__step" hover-class="button-hover" @click="decrease">-</button>
        <wd-slider
          v-model="amount"
          class="mall-exchange-dialog__slider"
          :min="0"
          :max="max"
          :step="100"
          active-color="#ff667a"
          inactive-color="#e5e5e5"
        />
        <button class="mall-exchange-dialog__step" hover-class="button-hover" @click="increase">+</button>
      </view>

      <view class="mall-exchange-dialog__actions">
        <button class="mall-exchange-dialog__cancel" hover-class="button-hover" @click="handleCancel">取消</button>
        <button class="mall-exchange-dialog__confirm" hover-class="button-hover" @click="handleConfirm">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MallCurrencyIcon from './MallCurrencyIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    max?: number
    defaultAmount?: number
  }>(),
  {
    max: 8888,
    defaultAmount: 0
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm', amount: number): void
  (event: 'cancel'): void
}>()

const amount = ref(props.defaultAmount)

watch(
  () => props.modelValue,
  (value) => {
    if (value) amount.value = props.defaultAmount
  }
)

function decrease() {
  amount.value = Math.max(0, amount.value - 100)
}

function increase() {
  amount.value = Math.min(props.max, amount.value + 100)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function handleConfirm() {
  if (amount.value <= 0) return
  emit('confirm', amount.value)
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.mall-exchange-dialog {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.mall-exchange-dialog__box {
  width: min(616rpx, calc(100vw - 134rpx));
  min-height: 482rpx;
  padding: 48rpx clamp(52rpx, 13vw, 70rpx) 56rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
}

.mall-exchange-dialog__title {
  color: #ff667a;
  font-size: 30rpx;
  line-height: 40rpx;
  font-weight: 600;
}

.mall-exchange-dialog__summary {
  width: 100%;
  margin-top: 42rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mall-exchange-dialog__asset,
.mall-exchange-dialog__amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333333;
  font-size: 22rpx;
  line-height: 32rpx;
}

.mall-exchange-dialog__amount {
  min-width: 120rpx;
  color: #333333;
  font-weight: 600;
}

.mall-exchange-dialog__amount-label {
  margin-bottom: 4rpx;
  color: #cccccc;
  font-size: 20rpx;
  line-height: 28rpx;
  font-weight: 400;
}

:deep(.mall-currency-icon) {
  margin-bottom: 8rpx;
}

.mall-exchange-dialog__slider-row {
  width: 100%;
  margin-top: 44rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.mall-exchange-dialog__slider {
  flex: 1;
}

.mall-exchange-dialog__step {
  flex: 0 0 32rpx;
  width: 32rpx;
  height: 32rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  color: #ff667a;
  font-size: 28rpx;
  line-height: 28rpx;
  border: 2rpx solid #ff667a;
  background: transparent;
}

.mall-exchange-dialog__step::after,
.mall-exchange-dialog__cancel::after,
.mall-exchange-dialog__confirm::after {
  border: 0;
}

.mall-exchange-dialog__actions {
  width: 100%;
  margin-top: 70rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mall-exchange-dialog__cancel,
.mall-exchange-dialog__confirm {
  width: 122rpx;
  height: 52rpx;
  margin: 0;
  padding: 0;
  border-radius: 999rpx;
  color: #ffffff;
  font-size: 24rpx;
  line-height: 52rpx;
  font-weight: 600;
}

.mall-exchange-dialog__cancel {
  background: #d7d7d7;
}

.mall-exchange-dialog__confirm {
  background: #ff667a;
}

.button-hover {
  opacity: 0.82;
}
</style>
