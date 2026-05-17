<template>
  <view class="oc-detail-tabs">
    <view
      v-for="item in tabs"
      :key="item.value"
      class="oc-detail-tabs__item"
      :class="{ 'oc-detail-tabs__item--active': item.value === modelValue }"
      @click="handleClick(item.value)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script setup lang="ts">
export type OcDetailTab = 'setting' | 'worldview'

const props = defineProps<{
  modelValue: OcDetailTab
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: OcDetailTab): void
  (event: 'change', value: OcDetailTab): void
}>()

const tabs: Array<{ label: string; value: OcDetailTab }> = [
  { label: '设定', value: 'setting' },
  { label: '世界观', value: 'worldview' }
]

function handleClick(value: OcDetailTab) {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.oc-detail-tabs {
  height: 58rpx;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  gap: 37rpx;
  box-sizing: border-box;
}

.oc-detail-tabs__item {
  position: relative;
  color: #777;
  font-size: 33rpx;
  line-height: 42rpx;
  font-weight: 400;
}

.oc-detail-tabs__item--active {
  color: #333;
  font-weight: 500;
}

.oc-detail-tabs__item--active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -7rpx;
  width: 37rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: #ff667a;
  transform: translateX(-50%);
}
</style>
