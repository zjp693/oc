<template>
  <view class="oc-detail-page">
    <view class="oc-detail-page__compact-bar" :style="compactHeaderStyle">
      <view class="oc-detail-page__compact-content">
        <view class="oc-detail-page__compact-avatar">
          <wd-icon name="image" size="28rpx" color="#8aa1ac" />
        </view>
        <text class="oc-detail-page__compact-title">{{ detail.title }}</text>
      </view>
    </view>

    <scroll-view
      class="oc-detail-page__scroll"
      scroll-y
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

        <view class="oc-detail-page__sticky-anchor" />
        <view class="oc-detail-page__sticky-shell">
          <view
            class="oc-detail-page__sticky"
            :class="{ 'oc-detail-page__sticky--fixed': isStickyPinned }"
            :style="stickyStyle"
          >
            <view class="oc-detail-page__tabs">
              <OcDetailTabs :model-value="activeTab" @change="handleTabChange" />
            </view>
          </view>
        </view>

        <view
          class="oc-detail-page__outer-panel"
          :style="panelViewportStyle"
          @touchstart="handlePanelSwipeStart"
          @touchmove="handlePanelSwipeMove"
          @touchend="handlePanelSwipeEnd"
          @touchcancel="handlePanelSwipeCancel"
        >
          <view class="oc-detail-page__panel-track" :style="panelTrackStyle">
            <view class="oc-detail-page__panel oc-detail-page__panel--setting">
              <OcSettingPanel />
            </view>
            <view class="oc-detail-page__panel oc-detail-page__panel--worldview">
              <OcWorldviewPanel @setting="showWorldviewSheet = true" />
            </view>
          </view>
        </view>
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
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
const stickyTop = ref(0)
const isStickyPinned = ref(false)
// 只记录吸顶后的相对滚动量：页面 scrollTop - 吸顶边界。
// 这样仍然是一层滚动，但设定/世界观能各自记住吸顶后的内容位置。
const tabContentOffsets = ref<Record<OcDetailTab, number>>({
  setting: 0,
  worldview: 0
})
const tabPanelHeights = ref<Record<OcDetailTab, number>>({
  setting: 0,
  worldview: 0
})
// 切换 tab 会触发布局变化和一次程序滚动，这段期间不把滚动事件写回 tab 位置。
const isSwitchingTab = ref(false)
const panelSwipeStartX = ref(0)
const panelSwipeStartY = ref(0)
const panelSwipeCurrentX = ref(0)
const panelSwipeCurrentY = ref(0)
const isPanelSwiping = ref(false)
const followed = ref(false)
const showMoreSheet = ref(false)
const showWorldviewSheet = ref(false)
const showConfirm = ref(false)
let tabSwitchGuardTimer: ReturnType<typeof setTimeout> | undefined

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

const compactHeaderLead = uni.upx2px(20)
const compactHeaderFallbackTop = uni.upx2px(740)
const compactHeaderFadeDistance = uni.upx2px(56)
const compactHeaderHeight = uni.upx2px(110)
const statusBarHeight = getStatusBarHeight()
const stickyPinnedTop = statusBarHeight + compactHeaderHeight
const stickyTabsHeight = uni.upx2px(76)
const bottomBarHeight = uni.upx2px(112)
const panelSwipeThreshold = uni.upx2px(96)

const compactHeaderProgress = computed(() => {
  const stickyTarget = Math.ceil(stickyTop.value || compactHeaderFallbackTop)
  const pinTarget = Math.max(0, stickyTarget - stickyPinnedTop)
  const fadeStart = Math.max(0, pinTarget - compactHeaderLead - compactHeaderFadeDistance)
  const progress = (currentScrollTop.value - fadeStart) / compactHeaderFadeDistance

  return Math.max(0, Math.min(1, progress))
})

const compactHeaderStyle = computed(() => {
  const opacity = isStickyPinned.value ? 1 : compactHeaderProgress.value
  const translateY = -8 * (1 - opacity)
  const visibility = opacity > 0 ? 'visible' : 'hidden'
  const pointerEvents = opacity >= 0.98 ? 'auto' : 'none'
  return `visibility: ${visibility}; opacity: ${opacity}; transform: translateY(${translateY}rpx); pointer-events: ${pointerEvents};`
})

const stickyStyle = computed(() => {
  const opacity = isStickyPinned.value ? 1 : compactHeaderProgress.value
  return `--oc-detail-sticky-top: ${stickyPinnedTop}px; background-color: rgba(245, 245, 245, ${opacity});`
})

const panelViewportStyle = computed(() => {
  const activePanelHeight = tabPanelHeights.value[activeTab.value]

  return activePanelHeight > 0 ? `height: ${activePanelHeight}px;` : ''
})

