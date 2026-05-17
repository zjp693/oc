<template>
  <view class="oc-detail-hero">
    <image v-if="coverUrl" class="oc-detail-hero__image" :src="coverUrl" mode="aspectFill" />
    <wd-icon v-else name="image" size="32rpx" color="#8aa1ac" />
  </view>
</template>

<script setup lang="ts">
defineProps<{
  coverUrl?: string
}>()
</script>

<style scoped lang="scss">
.oc-detail-hero {
  position: relative;
  width: 100%;
  height: 750rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e5e5e5;
}

.oc-detail-hero__image {
  width: 100%;
  height: 100%;
}
</style>
