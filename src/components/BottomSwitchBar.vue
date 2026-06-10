<template>
  <view class="bottom-switch-bar" :style="barStyle">
    <view class="bottom-switch-bar__back" @click="emit('back')">
      <image class="bottom-switch-bar__back-image" :src="backImage" mode="aspectFit" />
    </view>

    <view v-if="options.length" class="bottom-switch-bar__tabs">
      <view v-for="item in options" :key="item.value" class="bottom-switch-bar__pill"
        :class="{ 'bottom-switch-bar__pill--active': item.value === modelValue }" @click="handleSelect(item.value)">
        <view class="bottom-switch-bar__pill-content">
          <text>{{ item.label }}</text>
          <text
            v-if="item.badge !== undefined && item.badge !== ''"
            class="bottom-switch-bar__badge"
          >
            {{ item.badge }}
          </text>
          <text v-else-if="item.dot" class="bottom-switch-bar__dot"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type SwitchValue = string

interface SwitchOption {
  label: string
  value: SwitchValue
  dot?: boolean
  badge?: string | number
}

const props = withDefaults(
  defineProps<{
    modelValue?: SwitchValue
    options?: SwitchOption[]
    bgImage?: string
    backImage?: string
  }>(),
  {
    modelValue: 'owned',
    options: () => [
      { label: '已拥有', value: 'owned' },
      { label: '商城', value: 'mall' }
    ],
    bgImage: '/static/avatar/bottom-btn-bg.png',
    backImage: '/static/avatar/bottom-btn-back.png'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: SwitchValue): void
  (event: 'change', value: SwitchValue): void
  (event: 'back'): void
}>()

const barStyle = computed(() => ({
  backgroundImage: `url(${props.bgImage})`
}))

function handleSelect(value: SwitchValue) {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.bottom-switch-bar {
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-sizing: border-box;
  overflow: hidden;
  // background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%, 100% 100%;
  padding: 0 34rpx 0 33rpx;
  animation: none;
  transition: none;
}

.bottom-switch-bar__back {
  flex: 0 0 130rpx;
  width: 130rpx;
  height: 74rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: none;
  transition: none;
}

.bottom-switch-bar__back-image {
  width: 100%;
  height: 100%;
}

.bottom-switch-bar__tabs {
  flex: 1;
  height: 67rpx;
  padding: 4rpx;
  display: flex;
  align-items: center;
  border-radius: 40rpx;
  background: rgba(190, 190, 190, 0.48);
  overflow: hidden;
  animation: none;
  transition: none;
}

.bottom-switch-bar__pill {
  flex: 1;
  // height: 54rpx;
  height: 100%;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26rpx;
  line-height: 100%;
  font-weight: 400;
  animation: none;
  transition: none;
  -webkit-tap-highlight-color: transparent;
}

.bottom-switch-bar__pill-content {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.bottom-switch-bar__dot {
  position: absolute;
  top: -8rpx;
  right: -14rpx;
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #ff667a;
}

.bottom-switch-bar__badge {
  position: absolute;
  top: -16rpx;
  right: -28rpx;
  min-width: 26rpx;
  height: 26rpx;
  padding: 0 7rpx;
  border-radius: 999rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18rpx;
  line-height: 26rpx;
  background: #ff667a;
}

.bottom-switch-bar__pill--active {
  color: rgba(51, 51, 51, 1);
  background: #f9f9f9;
}

</style>
