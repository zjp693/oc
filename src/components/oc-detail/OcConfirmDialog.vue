<template>
  <view
    v-if="modelValue"
    class="oc-confirm-dialog"
    :class="[`oc-confirm-dialog--${variant}`, `oc-confirm-dialog--${size}`]"
  >
    <view class="oc-confirm-dialog__box">
      <text class="oc-confirm-dialog__title">{{ title }}</text>
      <text class="oc-confirm-dialog__content">{{ content }}</text>
      <view class="oc-confirm-dialog__actions">
        <button class="oc-confirm-dialog__cancel" hover-class="button-hover" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="oc-confirm-dialog__confirm" hover-class="button-hover" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    content: string
    cancelText?: string
    confirmText?: string
    variant?: 'default' | 'mall'
    size?: 'default' | 'compact'
  }>(),
  {
    title: '提示',
    cancelText: '取消',
    confirmText: '确定',
    variant: 'default',
    size: 'default'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'cancel'): void
  (event: 'confirm'): void
}>()

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.oc-confirm-dialog {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.oc-confirm-dialog__box {
  width: min(616rpx, calc(100vw - 134rpx));
  min-height: 364rpx;
  padding: 50rpx clamp(52rpx, 13vw, 100rpx) 54rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.oc-confirm-dialog--compact .oc-confirm-dialog__box {
  width: 484rpx;
  min-height: 350rpx;
  padding: 50rpx 76rpx 58rpx;
}

.oc-confirm-dialog__title {
  color: #ff667a;
  font-size: 34rpx;
  line-height: 40rpx;
  font-weight: 500;
}

.oc-confirm-dialog__content {
  margin-top: 48rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 40rpx;
  text-align: center;
}

.oc-confirm-dialog--compact .oc-confirm-dialog__content {
  margin-top: 50rpx;
  font-size: 30rpx;
  line-height: 38rpx;
  white-space: nowrap;
}

.oc-confirm-dialog__actions {
  width: 100%;
  margin-top: 58rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oc-confirm-dialog--compact .oc-confirm-dialog__actions {
  margin-top: 76rpx;
}

.oc-confirm-dialog__cancel,
.oc-confirm-dialog__confirm {
  width: 144rpx;
  height: 64rpx;
  margin: 0;
  padding: 0;
  border-radius: 32rpx;
  font-size: 28rpx;
  line-height: 64rpx;
}

.oc-confirm-dialog__cancel {
  color: #fff;
  background: #d7d7d7;
}

.oc-confirm-dialog__confirm {
  color: #333;
  border: 2rpx solid #333;
  background: #fff;
}

.oc-confirm-dialog--mall .oc-confirm-dialog__confirm {
  color: #ffffff;
  border: 0;
  background: #ff667a;
}

.oc-confirm-dialog__cancel::after,
.oc-confirm-dialog__confirm::after {
  border: 0;
}

.button-hover {
  opacity: 0.82;
}
</style>
