<template>
  <view class="worldview-detail">
    <scroll-view class="worldview-detail__scroll" scroll-y @scroll="handleHeaderScroll">
      <view class="worldview-detail__hero">
        <image v-if="detail.coverUrl" class="worldview-detail__hero-image" :src="detail.coverUrl" mode="aspectFill" />
        <wd-icon v-else name="image" size="32rpx" color="#8aa1ac" />
        <view class="worldview-detail__hero-gradient" />
      </view>

      <view class="worldview-detail__sticky" :class="{ 'worldview-detail__sticky--ghosted': isFixedHeaderVisible }">
        <view class="worldview-detail__header">
          <view class="worldview-detail__title-row">
            <view class="worldview-detail__title-wrap">
              <text class="worldview-detail__title">世界观名称名称</text>
              <view class="worldview-detail__title-line" />
            </view>
            <image class="worldview-detail__stars" src="/static/worldview/icon-title-stars.png" mode="aspectFit" />
          </view>

          <view class="worldview-detail__meta-row">
            <text class="worldview-detail__meta-title">世界观中的角色</text>
            <text class="worldview-detail__meta-count">已加入00个角色</text>
          </view>

          <view class="worldview-detail__roles-window">
            <view class="worldview-detail__roles-clip">
              <scroll-view class="worldview-detail__roles-scroll" scroll-x :show-scrollbar="false">
                <view class="worldview-detail__roles">
                  <view v-for="item in roles" :key="item.id" class="worldview-detail__role">
                    <image v-if="item.avatarUrl" class="worldview-detail__role-image" :src="item.avatarUrl"
                      mode="aspectFill" />
                    <wd-icon v-else name="image" size="22rpx" color="#8aa1ac" />
                  </view>
                </view>
              </scroll-view>
            </view>
            <image class="worldview-detail__roles-fade" src="/static/worldview/role-scroll-right-fade.png"
              mode="scaleToFill" />
          </view>
        </view>
      </view>

      <view class="worldview-detail__content">
        <view class="worldview-detail__summary">
          <text class="worldview-detail__label">简介：</text>
          <text class="worldview-detail__paragraph">内容内容内容内容内容内容内容内容内容内容内容内容内容内容</text>
        </view>

        <view v-for="group in groups" :key="group.id" class="worldview-detail__group">
          <text class="worldview-detail__group-title">{{ group.title }}</text>

          <view class="worldview-detail__section">
            <template v-for="section in group.sections" :key="section.id">
              <text class="worldview-detail__label">{{ section.title }}</text>
              <text class="worldview-detail__paragraph">{{ section.content }}</text>
            </template>
          </view>
        </view>
      </view>
    </scroll-view>

    <view
      class="worldview-detail__sticky worldview-detail__sticky--fixed"
      :class="{ 'worldview-detail__sticky--fixed-visible': isFixedHeaderVisible }"
      :style="fixedHeaderStyle"
    >
      <view class="worldview-detail__header">
        <view class="worldview-detail__title-row">
          <view class="worldview-detail__title-wrap">
            <text class="worldview-detail__title">世界观名称名称</text>
            <view class="worldview-detail__title-line" />
          </view>
          <image class="worldview-detail__stars" src="/static/worldview/icon-title-stars.png" mode="aspectFit" />
        </view>

        <view class="worldview-detail__meta-row">
          <text class="worldview-detail__meta-title">世界观中的角色</text>
          <text class="worldview-detail__meta-count">已加入00个角色</text>
        </view>

        <view class="worldview-detail__roles-window">
          <view class="worldview-detail__roles-clip">
            <scroll-view class="worldview-detail__roles-scroll" scroll-x :show-scrollbar="false">
              <view class="worldview-detail__roles">
                <view v-for="item in roles" :key="item.id" class="worldview-detail__role">
                  <image v-if="item.avatarUrl" class="worldview-detail__role-image" :src="item.avatarUrl"
                    mode="aspectFill" />
                  <wd-icon v-else name="image" size="22rpx" color="#8aa1ac" />
                </view>
              </view>
            </scroll-view>
          </view>
          <image class="worldview-detail__roles-fade" src="/static/worldview/role-scroll-right-fade.png"
            mode="scaleToFill" />
        </view>
      </view>
    </view>

    <view class="worldview-detail__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <view class="worldview-detail__more" @click="showMoreSheet = true">
        <image class="worldview-detail__more-icon" src="/static/oc/icon-more-menu.png" mode="aspectFit" />
      </view>
    </view>

    <OcActionSheet
      v-model="showMoreSheet"
      title="更多"
      :actions="moreActions"
      @select="handleMoreAction"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcActionSheet, { type OcSheetAction } from '@/components/oc-detail/OcActionSheet.vue'

const currentScrollTop = ref(0)
const showMoreSheet = ref(false)

const detail = {
  coverUrl: '/static/oc/detail-landscape.jpg'
}

const roles = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  avatarUrl: ''
}))

const longText = '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'

