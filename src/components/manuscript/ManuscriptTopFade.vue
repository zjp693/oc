<template>
  <view class="manuscript-top-fade"></view>
</template>

<style scoped lang="scss">
.manuscript-top-fade {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: calc(var(--status-bar-height) + 122rpx);
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 93%, rgba(255, 255, 255, 0) 100%);
}
</style>
