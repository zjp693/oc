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
          :class="{ 'oc-action-sheet__action--danger': item.tone === 'danger' }"
          :style="{ '--oc-action-icon-size': item.iconSize || '41rpx' }"
          @click="handleAction(item.key)"
        >
          <image
            v-if="item.iconUrl"
            class="oc-action-sheet__action-icon"
            :src="item.iconUrl"
            mode="aspectFit"
          />
          <view v-else-if="item.icon === 'adjust'" class="oc-action-sheet__adjust-icon">
            <view class="oc-action-sheet__adjust-line oc-action-sheet__adjust-line--top"></view>
            <view class="oc-action-sheet__adjust-line oc-action-sheet__adjust-line--middle"></view>
            <view class="oc-action-sheet__adjust-line oc-action-sheet__adjust-line--bottom"></view>
          </view>
          <wd-icon
            v-else
            :name="item.icon"
            :size="item.iconSize || '44rpx'"
            :color="item.tone === 'danger' ? '#ff667a' : '#333333'"
          />
          <text class="oc-action-sheet__action-text">{{ item.label }}</text>
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
  iconUrl?: string
  iconSize?: string
  tone?: 'default' | 'danger'
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
  min-height: 220rpx;
  padding: 44rpx 36rpx calc(40rpx + env(safe-area-inset-bottom));
  border-radius: 44rpx 44rpx 0 0;
  box-sizing: border-box;
  background: #f8f8f8;
}

.oc-action-sheet__title {
  display: block;
  color: #333;
  font-size: 34rpx;
  line-height: 44rpx;
  font-weight: 400;
  text-align: center;
}

.oc-action-sheet__line {
  width: 28rpx;
  height: 4rpx;
  margin: 8rpx auto 32rpx;
  background: #ff667a;
}

.oc-action-sheet__actions {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.oc-action-sheet__action {
  position: relative;
  height: 94rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 30rpx;
  line-height: 44rpx;
  font-weight: 500;
  background: #fff;
}

.oc-action-sheet__action-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  transform: translateY(-50%);
  width: var(--oc-action-icon-size);
  height: var(--oc-action-icon-size);
}

.oc-action-sheet__adjust-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  width: 42rpx;
  height: 42rpx;
  transform: translateY(-50%);
}

.oc-action-sheet__adjust-line {
  position: absolute;
  left: 6rpx;
  width: 30rpx;
  height: 3rpx;
  border-radius: 2rpx;
  background: #333;
}

.oc-action-sheet__adjust-line::after {
  content: '';
  position: absolute;
  top: -5rpx;
  width: 8rpx;
  height: 8rpx;
  border: 3rpx solid #333;
  border-radius: 50%;
  background: #fff;
}

.oc-action-sheet__adjust-line--top {
  top: 9rpx;
}

.oc-action-sheet__adjust-line--top::after {
  left: 4rpx;
}

.oc-action-sheet__adjust-line--middle {
  top: 20rpx;
}

.oc-action-sheet__adjust-line--middle::after {
  right: 4rpx;
}

.oc-action-sheet__adjust-line--bottom {
  top: 31rpx;
}

.oc-action-sheet__adjust-line--bottom::after {
  left: 12rpx;
}

.oc-action-sheet__action-text {
  display: block;
  width: 100%;
  text-align: center;
}

.oc-action-sheet__action--danger .oc-action-sheet__action-text {
  color: #ff667a;
}
</style>
