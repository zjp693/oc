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
          <image
            v-if="item.iconUrl"
            class="oc-action-sheet__action-icon"
            :src="item.iconUrl"
            mode="aspectFit"
          />
          <wd-icon v-else :name="item.icon" size="44rpx" color="#333333" />
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
  min-height: 280rpx;
  padding: 44rpx 44rpx calc(40rpx + env(safe-area-inset-bottom));
  border-radius: 44rpx 44rpx 0 0;
  box-sizing: border-box;
  background: #f8f8f8;
}

.oc-action-sheet__title {
  display: block;
  color: #333;
  font-size: 32rpx;
  line-height: 44rpx;
  font-weight: 700;
  text-align: center;
}

.oc-action-sheet__line {
  width: 28rpx;
  height: 4rpx;
  margin: 8rpx auto 126rpx;
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
  border-radius: 50rpx;
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
  width: 41rpx;
  height: 41rpx;
}

.oc-action-sheet__action-text {
  display: block;
  width: 100%;
  text-align: center;
}
</style>