const panelTrackStyle = computed(() => {
  const translateX = activeTab.value === 'setting' ? 0 : -100

  // 这里只做内容面板的横向切换动画，不开启 scroll-view 的滚动动画。
  return `transform: translate3d(${translateX}%, 0, 0);`
})

onMounted(() => {
  nextTick(() => {
    updateStickyLayout()
    updateActivePanelHeight()
  })
})

onBeforeUnmount(() => {
  clearTabSwitchGuardTimer()
})

function handleTabChange(tab: OcDetailTab) {
  if (tab === activeTab.value) return

  const shouldRestoreContentOffset = isPagePinned(currentScrollTop.value)
  syncActiveTabOffset(currentScrollTop.value)
  startTabSwitchGuard()

  activeTab.value = tab

  nextTick(() => {
    updateActivePanelHeight(tab, () => {
      if (shouldRestoreContentOffset) {
        restoreTabContentOffset(tab)
      }

      finishTabSwitchGuard()
    })
  })
}

function handlePanelSwipeStart(event: SwipeTouchEvent) {
  const point = getTouchPoint(event)
  if (!point) return

  panelSwipeStartX.value = point.x
  panelSwipeStartY.value = point.y
  panelSwipeCurrentX.value = point.x
  panelSwipeCurrentY.value = point.y
  isPanelSwiping.value = true
}

function handlePanelSwipeMove(event: SwipeTouchEvent) {
  if (!isPanelSwiping.value) return

  const point = getTouchPoint(event)
  if (!point) return

  panelSwipeCurrentX.value = point.x
  panelSwipeCurrentY.value = point.y
}

function handlePanelSwipeEnd(event: SwipeTouchEvent) {
  if (!isPanelSwiping.value) return

  const point = getTouchPoint(event)
  if (point) {
    panelSwipeCurrentX.value = point.x
    panelSwipeCurrentY.value = point.y
  }

  const deltaX = panelSwipeCurrentX.value - panelSwipeStartX.value
  const deltaY = panelSwipeCurrentY.value - panelSwipeStartY.value
  isPanelSwiping.value = false

  // 横向滑动足够明显时才切换 tab，避免正常上下滚动被误判。
  if (Math.abs(deltaX) < panelSwipeThreshold || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return

  switchTabBySwipe(deltaX < 0 ? 'next' : 'prev')
}

function handlePanelSwipeCancel() {
  isPanelSwiping.value = false
}

function switchTabBySwipe(direction: 'prev' | 'next') {
  const nextTab = direction === 'next'
    ? getNextDetailTab(activeTab.value)
    : getPrevDetailTab(activeTab.value)

  if (!nextTab || nextTab === activeTab.value) return

  handleTabChange(nextTab)
}

function getNextDetailTab(tab: OcDetailTab) {
  return tab === 'setting' ? 'worldview' : undefined
}

function getPrevDetailTab(tab: OcDetailTab) {
  return tab === 'worldview' ? 'setting' : undefined
}

function handlePageScroll(event: { detail: { scrollTop: number } }) {
  const nextScrollTop = event.detail.scrollTop
  currentScrollTop.value = nextScrollTop
  updateStickyPinned(nextScrollTop)

  if (!stickyTop.value) {
    updateStickyLayout()
  }

  syncActiveTabOffset(nextScrollTop)
}

function syncActiveTabOffset(scrollTop: number) {
  if (isSwitchingTab.value || !isPagePinned(scrollTop)) return

  tabContentOffsets.value[activeTab.value] = Math.max(0, scrollTop - getStickyPinScrollTop())
}

function restoreTabContentOffset(tab: OcDetailTab) {
  const nextOffset = clampTabContentOffset(tabContentOffsets.value[tab], tab)
  tabContentOffsets.value[tab] = nextOffset
  restorePageScrollTop(getStickyPinScrollTop() + nextOffset)
}

function clampTabContentOffset(offset: number, tab: OcDetailTab) {
  return Math.max(0, Math.min(Math.round(offset || 0), getTabMaxContentOffset(tab)))
}

function getTabMaxContentOffset(tab: OcDetailTab) {
  const visiblePanelHeight = Math.max(
    0,
    getWindowHeight() - stickyPinnedTop - stickyTabsHeight - bottomBarHeight - getSafeAreaBottom()
  )

  return Math.max(0, tabPanelHeights.value[tab] - visiblePanelHeight)
}

function isPagePinned(scrollTop: number) {
  return Boolean(stickyTop.value) && scrollTop >= getStickyPinScrollTop()
}

function updateStickyPinned(scrollTop: number) {
  const nextPinned = isPagePinned(scrollTop)
  if (nextPinned !== isStickyPinned.value) {
    isStickyPinned.value = nextPinned
  }
}

function getStickyPinScrollTop() {
  const stickyTarget = Math.ceil(stickyTop.value || compactHeaderFallbackTop)
  return Math.max(0, stickyTarget - stickyPinnedTop)
}

function restorePageScrollTop(scrollTop: number) {
  const nextScrollTop = Math.max(0, Math.round(scrollTop))

  if (pageScrollTop.value === nextScrollTop) {
    currentScrollTop.value = nextScrollTop
    return
  }

  pageScrollTop.value = nextScrollTop
  currentScrollTop.value = nextScrollTop
}

function updateStickyLayout() {
  uni
    .createSelectorQuery()
    .select('.oc-detail-page__sticky-anchor')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return
      stickyTop.value = Math.max(0, (rect.top || 0) + currentScrollTop.value)
      updateStickyPinned(currentScrollTop.value)
    })
    .exec()
}

