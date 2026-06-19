<template>
  <view class="mall-buy-button" :class="[`mall-buy-button--${placement}`, `mall-buy-button--${tone}`]">
    <button class="mall-buy-button__inner" hover-class="button-hover" :disabled="disabled" @click="emit('click')">
      <image
        v-if="iconSrc"
        class="mall-buy-button__icon"
        :src="iconSrc"
        :style="{ '--mall-buy-button-icon-size': iconSize }"
        mode="aspectFit"
      />
      <text>{{ label }}</text>
    </button>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    placement?: 'fixed' | 'inline'
    tone?: 'primary' | 'muted'
    iconSrc?: string
    iconSize?: string
  }>(),
  {
    disabled: false,
    placement: 'fixed',
    tone: 'primary',
    iconSrc: '',
    iconSize: '37rpx'
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
  gap: 11rpx;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 1;
  font-weight: 600;
  background: #ff667a;
}

.mall-buy-button__icon {
  flex: 0 0 var(--mall-buy-button-icon-size);
  width: var(--mall-buy-button-icon-size);
  height: var(--mall-buy-button-icon-size);
}

.mall-buy-button--muted .mall-buy-button__inner {
  border: 0;
  color: #999999;
  background: rgba(239, 239, 239, 1);
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

.mall-buy-button--muted .mall-buy-button__inner[disabled] {
  opacity: 1;
}

.button-hover {
  opacity: 0.82;
}
</style>
