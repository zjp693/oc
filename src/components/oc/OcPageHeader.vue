<template>
  <view class="oc-page-header">
    <view class="oc-page-header__brand">
      <text class="oc-page-header__brand-text">OC</text>
      <image class="oc-page-header__stars" src="/static/home/avatar-title-stars.png" mode="aspectFit" />
    </view>

    <wd-search
      class="oc-page-header__search"
      :model-value="modelValue"
      placeholder="请输入"
      hide-cancel
      placeholder-left
      variant="light"
      @update:model-value="handleInput"
      @search="emit('search', modelValue)"
    />

    <wd-button
      custom-class="oc-page-header__create"
      custom-style="background:#ff6680;border-color:#ff6680;color:#ffffff;"
      round
      size="small"
      @click="emit('create')"
    >
      创建
    </wd-button>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
  (event: 'create'): void
}>()

function handleInput(value: string) {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.oc-page-header {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 0;
}

.oc-page-header__brand {
  position: relative;
  flex: 0 0 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.oc-page-header__brand::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2rpx solid rgba(42, 144, 255, 1);
  background: rgba(255, 255, 255, 0.48);
}

.oc-page-header__brand-text {
  position: relative;
  z-index: 1;
  color: rgba(255, 86, 116, 1);
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 700;
}

.oc-page-header__stars {
  position: absolute;
  z-index: 2;
  right: 18rpx;
  top: 33rpx;
  width: 28rpx;
  height: 28rpx;
}

.oc-page-header__search {
  flex: 1;
  min-width: 0;
}

:deep(.wd-search) {
  padding: 0;
  background: transparent;
}

:deep(.wd-search__block) {
  height: 72rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 2rpx 12rpx rgba(190, 190, 190, 0.12);
}

:deep(.wd-search__field) {
  height: 72rpx;
}

:deep(.wd-search__input) {
  height: 72rpx;
  color: #333333;
  font-size: 26rpx;
}

:deep(.wd-search__placeholder-txt) {
  color: rgba(204, 204, 204, 1);
  font-size: 26rpx;
}

:deep(.oc-page-header__create) {
  flex: 0 0 120rpx;
  width: 120rpx;
  height: 72rpx;
  padding: 0;
  font-size: 28rpx;
  font-weight: 700;
}
</style>
