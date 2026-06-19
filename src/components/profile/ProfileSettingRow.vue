<template>
  <view class="profile-setting-row" @click="emit('click')">
    <text class="profile-setting-row__label">{{ label }}</text>
    <text class="profile-setting-row__value">{{ value || placeholder }}</text>
    <image v-if="arrow" class="profile-setting-row__chevron" :src="arrowIcon" mode="aspectFit" />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value?: string
    placeholder?: string
    arrow?: boolean
    arrowIcon?: string
  }>(),
  {
    value: '',
    placeholder: '',
    arrow: true,
    arrowIcon: '/static/profile/icon-setting-arrow.png'
  }
)

const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<style scoped lang="scss">
.profile-setting-row {
  width: 100%;
  height: 105rpx;
  padding: 0 20rpx 0 30rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: rgba(255, 255, 255, 0.5);
}

.profile-setting-row__label {
  flex: 0 0 86rpx;
  color: #999999;
  font-size: 34rpx;
  line-height: 42rpx;
  white-space: nowrap;
}

.profile-setting-row__value {
  flex: 1;
  min-width: 0;
  color: #333333;
  font-size: 34rpx;
  line-height: 42rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-setting-row__chevron {
  flex: 0 0 41rpx;
  width: 41rpx;
  height: 41rpx;
}
</style>
