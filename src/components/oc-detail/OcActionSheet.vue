<template>
  <view v-if="modelValue" class="oc-action-sheet" @click="emit('update:modelValue', false)">
    <view class="oc-action-sheet__panel" @click.stop>
      <text class="oc-action-sheet__title">{{ title }}</text>
      <view class="oc-action-sheet__line"></view>

      <view class="oc-action-sheet__actions">
        <view
          v-for="item in actions"
          :key="item.key"
          class="oc-action-sheet__action"
          @click="handleAction(item.key)"
        >
          <wd-icon :name="item.icon" size="28rpx" color="#333333" />
          <text>{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface OcSheetAction {
  key: string
  label: string
  icon: string
}

defineProps<{
  modelValue: boolean
  title: string
  actions: OcSheetAction[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'select', key: string): void
}>()

function handleAction(key: string) {
  emit('select', key)
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.oc-action-sheet {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.5);
}

.oc-action-sheet__panel {
  width: 100%;
  min-height: 244rpx;
  padding: 29rpx 24rpx calc(28rpx + env(safe-area-inset-bottom));
  border-radius: 22rpx 22rpx 0 0;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.96);
}

.oc-action-sheet__title {
  display: block;
  color: #333;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: 700;
  text-align: center;
}

.oc-action-sheet__line {
  width: 28rpx;
  height: 3rpx;
  margin: 5rpx auto 69rpx;
  background: #ff667a;
}

.oc-action-sheet__actions {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.oc-action-sheet__action {
  height: 59rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 178rpx;
  color: #333;
  font-size: 24rpx;
  line-height: 32rpx;
  background: #fff;
}
</style>
