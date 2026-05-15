<template>
  <view class="oc-card" hover-class="oc-card--hover" @click="emit('click', item)">
    <view class="oc-card__cover">
      <image v-if="item.coverUrl" class="oc-card__image" :src="item.coverUrl" mode="aspectFill" />
      <wd-icon v-else name="image" size="30rpx" color="#8aa1ac" />

      <wd-tag
        v-if="statusText"
        custom-class="oc-card__status"
        :custom-style="statusStyle"
        size="small"
        plain
      >
        {{ statusText }}
      </wd-tag>

      <view v-if="item.locked" class="oc-card__lock">
        <image class="oc-card__lock-icon" src="/static/oc/lock-close.png" mode="aspectFit" />
      </view>
    </view>

    <text class="oc-card__title">{{ item.title }}</text>
    <text class="oc-card__desc">{{ item.description }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OcItem } from '@/types/oc'

const props = defineProps<{
  item: OcItem
}>()

const emit = defineEmits<{
  (event: 'click', item: OcItem): void
}>()

const statusText = computed(() => {
  if (props.item.status === 'reviewing') return '审核中'
  if (props.item.status === 'rejected') return '驳回'
  return ''
})

const statusStyle = computed(() => {
  if (props.item.status === 'reviewing') {
    return 'color:rgba(64,149,229,1);border-color:rgba(64,149,229,1);background:#ffffff'
  }

  if (props.item.status === 'rejected') {
    return 'color:#ff566f;border-color:#ff566f;background:#ffffff;'
  }

  return ''
})
</script>

<style scoped lang="scss">
.oc-card {
  min-width: 0;
  padding: 4rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  border-radius: 12rpx;
  background: #ffffff;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.oc-card--hover {
  opacity: 0.86;
}

.oc-card__cover {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(225, 225, 225, 1);
}

.oc-card__image {
  width: 100%;
  height: 100%;
}

:deep(.oc-card__status) {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 90rpx;
  height: 39rpx;
  border: 2rpx solid currentColor;
  border-radius: 8rpx;
  font-size: 22rpx;
  padding: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.oc-card__lock {
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

.oc-card__lock-icon {
  width: 36rpx;
  height: 36rpx;
}

.oc-card__title {
  margin-top: 11rpx;
  color: rgba(51, 51, 51, 1);
  font-size: 27rpx;
  line-height: 26rpx;
  font-weight: 700;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 9rpx;
}

.oc-card__desc {
  margin-top: 7rpx;
  color: #989898;
  font-size: 24rpx;
  line-height: 30rpx;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 9rpx;
}
</style>