const groups = [
  {
    id: 1,
    title: '自定义组标题名称',
    sections: [
      { id: 1, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容' },
      { id: 2, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容' },
      { id: 3, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容' },
      { id: 4, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容' },
      { id: 5, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容' },
      { id: 6, title: '属性名称属性名', content: longText }
    ]
  },
  {
    id: 2,
    title: '自定义组标题名称',
    sections: [
      { id: 4, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容' },
      { id: 5, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容内容内容' }
    ]
  },
  {
    id: 3,
    title: '自定义组标题名称',
    sections: [
      { id: 4, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容' },
      { id: 5, title: '自定义标题名称', content: '内容内容内容内容内容内容内容内容内容内容内容内容' }
    ]
  }
]

const moreActions: OcSheetAction[] = [
  { key: 'edit', label: '编辑', icon: 'edit-1', iconUrl: '/static/oc/icon-edit.png' }
]

const heroHeight = uni.upx2px(562)
const stickyOverlap = uni.upx2px(66)
const headerFixedOffset = getHeaderFixedOffset()
const fixedHeaderLead = uni.upx2px(20)
const headerPinScrollTop = Math.max(0, heroHeight - stickyOverlap - headerFixedOffset)

const isFixedHeaderVisible = computed(() => {
  return currentScrollTop.value >= Math.max(0, headerPinScrollTop - fixedHeaderLead)
})

const fixedHeaderStyle = computed(() => {
  const trackingTop = heroHeight - stickyOverlap - currentScrollTop.value
  const top = Math.max(headerFixedOffset, trackingTop)

  return `top: ${top}px;`
})

function handleBack() {
  uni.navigateBack()
}

function handleHeaderScroll(event: { detail: { scrollTop: number } }) {
  currentScrollTop.value = event.detail.scrollTop
}

function handleMoreAction(key: string) {
  if (key === 'edit') {
    uni.showToast({
      title: '编辑功能待接入',
      icon: 'none'
    })
  }
}

function getHeaderFixedOffset() {
  return getStatusBarHeight() + uni.upx2px(28)
}

function getStatusBarHeight() {
  try {
    const systemInfo = uni.getSystemInfoSync()
    return systemInfo.statusBarHeight || 0
  } catch (error) {
    return 0
  }
}
</script>

<style scoped lang="scss">
.worldview-detail {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.worldview-detail__scroll {
  height: 100%;
}

.worldview-detail__hero {
  position: relative;
  width: 100%;
  height: 562rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e5e5e5;
}

.worldview-detail__hero-image {
  width: 100%;
  height: 100%;
}

.worldview-detail__hero-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -98rpx;
  z-index: 1;
  height: 204rpx;
  background-image: url('/static/oc/detail-gradient.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100% 100%;
  pointer-events: none;
}

.worldview-detail__sticky {
  position: relative;
  z-index: 1;
  margin-top: -66rpx;
  background: #f5f5f5;
}

.worldview-detail__sticky::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -66rpx;
  z-index: 0;
  height: 66rpx;
  background: #f5f5f5;
  pointer-events: none;
}

.worldview-detail__sticky--fixed {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 11;
  width: 100%;
  margin-top: 0;
  box-sizing: border-box;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

.worldview-detail__sticky--fixed-visible {
  visibility: visible;
  opacity: 1;
}

.worldview-detail__sticky--ghosted {
  visibility: hidden;
}

.worldview-detail__header {
  position: relative;
  z-index: 1;
  padding: 0 18rpx 14rpx;
  box-sizing: border-box;
}

.worldview-detail__title-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.worldview-detail__title {
  color: #000;
  font-size: 38rpx;
  line-height: 46rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.worldview-detail__title-wrap {
  position: relative;
  min-width: 0;
}

.worldview-detail__title-line {
  position: absolute;
  left: 50%;
  bottom: -8rpx;
  width: 32rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: #ff667a;
  transform: translateX(-50%);
}

.worldview-detail__stars {
  width: 30rpx;
  height: 30rpx;
  margin-left: 4rpx;
}

.worldview-detail__meta-row {
  margin-top: 42rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.worldview-detail__meta-title {
  color: #333;
  font-size: 30rpx;
  line-height: 34rpx;
  font-weight: 400;
}

.worldview-detail__meta-count {
  color: #999;
  font-size: 23rpx;
  line-height: 30rpx;
  white-space: nowrap;
}

.worldview-detail__roles-window {
  position: relative;
  width: 100%;
  height: 140rpx;
  margin-top: 18rpx;
  background-color: #fcfcfc;
  border-radius: 70rpx;
  overflow: hidden;
}

.worldview-detail__roles-clip {
  position: absolute;
  left: 22rpx;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.worldview-detail__roles-scroll {
  width: 100%;
  height: 100%;
}

.worldview-detail__roles-fade {
  position: absolute;
  top: -4rpx;
  right: 0;
  z-index: 2;
  height: 148rpx;
  width: 70rpx;
  pointer-events: none;
}

.worldview-detail__roles {
  width: max-content;
  height: 94rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 23rpx 0;
}

.worldview-detail__role {
  width: 94rpx;
  height: 94rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e1e1e1;
}

.worldview-detail__role-image {
  width: 100%;
  height: 100%;
}

.worldview-detail__content {
  padding: 20rpx 18rpx calc(144rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.worldview-detail__summary,
.worldview-detail__section {
  border-radius: 14rpx;
  padding: 10rpx 12rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.66);
}

.worldview-detail__label {
  color: #c7c7c7;
  font-size: 34rpx;
  line-height: 1.4;
  font-weight: 400;
}

.worldview-detail__paragraph {
  color: #333;
  font-size: 34rpx;
  line-height: 1.4;
  font-weight: 400;
}

.worldview-detail__group {
  margin-top: 22rpx;
}

.worldview-detail__group-title {
  display: block;
  padding-left: 2rpx;
  color: #c7c7c7;
  font-size: 34rpx;
  // line-height: 38rpx;
  font-weight: 500;
}

.worldview-detail__section {
  margin-top: 12rpx;
  gap: 2rpx;
}

.worldview-detail__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 10;
  height: 112rpx;
  overflow: hidden;
  background: #fff;
}

.worldview-detail__more {
  position: absolute;
  right: 32rpx;
  bottom: 19rpx;
  z-index: 2;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.worldview-detail__more-icon {
  width: 41rpx;
  height: 41rpx;
}

@media screen and (min-width: 1200rpx) {
  .worldview-detail {
    max-width: 804rpx;
    margin: 0 auto;
  }

  .worldview-detail__sticky--fixed {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>
