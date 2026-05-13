<template>
  <view class="oc-tabs">
    <wd-tabs
      :model-value="modelValue"
      custom-class="oc-tabs__inner"
      line-theme="normal"
      :line-width="34"
      :line-height="3"
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
  flex: 0 0 96rpx;
  padding: 0;
  font-size: 30rpx;
  line-height: 72rpx;
}

:deep(.wd-tabs__nav-item.is-active) {
  font-weight: 700;
}

:deep(.wd-tabs__container) {
  display: none;
}

:deep(.wd-tabs__line) {
  bottom: 8rpx;
  border-radius: 4rpx;
  background: #333333;
}
</style>
