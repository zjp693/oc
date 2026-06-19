<template>
  <view class="oc-tabs" :style="tabsStyle">
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
      <wd-tab v-for="item in tabItems" :key="item.value" :title="item.label" :name="item.value" />
    </wd-tabs>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface OcTabItem {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  modelValue: string
  tabs?: OcTabItem[]
  inlinePadding?: string
  itemGap?: string
  activeLineColor?: string
}>(), {
  tabs: () => [
    { label: '全部', value: 'all' },
    { label: '最近', value: 'recent' }
  ],
  inlinePadding: '30rpx',
  itemGap: '36rpx',
  activeLineColor: '#333333'
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const tabItems = computed(() => props.tabs)
const tabsStyle = computed(() => ({
  '--oc-tabs-padding': props.inlinePadding,
  '--oc-tabs-item-gap': props.itemGap,
  '--oc-tabs-active-line-color': props.activeLineColor
}))

function handleChange(value: string | number) {
  const nextValue = String(value)
  if (!tabItems.value.some((item) => item.value === nextValue)) return
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
</script>

<style scoped lang="scss">
.oc-tabs {
  width: 100%;
  padding: 0 var(--oc-tabs-padding);
  box-sizing: border-box;
}

:deep(.oc-tabs__inner) {
  background: transparent;
}

:deep(.wd-tabs__nav) {
  height: 72rpx;
  background: transparent;
}

:deep(.wd-tabs__nav--wrap) {
  width: auto;
}

:deep(.wd-tabs__nav-container) {
  height: 72rpx;
}

:deep(.wd-tabs__nav-item) {
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
  margin-right: var(--oc-tabs-item-gap);
  padding: 0;
  font-size: 34rpx;
  line-height: 72rpx;
}

:deep(.wd-tabs__nav-item:last-child) {
  margin-right: 0;
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
  background-color: var(--oc-tabs-active-line-color) !important;
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
