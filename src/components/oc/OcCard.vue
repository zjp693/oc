<template>
  <view class="oc-card" hover-class="oc-card--hover" @click="emit('click', item)">
    <view class="oc-card__cover">
      <image v-if="item.coverUrl" class="oc-card__image" :src="item.coverUrl" mode="aspectFill" />
      <wd-icon v-else name="image" size="30rpx" color="#8aa1ac" />

      <view
        v-if="statusText"
        class="oc-card__status"
        :class="{
          'oc-card__status--reviewing': item.status === 'reviewing',
          'oc-card__status--rejected': item.status === 'rejected'
        }"
      >
        <text class="oc-card__status-text">{{ statusText }}</text>
        <view v-if="item.status === 'reviewing'" />
      </view>

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

</script>

<style scoped lang="scss">
.oc-card {
  position: relative;
  min-width: 0;
  padding: 4rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.oc-card::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 38rpx;
  background-image: url('/static/oc/card-bottom-dots.png');
  background-repeat: repeat-x;
  background-position: center bottom;
  background-size: auto 38rpx;
  pointer-events: none;
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

.oc-card__status {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 90rpx;
  height: 39rpx;
  // border: 2rpx solid;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.oc-card__status--reviewing {
  color: rgba(64, 149, 229, 1);
  background: rgba(255, 255, 255, 0.8);
}

.oc-card__status--rejected {
  color: rgba(255, 86, 116, 1);
  background: rgba(223, 134, 143, 0.4);
}

.oc-card__status-text {
  position: relative;
  z-index: 1;
  font-size: 22rpx;
  line-height: 35rpx;
  font-weight: 500;
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
  position: relative;
  z-index: 1;
  margin-top: 11rpx;
  color: rgba(51, 51, 51, 1);
  font-size: 26rpx;
  line-height: 26rpx;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 9rpx;
}

.oc-card__desc {
  position: relative;
  z-index: 1;
  margin-top: 7rpx;
  color: #989898;
  font-size: 24rpx;
  line-height: 30rpx;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 9rpx;
  font-weight: 500;
}
</style>
