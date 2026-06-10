<template>
  <view class="phone-search-header" :style="{ '--phone-search-header-padding': inlinePadding }">
    <view class="phone-search-header__row">
      <view class="phone-search-header__brand">
        <text class="phone-search-header__title">{{ title }}</text>
      </view>

      <view class="phone-search-header__search">
        <input
          class="phone-search-header__input"
          :value="modelValue"
          :placeholder="placeholder"
          placeholder-class="phone-search-header__placeholder"
          confirm-type="search"
          :adjust-position="true"
          :cursor-spacing="24"
          @input="handleInput"
          @confirm="emit('search', modelValue)"
        />
        <image class="phone-search-header__icon" src="/static/common/search.png" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    modelValue: string
    placeholder?: string
    inlinePadding?: string
  }>(),
  {
    placeholder: '请输入',
    inlinePadding: '30rpx'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
}>()

function handleInput(event: Event) {
  const value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.phone-search-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  height: calc(var(--status-bar-height) + 20rpx + 88rpx);
  padding-top: calc(var(--status-bar-height) + 20rpx);
  box-sizing: border-box;
}

.phone-search-header__row {
  height: 88rpx;
  padding: 0 var(--phone-search-header-padding);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 0;
}

.phone-search-header__brand {
  position: relative;
  flex: 0 0 auto;
  max-width: 188rpx;
  min-width: 0;
  height: 72rpx;
  margin-right: 73rpx;
  display: flex;
  align-items: center;
}

.phone-search-header__title {
  position: relative;
  color: #ff5674;
  font-size: 38rpx;
  line-height: 44rpx;
  font-weight: 500;
  text-shadow: 6rpx 5rpx 0 rgba(255, 86, 116, 0.12);
  white-space: nowrap;
}

.phone-search-header__title::after {
  content: "";
  position: absolute;
  left: calc(100% + 2rpx);
  top: 50%;
  width: 30rpx;
  height: 30rpx;
  background-image: url('/static/home/avatar-title-stars.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%);
}

.phone-search-header__search {
  flex: 1;
  min-width: 0;
  height: 67rpx;
  padding: 0 28rpx 0 30rpx;
  border-radius: 34rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 2rpx 12rpx rgba(190, 190, 190, 0.12);
}

.phone-search-header__input {
  flex: 1;
  min-width: 0;
  height: 67rpx;
  border: 0;
  outline: none;
  color: #333333;
  font-size: 26rpx;
  line-height: 67rpx;
  background: transparent;
}

.phone-search-header__placeholder {
  color: rgba(204, 204, 204, 1);
  font-size: 26rpx;
}

.phone-search-header__icon {
  flex: 0 0 36rpx;
  width: 36rpx;
  height: 36rpx;
}
</style>
