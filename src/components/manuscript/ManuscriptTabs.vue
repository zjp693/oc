<template>
  <view class="manuscript-tabs">
    <wd-tabs
      :model-value="modelValue"
      custom-class="manuscript-tabs__inner"
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
type ManuscriptTabKey = 'all' | 'recent'

defineProps<{
  modelValue: ManuscriptTabKey
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: ManuscriptTabKey): void
  (event: 'change', value: ManuscriptTabKey): void
}>()

function handleChange(value: string | number) {
  if (value !== 'all' && value !== 'recent') return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.manuscript-tabs {
  width: 100%;
}

:deep(.manuscript-tabs__inner),
:deep(.wd-tabs__nav) {
  background: transparent;
}

:deep(.wd-tabs__nav),
:deep(.wd-tabs__nav-container) {
  height: 70rpx;
}

:deep(.wd-tabs__nav--wrap) {
  width: 214rpx;
}

:deep(.wd-tabs__nav-item) {
  position: relative;
  flex: 0 0 108rpx;
  padding: 0;
  font-size: 32rpx;
  line-height: 70rpx;
}

:deep(.wd-tabs__nav-item.is-active) {
  color: #333333 !important;
  font-weight: 600;
}

:deep(.wd-tabs__nav-item.is-active::after) {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 6rpx;
  width: 31rpx;
  height: 3rpx;
  border-radius: 3rpx;
  background: #333333;
  transform: translateX(-50%);
}

:deep(.wd-tabs__container),
:deep(.wd-tabs__line) {
  display: none;
}
</style>
