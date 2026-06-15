<template>
  <view class="oc-worldview-panel">
    <OcGridList
      :items="worldviewItems"
      :columns="2"
      column-gap="11rpx"
      row-gap="19rpx"
      cover-ratio="4 / 3"
      :description-lines="2"
      empty-tip="暂无世界观"
      @item-touch-start="startSettingPress"
      @item-touch-move="cancelSettingPress"
      @item-touch-end="cancelSettingPress"
      @item-touch-cancel="cancelSettingPress"
    />
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import OcGridList from '@/components/oc/OcGridList.vue'
import type { WorldviewItem } from '@/types/worldview'

const emit = defineEmits<{
  (event: 'setting'): void
}>()

const worldviewItems: WorldviewItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: '\u4e16\u754c\u89c2\u540d\u79f0\u540d\u79f0\u540d\u79f0\u540d\u79f0\u540d\u79f0',
  description: '\u4e16\u754c\u89c2\u7b80\u4ecb\u5185\u5bb9\u5185\u5bb9\u5185\u5bb9\u5185\u5bb9\u5185\u5bb9\u5185\u5bb9\u5185\u5bb9\u5185\u5bb9',
  locked: index % 4 === 0
}))

let settingPressTimer: ReturnType<typeof setTimeout> | undefined

function startSettingPress() {
  cancelSettingPress()

  settingPressTimer = setTimeout(() => {
    settingPressTimer = undefined
    emit('setting')
  }, 3000)
}

function cancelSettingPress() {
  if (!settingPressTimer) return

  clearTimeout(settingPressTimer)
  settingPressTimer = undefined
}

onBeforeUnmount(() => {
  cancelSettingPress()
})
</script>

<style scoped lang="scss">
.oc-worldview-panel {
  padding: 8rpx 22rpx calc(50rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
</style>
