<template>
  <view class="app-page-header">
    <view class="app-page-header__brand">
      <image class="app-page-header__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
      <text class="app-page-header__brand-text" :data-brand="title">{{ title }}</text>
    </view>

    <view class="app-page-header__search">
      <input
        class="app-page-header__search-input"
        :value="modelValue"
        :placeholder="placeholder"
        placeholder-class="app-page-header__search-placeholder"
        confirm-type="search"
        @input="handleInput"
        @confirm="emit('search', modelValue)"
      />
      <image class="app-page-header__search-icon" src="/static/common/search.png" mode="aspectFit" />
    </view>

    <wd-button
      custom-class="app-page-header__create"
      custom-style="background:#ff6680;border-color:#ff6680;color:#ffffff;"
      round
      size="small"
      @click="emit('create')"
    >
      {{ createText }}
    </wd-button>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    modelValue: string
    placeholder?: string
    createText?: string
  }>(),
  {
    placeholder: '请输入',
    createText: '创建'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
  (event: 'create'): void
}>()

function handleInput(event: Event) {
  const value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.app-page-header {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 0;
  margin-bottom: 20rpx;
}

.app-page-header__brand {
  position: relative;
  min-width: 80rpx;
  height: 72rpx;
  margin-right: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-page-header__lingbao {
  position: absolute;
  z-index: 0;
  left: -36rpx;
  top: -56rpx;
  width: 98rpx;
  height: 140rpx;
  opacity: 0.92;
  pointer-events: none;
}

.app-page-header__brand-text {
  position: relative;
  z-index: 1;
  color: rgba(255, 86, 116, 1);
  font-size: 40rpx;
  line-height: 40rpx;
  font-weight: 700;
  white-space: nowrap;
}

.app-page-header__brand-text::before {
  content: attr(data-brand);
  position: absolute;
  z-index: -1;
  width: 200rpx;
  left: 5rpx;
  top: 5rpx;
  color: rgba(255, 86, 116, 0.12);
  font: inherit;
  line-height: inherit;
  white-space: nowrap;
  pointer-events: none;
}

.app-page-header__brand-text::after {
  content: "";
  position: absolute;
  left: calc(100% + 2px);
  top: 50%;
  width: 32rpx;
  height: 32rpx;
  background-image: url('/static/home/avatar-title-stars.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-40%);
}

.app-page-header__search {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  padding: 0 28rpx 0 36rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 2rpx 12rpx rgba(190, 190, 190, 0.12);
  box-sizing: border-box;
}

.app-page-header__search-input {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  border: 0;
  outline: none;
  background: transparent;
  color: #333333;
  font-size: 26rpx;
  line-height: 72rpx;
}

.app-page-header__search-placeholder {
  color: rgba(204, 204, 204, 1);
  font-size: 26rpx;
}

.app-page-header__search-icon {
  flex: 0 0 36rpx;
  width: 36rpx;
  height: 36rpx;
}

:deep(.app-page-header__create) {
  width: 119rpx !important;
  height: 67rpx !important;
  padding: 0;
  font-size: 28rpx;
  font-weight: 700;
  margin-left: 10rpx;
}
</style>
