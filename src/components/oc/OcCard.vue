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
        <wd-icon name="lock" size="24rpx" color="#ffffff" />
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
    return 'color:#2f8fff;border-color:#2f8fff;background:#ffffff;'
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.oc-card--hover {
  opacity: 0.86;
}

.oc-card__cover {
  position: relative;
  width: 100%;
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
  min-width: 78rpx;
  height: 36rpx;
  padding: 0 10rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  line-height: 34rpx;
  box-sizing: border-box;
}

.oc-card__lock {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  width: 44rpx;
  height: 32rpx;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(153, 153, 153, 0.86);
}

.oc-card__title {
  margin-top: 6rpx;
  color: rgba(51, 51, 51, 1);
  font-size: 26rpx;
  line-height: 34rpx;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-card__desc {
  color: rgba(153, 153, 153, 1);
  font-size: 24rpx;
  line-height: 32rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
