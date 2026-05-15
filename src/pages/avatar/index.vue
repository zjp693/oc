<template>
  <view class="avatar-page">
    <view class="hero-section">
      <view class="page-title">
        <image class="title-lingbao" src="/static/avatar/left-top-lingbao.png"
          mode="aspectFit" />
        <text>头像框</text>
        <image class="title-stars" src="/static/home/avatar-title-stars.png"
          mode="aspectFit" />
      </view>

      <view class="avatar-preview">
        <view class="avatar-frame">
          <image class="avatar-image" src="/static/home/oc1-avatar.png"
            mode="aspectFit" />
        </view>
        <button class="change-button" hover-class="button-hover">更换头像</button>
      </view>
    </view>

    <view class="frame-panel">
      <view class="list-header">
        <view class="all-tab">全部</view>
        <text class="intro-text">· 头像框简介简介简介简介简介简介简介简介 / 200个</text>
      </view>

      <scroll-view
        class="frame-scroll"
        scroll-y
        :scroll-top="frameScrollTop"
        :scroll-with-animation="false"
        @scroll="handleFrameScroll"
      >
        <view class="frame-grid">
          <view v-for="item in currentFrameItems" :key="item.id"
            class="frame-item"
            :class="{ 'frame-item--active': item.id === selectedFrameId }"
            @click="handleSelectFrame(item.id)">
            <view class="frame-thumb">
              <view class="frame-thumb__inner">
                <text class="thumb-mark">▧</text>
              </view>
            </view>
            <text class="frame-name">相框名称名称</text>
          </view>
        </view>
        <view class="end-tip">--- 没有更多了 ---</view>
      </scroll-view>
    </view>

    <view class="avatar-bottom-bar">
      <BottomSwitchBar
        :model-value="activeSource"
        @change="handleSourceChange"
        @back="handleBack"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import BottomSwitchBar from '@/components/BottomSwitchBar.vue'

  const activeSource = ref<'owned' | 'mall'>('owned')
  const frameScrollTop = ref(0)
  const selectedFrameIds = ref<Record<'owned' | 'mall', number>>({
    owned: 1,
    mall: 101
  })
  const ownedFrameItems = Array.from({ length: 18 }, (_, index) => ({
    id: index + 1
  }))
  const mallFrameItems = Array.from({ length: 12 }, (_, index) => ({
    id: index + 101
  }))
  const currentFrameItems = computed(() => (activeSource.value === 'owned' ? ownedFrameItems : mallFrameItems))
  const selectedFrameId = computed(() => selectedFrameIds.value[activeSource.value])

  function handleSelectFrame(id: number) {
    selectedFrameIds.value[activeSource.value] = id
  }

  function handleFrameScroll(event: { detail: { scrollTop: number } }) {
    frameScrollTop.value = event.detail.scrollTop
  }

  function handleSourceChange(value: string) {
    if (value !== 'owned' && value !== 'mall') return
    frameScrollTop.value = 0
    activeSource.value = value
  }

  function handleBack() {
    uni.navigateBack()
  }
</script>

<style scoped lang="scss">
  .avatar-page {
    position: relative;
    height: 100vh;
    overflow: hidden;
    overscroll-behavior: none;
    display: flex;
    flex-direction: column;
    background-color: #f6fbff;
    background-image: url('/static/login/page-bg.png');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: cover;
  }

  .hero-section {
    flex: 0 0 auto;
    padding: calc(var(--status-bar-height) + 56rpx) 30rpx 0;
    box-sizing: border-box;
  }

  .page-title {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    color: rgba(255, 86, 116, 1);
    font-size: 38rpx;
    line-height: 50rpx;
    font-weight: 500;
  }

  .page-title text {
    position: relative;
    z-index: 1;
  }

  .title-lingbao {
    position: absolute;
    z-index: 0;
    left: -38rpx;
    top: -56rpx;
    width: 98rpx;
    height: 140rpx;
    opacity: 0.92;
    pointer-events: none;
  }

  .title-stars {
    position: absolute;
    z-index: 2;
    top: 12rpx;
    right: -32rpx;
    width: 30rpx;
    height: 30rpx;
  }

  .avatar-preview {
    margin-top: 36rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-frame {
    width: 210rpx;
    height: 210rpx;
    border: 2rpx solid rgba(51, 51, 51, 0.18);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.26);
  }

  .avatar-image {
    width: 178rpx;
    height: 178rpx;
  }

  .change-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 126rpx;
    height: 46rpx;
    margin-top: 14rpx;
    padding: 0;
    border-radius: 20rpx;
    color: #333;
    font-size: 22rpx;
    font-weight: 400;
    line-height: 32rpx;
    box-shadow: 0 2rpx 12rpx 0 rgba(190, 190, 190, 0.4);
    background-color: transparent;
  }

  .change-button::after {
    border: 0;
  }

  .frame-panel {
    flex: 1;
    min-height: 0;
    margin-top: 38rpx;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 55%, rgba(255, 255, 255, 0) 100%);
    border-radius: 38rpx 38rpx 0 0;
  }

  .list-header {
    flex: 0 0 92rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
  }

  .all-tab {
    position: relative;
    color: rgba(51, 51, 51, 1);
    font-size: 34rpx;
    line-height: 44rpx;
    font-weight: 500;
  }

  .all-tab::after {
    content: '';
    position: absolute;
    left: 10rpx;
    right: 10rpx;
    bottom: -8rpx;
    height: 4rpx;
    width: 38rpx;
    border-radius: 2rpx;
    background: rgba(51, 51, 51, 1);
  }

  .intro-text {
    // flex: 1;
    min-width: 0;
    color: #9a9a9a;
    font-size: 12px;
    line-height: 32rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .frame-scroll {
    flex: 1;
    min-height: 0;
    padding: 11rpx 12rpx calc(140rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
    scrollbar-gutter: stable;
    overscroll-behavior: contain;
    overflow-anchor: none;
  }

  .frame-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 25rpx;
    row-gap: 17rpx;
  }

  .frame-item {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .frame-thumb {
    width: 210rpx;
    height: 210rpx;
    border-radius: 38rpx;
    border: 4rpx solid transparent;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f4f4;
  }

  .frame-thumb__inner {
    width: 168rpx;
    height: 168rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(229, 229, 229, 1);
  }

  .frame-item--active .frame-thumb {
    border-color: rgba(255, 86, 116, 1);
  }

  .thumb-mark {
    color: rgba(115, 138, 150, 0.8);
    font-size: 24rpx;
    line-height: 32rpx;
  }

  .frame-name {
    margin-top: 10rpx;
    color: rgba(79, 79, 79, 1);
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }

  .end-tip {
    margin-top: 80rpx;
    padding-bottom: 20rpx;
    color: #9a9a9a;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }

  .avatar-bottom-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(env(safe-area-inset-bottom));
    z-index: 2;
    height: 112rpx;
    animation: none;
    transition: none;
  }

  .button-hover {
    opacity: 0.82;
  }

  @media screen and (min-width: 600px) {
    .avatar-page {
      max-width: 402px;
      margin: 0 auto;
    }

  }
</style>
