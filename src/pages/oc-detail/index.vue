<template>
  <view class="oc-detail-page">
    <view class="oc-detail-page__compact-header" :style="compactHeaderStyle">
      <view class="oc-detail-page__compact-content">
        <view class="oc-detail-page__compact-avatar">
          <wd-icon name="image" size="28rpx" color="#8aa1ac" />
        </view>
        <text class="oc-detail-page__compact-title">{{ detail.title }}</text>
      </view>
    </view>

    <scroll-view
      class="oc-detail-page__scroll"
      :scroll-y="!isPinned"
      :scroll-top="pageScrollTop"
      :scroll-with-animation="false"
      @scroll="handlePageScroll"
    >
      <view class="oc-detail-page__hero-wrap">
        <OcDetailHero :cover-url="detail.coverUrl" />
        <view class="oc-detail-page__hero-gradient" />
      </view>

      <view class="oc-detail-page__content">
        <view class="oc-detail-page__profile">
          <OcDetailProfile
            :title="detail.title"
            :followed="followed"
            @follow="handleFollow"
            @chat="handleChat"
          />
        </view>

        <view class="oc-detail-page__sticky" :class="{ 'oc-detail-page__sticky--compact': isCompactHeaderActive }">
          <view class="oc-detail-page__tabs">
            <OcDetailTabs v-model="activeTab" @change="handleTabChange" />
          </view>
        </view>

        <view class="oc-detail-page__outer-panel" :class="{ 'oc-detail-page__outer-panel--pinned': isPinned }">
          <OcSettingPanel v-if="activeTab === 'setting'" />
          <OcWorldviewPanel v-else @setting="showWorldviewSheet = true" />
        </view>
      </view>
    </scroll-view>

    <scroll-view
      v-if="isPinned"
      :key="activeTab"
      class="oc-detail-page__pinned-scroll"
      scroll-y
      :scroll-top="innerScrollTop"
      :scroll-with-animation="false"
      :style="pinnedScrollStyle"
      @scroll="handleInnerScroll"
      @touchstart="handleInnerTouchStart"
      @touchmove="handleInnerTouchMove"
      @touchend="handleInnerTouchEnd"
      @touchcancel="handleInnerTouchEnd"
    >
      <view class="oc-detail-page__pinned-panel">
        <OcSettingPanel v-if="activeTab === 'setting'" />
        <OcWorldviewPanel v-else @setting="showWorldviewSheet = true" />
      </view>
    </scroll-view>

    <view class="oc-detail-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <view class="oc-detail-page__more" @click="showMoreSheet = true">
        <image class="oc-detail-page__more-icon" src="/static/oc/icon-more-menu.png" mode="aspectFit" />
      </view>
    </view>

    <OcActionSheet
      v-model="showMoreSheet"
      title="更多"
      :actions="moreActions"
      @select="handleMoreAction"
    />
    <OcActionSheet
      v-model="showWorldviewSheet"
      title="世界观设置"
      :actions="worldviewActions"
      @select="handleWorldviewAction"
    />
    <OcConfirmDialog
      v-model="showConfirm"
      content="确定要与当前世界观解除关联吗?"
      @confirm="handleConfirmUnlink"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcActionSheet, { type OcSheetAction } from '@/components/oc-detail/OcActionSheet.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import OcDetailHero from '@/components/oc-detail/OcDetailHero.vue'
import OcDetailProfile from '@/components/oc-detail/OcDetailProfile.vue'
import OcDetailTabs, { type OcDetailTab } from '@/components/oc-detail/OcDetailTabs.vue'
import OcSettingPanel from '@/components/oc-detail/OcSettingPanel.vue'
import OcWorldviewPanel from '@/components/oc-detail/OcWorldviewPanel.vue'

const activeTab = ref<OcDetailTab>('setting')
const pageScrollTop = ref(0)
const currentScrollTop = ref(0)
const innerScrollTop = ref(0)
const currentInnerScrollTop = ref(0)
const stickyTop = ref(0)
const stickyHeight = ref(uni.upx2px(86))
const stickyOffsetTop = ref(0)
const bottomBarHeight = ref(uni.upx2px(112))
const innerTouchStartY = ref(0)
const innerTouchActive = ref(false)
const isPinned = ref(false)
const followed = ref(false)
const showMoreSheet = ref(false)
const showWorldviewSheet = ref(false)
const showConfirm = ref(false)

