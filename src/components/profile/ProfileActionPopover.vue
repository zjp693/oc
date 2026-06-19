<template>
  <button
    class="profile-action-popover"
    :class="`profile-action-popover--${tone}`"
    hover-class="button-hover"
    @click.stop="emit('click')"
  >
    <image class="profile-action-popover__icon" :src="iconSrc" mode="aspectFit" />
    <text class="profile-action-popover__text">{{ label }}</text>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    iconSrc: string
    tone?: 'default' | 'danger'
  }>(),
  {
    tone: 'default'
  }
)

const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<style scoped lang="scss">
.profile-action-popover {
  position: absolute;
  right: 38rpx;
  bottom: calc(124rpx + env(safe-area-inset-bottom));
  z-index: 7;
  width: 319rpx;
  height: 106rpx;
  margin: 0;
  padding: 0 30rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28rpx;
  color: #333333;
  font-size: 32rpx;
  line-height: 44rpx;
  font-weight: 500;
  white-space: nowrap;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 8rpx 28rpx rgba(153, 153, 153, 0.2);

  &--danger {
    color: #ff667a;
  }

  &::after {
    border: 0;
  }

  &__icon {
    flex: 0 0 auto;
    width: 44rpx;
    height: 44rpx;
  }

  &__text {
    flex: 0 0 auto;
    white-space: nowrap;
  }
}

.button-hover {
  opacity: 0.86;
}
</style>
