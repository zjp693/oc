<template>
  <view
    class="manuscript-card"
    :class="{ 'manuscript-card--chapter': variant === 'chapter' }"
    hover-class="manuscript-card--hover"
    @click="emit('click')"
  >
    <view class="manuscript-card__book" :class="{ 'manuscript-card__book--open': variant === 'chapter' }">
      <image
        v-if="variant === 'draft'"
        class="manuscript-card__book-image"
        src="/static/manuscript/icon-manuscript-book.png"
        mode="aspectFit"
      />
      <template v-else>
        <image
          class="manuscript-card__book-image"
          src="/static/manuscript/icon-chapter-book.png"
          mode="aspectFit"
        />
      </template>
    </view>

    <view class="manuscript-card__content">
      <text class="manuscript-card__title">{{ title }}</text>
      <view class="manuscript-card__meta">
        <text v-if="variant === 'draft'">共{{ chapters }}章节</text>
        <text>{{ words }}</text>
      </view>
      <text class="manuscript-card__date">编辑时间： {{ editedAt }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    words: string
    editedAt: string
    chapters?: number
    order?: number
    variant?: 'draft' | 'chapter'
  }>(),
  {
    chapters: 0,
    order: 1,
    variant: 'draft'
  }
)

const emit = defineEmits<{
  (event: 'click'): void
}>()
</script>

<style scoped lang="scss">
.manuscript-card {
  min-height: 174rpx;
  padding: 0rpx 17rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  gap: 19rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12rpx 32rpx rgba(190, 190, 190, 0.08);
  -webkit-tap-highlight-color: transparent;
}

.manuscript-card--hover {
  opacity: 0.86;
}

.manuscript-card--chapter {
  gap: 28rpx;
}

.manuscript-card__book {
  position: relative;
  flex: 0 0 146rpx;
  width: 146rpx;
  height: 192rpx;
  box-sizing: border-box;
}

.manuscript-card__book-image {
  width: 100%;
  height: 100%;
}

.manuscript-card__book--open {
  flex-basis: 113rpx;
  width: 111rpx;
  height: 77rpx;
}

.manuscript-card__order {
  position: absolute;
  left: 50%;
  top: 50%;
  color: #ff667a;
  font-size: 26rpx;
  line-height: 30rpx;
  transform: translate(-50%, -45%);
}

.manuscript-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.manuscript-card__title {
  color: #111111;
  font-size: 30rpx;
  line-height: 44rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.manuscript-card__meta {
  margin-top: 14rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  color: #111111;
  font-size: 26rpx;
  line-height: 34rpx;
  font-weight: 500;
}

.manuscript-card__date {
  margin-top: 6rpx;
  color: #888888;
  font-size: 22rpx;
  line-height: 30rpx;
  font-weight: 400;
  white-space: nowrap;
}
</style>