const detail = {
  id: 1,
  title: '角色名称名称名称',
  coverUrl: '/static/oc/detail-landscape.jpg'
}

const moreActions: OcSheetAction[] = [
  { key: 'edit', label: '编辑', icon: 'edit-1', iconUrl: '/static/oc/icon-edit.png' }
]

const worldviewActions: OcSheetAction[] = [
  { key: 'unlink', label: '解除与当前世界观的关联', icon: 'link' }
]

const compactHeaderHeight = uni.upx2px(110)
const compactHeaderLead = uni.upx2px(140)

const pinnedScrollStyle = computed(() => {
  const pinnedTop = stickyOffsetTop.value + compactHeaderHeight + stickyHeight.value

  return {
    top: `${pinnedTop}px`,
    bottom: `calc(${bottomBarHeight.value}px + env(safe-area-inset-bottom))`
  }
})

const isCompactHeaderActive = computed(() => {
  const stickyTarget = Math.ceil(stickyTop.value)
  const compactTarget = Math.max(0, stickyTarget - compactHeaderLead)
  return stickyTarget > 0 && currentScrollTop.value >= compactTarget
})

const compactHeaderStyle = computed(() => {
  const active = isCompactHeaderActive.value
  const visibility = active ? 'visible' : 'hidden'
  const translateY = active ? 0 : 110
  const pointerEvents = active ? 'auto' : 'none'
  return `visibility: ${visibility}; transform: translateY(${translateY}rpx); pointer-events: ${pointerEvents};`
})

onMounted(() => {
  stickyOffsetTop.value = getStatusBarHeight()
  bottomBarHeight.value = uni.upx2px(112)

  nextTick(() => {
    updatePinnedLayout()
  })
})

function handleTabChange(tab: OcDetailTab) {
  activeTab.value = tab
  innerScrollTop.value = 0
  currentInnerScrollTop.value = 0

  nextTick(() => {
    const stickyTarget = Math.ceil(stickyTop.value)

    if (currentScrollTop.value >= stickyTarget) {
      pageScrollTop.value = stickyTarget
      currentScrollTop.value = stickyTarget
    }

    updatePinnedLayout()
  })
}

function handlePageScroll(event: { detail: { scrollTop: number } }) {
  const nextScrollTop = event.detail.scrollTop

  if (isPinned.value) {
    currentScrollTop.value = stickyTop.value
    return
  }

  currentScrollTop.value = nextScrollTop

  const stickyTarget = Math.ceil(stickyTop.value)
  if (stickyTarget > 0 && nextScrollTop >= stickyTarget) {
    pinPage(Math.max(0, nextScrollTop - stickyTarget))
  }
}

function handleInnerScroll(event: { detail: { scrollTop: number } }) {
  currentInnerScrollTop.value = event.detail.scrollTop
}

function handleInnerTouchStart(event: TouchLikeEvent) {
  innerTouchStartY.value = getTouchY(event)
  innerTouchActive.value = true
}

function handleInnerTouchMove(event: TouchLikeEvent) {
  if (!innerTouchActive.value || currentInnerScrollTop.value > 0) return

  const deltaY = getTouchY(event) - innerTouchStartY.value
  if (deltaY > 12) {
    releasePinnedPage()
  }
}

function handleInnerTouchEnd() {
  innerTouchActive.value = false
}

function pinPage(overflowScrollTop: number) {
  const stickyTarget = Math.ceil(stickyTop.value)
  isPinned.value = true
  pageScrollTop.value = stickyTarget
  currentScrollTop.value = stickyTarget

  if (overflowScrollTop > 0) {
    innerScrollTop.value = currentInnerScrollTop.value + overflowScrollTop
  }
}

function releasePinnedPage() {
  const releaseTarget = Math.max(0, Math.ceil(stickyTop.value) - 1)
  isPinned.value = false
  innerTouchActive.value = false
  innerScrollTop.value = 0
  currentInnerScrollTop.value = 0
  pageScrollTop.value = releaseTarget
  currentScrollTop.value = releaseTarget
}

