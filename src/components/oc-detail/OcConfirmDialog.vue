<template>
  <view v-if="modelValue" class="oc-confirm-dialog">
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
  }>(),
  {
    title: '提示',
    cancelText: '取消',
    confirmText: '确定'
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
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.oc-confirm-dialog__box {
  width: 530rpx;
  min-height: 288rpx;
  padding: 48rpx 58rpx 49rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.oc-confirm-dialog__title {
  color: #ff667a;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: 700;
}

.oc-confirm-dialog__content {
  margin-top: 34rpx;
  color: #333;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
}

.oc-confirm-dialog__actions {
  width: 100%;
  margin-top: 50rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oc-confirm-dialog__cancel,
.oc-confirm-dialog__confirm {
  width: 100rpx;
  height: 44rpx;
  margin: 0;
  padding: 0;
  border-radius: 24rpx;
  font-size: 20rpx;
  line-height: 44rpx;
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

.oc-confirm-dialog__cancel::after,
.oc-confirm-dialog__confirm::after {
  border: 0;
}

.button-hover {
  opacity: 0.82;
}
</style>
