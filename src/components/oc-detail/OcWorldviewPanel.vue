<template>
  <view class="oc-worldview-panel">
    <view class="oc-worldview-panel__grid">
      <view
        v-for="item in worldviewItems"
        :key="item.id"
        class="oc-worldview-card"
        hover-class="oc-worldview-card--hover"
        @click="handleOpen(item)"
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

const worldviewItems: WorldviewItem[] = [
  {
    id: 1,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容内容内容',
    locked: true
  },
  {
    id: 2,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容内容内容'
  }
]

function handleOpen(_item: WorldviewItem) {
  emit('setting')
}
</script>

<style scoped lang="scss">
.oc-worldview-panel {
  padding: 8rpx 15rpx 190rpx;
  box-sizing: border-box;
}

.oc-worldview-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16rpx;
  row-gap: 18rpx;
}

.oc-worldview-card {
  min-width: 0;
  padding: 7rpx 7rpx 11rpx;
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
  height: 232rpx;
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
  font-weight: 700;
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