function updatePinnedLayout() {
  uni
    .createSelectorQuery()
    .select('.oc-detail-page__sticky')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return
      stickyTop.value = Math.max(0, (rect.top || 0) + currentScrollTop.value - stickyOffsetTop.value)
      stickyHeight.value = rect.height || stickyHeight.value
    })
    .select('.oc-detail-page__bottom')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return
      bottomBarHeight.value = rect.height || bottomBarHeight.value
    })
    .exec()
}

function getStatusBarHeight() {
  const systemInfo = uni.getSystemInfoSync()
  return systemInfo.statusBarHeight || 0
}

interface TouchLikeEvent {
  touches?: Array<{ clientY?: number; pageY?: number }>
  changedTouches?: Array<{ clientY?: number; pageY?: number }>
}

function getTouchY(event: TouchLikeEvent) {
  const touch = event.touches?.[0] || event.changedTouches?.[0]
  return touch?.clientY || touch?.pageY || 0
}

function handleFollow() {
  followed.value = !followed.value
}

function handleChat() {
  uni.showToast({
    title: '对话功能待接入',
    icon: 'none'
  })
}

function handleMoreAction(key: string) {
  if (key === 'edit') {
    uni.showToast({
      title: '编辑功能待接入',
      icon: 'none'
    })
  }
}

function handleWorldviewAction(key: string) {
  if (key === 'unlink') {
    showConfirm.value = true
  }
}

function handleConfirmUnlink() {
  uni.showToast({
    title: '已解除关联',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.oc-detail-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.oc-detail-page__scroll {
  height: 100%;
}

.oc-detail-page__compact-header {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 12;
  height: calc(var(--status-bar-height) + 20rpx + 110rpx);
  padding: calc(var(--status-bar-height) + 20rpx) 32rpx 0;
  box-sizing: border-box;
  // background-color: #fff;
  background-image: url('/static/oc/compact-title-bg.png');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100% 110rpx;
  transition: transform 680ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.oc-detail-page__compact-content {
  width: 100%;
  height: 110rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.oc-detail-page__compact-avatar {
  flex: 0 0 70rpx;
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
  overflow: hidden;
}

.oc-detail-page__compact-title {
  flex: 1;
  min-width: 0;
  color: #333;
  font-size: 36rpx;
  line-height: 44rpx;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-detail-page__hero-wrap {
  position: relative;
  height: 822rpx;
  overflow: visible;
}

.oc-detail-page__hero-gradient {
  position: absolute;
  left: 0;
  top: 520rpx;
  z-index: 1;
  width: 100%;
  height: 413rpx;
  background-image: url('/static/oc/detail-gradient.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
  pointer-events: none;
}

.oc-detail-page__content {
  position: relative;
  z-index: 2;
  min-height: 720rpx;
  padding-top: 0;
  overflow: visible;
}

// .oc-detail-page__sticky::before {
//   content: '';
//   position: absolute;
//   left: 0;
//   top: -40rpx;
//   z-index: 0;
//   width: 100%;
//   height: 422rpx;
//   background-image: url('/static/oc/detail-gradient.png');
//   background-repeat: no-repeat;
//   background-position: center top;
//   background-size: 100% 100%;
//   pointer-events: none;
// }

.oc-detail-page__sticky {
  position: sticky;
  top: calc(var(--status-bar-height) + 20rpx);
  z-index: 8;
  margin-top: 0;
  padding-top: 10rpx;
  background: #f5f5f5;
  overflow: hidden;
}

.oc-detail-page__sticky--compact {
  top: calc(var(--status-bar-height) + 20rpx + 110rpx);
}

.oc-detail-page__profile {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: -162rpx;
}

.oc-detail-page__tabs {
  position: relative;
  z-index: 1;
  height: 76rpx;
  margin-top: 0;
  display: flex;
  align-items: center;
  background: #f5f5f5;
}

.oc-detail-page__outer-panel--pinned {
  visibility: hidden;
  pointer-events: none;
}

.oc-detail-page__pinned-scroll {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 7;
  overflow: hidden;
}

.oc-detail-page__pinned-panel {
  min-height: 100%;
}

.oc-detail-page__more {
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

.oc-detail-page__more-icon {
  width: 41rpx;
  height: 41rpx;
}

.oc-detail-page__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 6;
  height: 112rpx;
  overflow: hidden;
  background: #fff;
}

@media screen and (min-width: 600px) {
  .oc-detail-page {
    max-width: 402px;
    margin: 0 auto;
  }
}
</style>
