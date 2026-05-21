<template>
  <view class="oc-tabs">
    <wd-tabs
      :model-value="modelValue"
      custom-class="oc-tabs__inner"
      line-theme="normal"
      :line-width="0"
      :line-height="1"
      color="#333333"
      inactive-color="#999999"
      @update:model-value="handleChange"
    >
      <wd-tab title="全部" name="all" />
      <wd-tab title="最近" name="recent" />
    </wd-tabs>
  </view>
</template>

<script setup lang="ts">
type OcTabKey = 'all' | 'recent'

defineProps<{
  modelValue: OcTabKey
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: OcTabKey): void
  (event: 'change', value: OcTabKey): void
}>()

function handleChange(value: string | number) {
  if (value !== 'all' && value !== 'recent') return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.oc-tabs {
  width: 100%;
}

:deep(.oc-tabs__inner) {
  background: transparent;
}

:deep(.wd-tabs__nav) {
  height: 72rpx;
  background: transparent;
}

:deep(.wd-tabs__nav--wrap) {
  width: 210rpx;
}

:deep(.wd-tabs__nav-container) {
  height: 72rpx;
}

:deep(.wd-tabs__nav-item) {
  position: relative;
  flex: 0 0 108rpx;
  padding: 0;
  font-size: 34rpx;
  line-height: 72rpx;
}

:deep(.wd-tabs__nav-item.is-active) {
  color: #333333 !important;
  font-weight: 500;
}

:deep(.wd-tabs__nav-item.is-active::after) {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 8rpx;
  width: 30rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background-color: #333333 !important;
  opacity: 1;
  transform: translateX(-50%);
}

:deep(.wd-tabs__container) {
  display: none;
}

:deep(.wd-tabs__line) {
  display: none;
}
</style>
