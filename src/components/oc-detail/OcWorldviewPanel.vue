<template>
  <view class="oc-worldview-panel">
    <view class="oc-worldview-panel__grid">
      <view
        v-for="item in worldviewItems"
        :key="item.id"
        class="oc-worldview-card"
        hover-class="oc-worldview-card--hover"
        @touchstart="startSettingPress"
        @touchmove="cancelSettingPress"
        @touchend="cancelSettingPress"
        @touchcancel="cancelSettingPress"
      >
        <view class="oc-worldview-card__cover">
          <image v-if="item.coverUrl" class="oc-worldview-card__image" :src="item.coverUrl" mode="aspectFill" />
          <wd-icon v-else name="image" size="34rpx" color="#8aa1ac" />

          <view v-if="item.locked" class="oc-worldview-card__lock">
            <image class="oc-worldview-card__lock-icon" src="/static/oc/lock-close.png" mode="aspectFit" />
          </view>
        </view>

        <text class="oc-worldview-card__title">{{ item.title }}</text>
        <text class="oc-worldview-card__desc">{{ item.description }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

interface WorldviewItem {
  id: number
  title: string
  description: string
  coverUrl?: string
  locked?: boolean
}

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
  padding: 8rpx 15rpx calc(50rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.oc-worldview-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 20rpx;
  row-gap: 18rpx;
}

.oc-worldview-card {
  min-width: 0;
  padding: 7rpx 10rpx 11rpx;
  border-radius: 9rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  background: #ffffff;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.oc-worldview-card--hover {
  opacity: 0.86;
}

.oc-worldview-card__cover {
  position: relative;
  width: 100%;
  height: 250rpx;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e1e1e1;
}

.oc-worldview-card__image {
  width: 100%;
  height: 100%;
}

.oc-worldview-card__lock {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  width: 49rpx;
  height: 34rpx;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(153, 153, 153, 0.86);
}

.oc-worldview-card__lock-icon {
  width: 36rpx;
  height: 36rpx;
}

.oc-worldview-card__title {
  margin-top: 8rpx;
  color: #333333;
  font-size: 26rpx;
  line-height: 30rpx;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-worldview-card__desc {
  margin-top: 4rpx;
  color: #989898;
  font-size: 22rpx;
  line-height: 28rpx;
  text-align: left;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