function updateActivePanelHeight(tab: OcDetailTab = activeTab.value, done?: () => void) {
  uni
    .createSelectorQuery()
    .select(`.oc-detail-page__panel--${tab}`)
    .boundingClientRect((rect) => {
      if (rect && !Array.isArray(rect)) {
        tabPanelHeights.value[tab] = rect.height || 0
      }

      done?.()
    })
    .exec()
}

function getStatusBarHeight() {
  const systemInfo = uni.getSystemInfoSync()
  return systemInfo.statusBarHeight || 0
}

function getWindowHeight() {
  const systemInfo = uni.getSystemInfoSync()
  return systemInfo.windowHeight || 0
}

function getSafeAreaBottom() {
  const systemInfo = uni.getSystemInfoSync() as { safeAreaInsets?: { bottom?: number } }
  return systemInfo.safeAreaInsets?.bottom || 0
}

function startTabSwitchGuard() {
  clearTabSwitchGuardTimer()
  isSwitchingTab.value = true
}

function finishTabSwitchGuard() {
  clearTabSwitchGuardTimer()
  tabSwitchGuardTimer = setTimeout(() => {
    isSwitchingTab.value = false
  }, 120)
}

function clearTabSwitchGuardTimer() {
  if (!tabSwitchGuardTimer) return

  clearTimeout(tabSwitchGuardTimer)
  tabSwitchGuardTimer = undefined
}

type SwipeTouchEvent = TouchEvent | TouchLikeEvent

interface TouchLikeEvent {
  touches?: Array<TouchPoint>
  changedTouches?: Array<TouchPoint>
}

interface TouchPoint {
  clientX?: number
  clientY?: number
  pageX?: number
  pageY?: number
}

function getTouchPoint(event: SwipeTouchEvent) {
  const touch = event.changedTouches?.[0] || event.touches?.[0]
  if (!touch) return undefined

  return {
    x: touch.clientX ?? touch.pageX ?? 0,
    y: touch.clientY ?? touch.pageY ?? 0
  }
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
  scroll-behavior: auto;
}

.oc-detail-page__compact-bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 12;
  height: calc(var(--status-bar-height) + 110rpx);
  padding-top: var(--status-bar-height);
  box-sizing: border-box;
  overflow: hidden;
  background: #f5f5f5;
  transition: none;
  will-change: transform, opacity;
}

.oc-detail-page__compact-content {
  width: 100%;
  height: 78rpx;
  padding: 16rpx 38rpx 0;
  display: flex;
  align-items: center;
  gap: 18rpx;
  box-sizing: border-box;
}

.oc-detail-page__compact-avatar {
  flex: 0 0 58rpx;
  width: 58rpx;
  height: 58rpx;
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
  font-size: 34rpx;
  line-height: 42rpx;
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
  padding: 0 0 calc(138rpx + env(safe-area-inset-bottom));
  overflow: visible;
  box-sizing: border-box;
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

.oc-detail-page__sticky-shell {
  position: relative;
  z-index: 8;
  width: 100%;
  height: 76rpx;
  box-sizing: border-box;
}

.oc-detail-page__sticky {
  position: relative;
  z-index: 8;
  width: 100%;
  background: rgba(245, 245, 245, 0);
  overflow: hidden;
}

.oc-detail-page__sticky--fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: var(--oc-detail-sticky-top);
  z-index: 11;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.oc-detail-page__sticky-anchor {
  width: 100%;
  height: 0;
  pointer-events: none;
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
}

.oc-detail-page__outer-panel {
  width: 100%;
  overflow: hidden;
}

.oc-detail-page__panel-track {
  width: 100%;
  display: flex;
  align-items: flex-start;
  transition: transform 220ms ease;
  will-change: transform;
}

.oc-detail-page__panel {
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
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

  .oc-detail-page__sticky--fixed {
    max-width: 402px;
    margin: 0 auto;
  }
}
</style>
