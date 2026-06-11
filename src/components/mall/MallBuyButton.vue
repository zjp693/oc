<template>
  <view class="mall-buy-button" :class="`mall-buy-button--${placement}`">
    <button class="mall-buy-button__inner" hover-class="button-hover" :disabled="disabled" @click="emit('click')">
      {{ label }}
    </button>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    placement?: 'fixed' | 'inline'
  }>(),
  {
    disabled: false,
    placement: 'fixed'
  }
)

const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<style scoped lang="scss">
.mall-buy-button {
  position: absolute;
  left: 50%;
  bottom: calc(128rpx + env(safe-area-inset-bottom));
  z-index: 4;
  width: 375rpx;
  height: 78rpx;
  transform: translateX(-50%);
}

.mall-buy-button__inner {
  width: 100%;
  height: 100%;
  min-height: 0;
  margin: 0;
  padding: 0 !important;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 999rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 1;
  font-weight: 600;
  background: #ff667a;
}

.mall-buy-button--inline {
  position: static;
  left: auto;
  bottom: auto;
  width: 575rpx;
  height: 93rpx;
  transform: none;
}

.mall-buy-button--inline .mall-buy-button__inner {
  height: 93rpx;
}

.mall-buy-button--fixed .mall-buy-button__inner {
  height: 78rpx;
}

.mall-buy-button__inner::after {
  border: 0;
}

.mall-buy-button__inner[disabled] {
  opacity: 0.55;
}

.button-hover {
  opacity: 0.82;
}
</style>
