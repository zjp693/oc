<template>
  <view class="manuscript-title">
    <image class="manuscript-title__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
    <text class="manuscript-title__text" :data-title="title">{{ title }}</text>
    <image
      v-if="editable"
      class="manuscript-title__edit"
      src="/static/manuscript/icon-writing-fluently.png"
      mode="aspectFit"
    />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    editable?: boolean
  }>(),
  {
    editable: false
  }
)
</script>

<style scoped lang="scss">
.manuscript-title {
  position: relative;
  min-width: 0;
  height: 72rpx;
  display: inline-flex;
  align-items: center;
}

.manuscript-title__lingbao {
  position: absolute;
  z-index: 0;
  left: -38rpx;
  top: -55rpx;
  width: 98rpx;
  height: 140rpx;
  opacity: 0.9;
  pointer-events: none;
}

.manuscript-title__text {
  position: relative;
  z-index: 1;
  max-width: 470rpx;
  color: #ff5674;
  font-size: 38rpx;
  line-height: 48rpx;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.manuscript-title__text::before {
  content: attr(data-title);
  position: absolute;
  z-index: -1;
  left: 5rpx;
  top: 5rpx;
  width: 520rpx;
  color: rgba(255, 86, 116, 0.12);
  font: inherit;
  line-height: inherit;
  white-space: nowrap;
  pointer-events: none;
}

.manuscript-title__text::after {
  content: "";
  position: absolute;
  left: calc(100% + 4rpx);
  top: 50%;
  width: 30rpx;
  height: 30rpx;
  background-image: url('/static/home/avatar-title-stars.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-44%);
}

.manuscript-title__edit {
  position: relative;
  z-index: 1;
  width: 30rpx;
  height: 30rpx;
  margin-left: 4rpx;
}
</style>
