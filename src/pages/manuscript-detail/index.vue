<template>
  <view class="manuscript-detail">
    <AppTopBar
      variant="title-action"
      action-text="新增章节"
      @action="handleCreateChapter"
    >
      <template #leading>
        <ManuscriptEditableTitle
          v-model:title="manuscriptTitle"
          mode="manuscript"
          title-tone="dark"
          icon-tone="dark"
          placeholder="文稿名称名称"
        />
      </template>
    </AppTopBar>

    <view class="manuscript-detail__body">
      <view class="manuscript-detail__controls">
        <OcTabs v-model="activeTab" class="manuscript-detail__tabs" />
        <view class="manuscript-detail__public">
          <text class="manuscript-detail__public-text">公开</text>
          <wd-switch
            v-model="isPublic"
            size="18px"
            active-color="#ff667a"
            inactive-color="#d8d8d8"
          />
        </view>
      </view>

      <scroll-view class="manuscript-detail__scroll" scroll-y>
        <view class="manuscript-detail__list">
          <view
            v-for="item in filteredChapters"
            :key="item.id"
            class="manuscript-detail__swipe"
            @touchstart="handleSwipeStart(item.id, $event)"
            @touchmove="handleSwipeMove(item.id, $event)"
            @touchend="handleSwipeEnd(item.id, $event)"
            @touchcancel="handleSwipeEnd(item.id, $event)"
          >
            <ManuscriptCard
              variant="chapter"
              :order="item.order"
              :title="item.title"
              :words="item.words"
              :edited-at="item.editedAt"
              @click="handleChapterClick(item.id)"
            />
            <button
              class="manuscript-detail__delete"
              :class="{ 'manuscript-detail__delete--active': isDeleteVisible(item.id) }"
              :style="getDeleteStyle(item.id)"
              hover-class="button-hover"
              @tap.stop
              @click.stop="handleDeleteChapter(item.id)"
            >
              删除
            </button>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="manuscript-detail__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import ManuscriptCard from '@/components/manuscript/ManuscriptCard.vue'
import ManuscriptEditableTitle from '@/components/manuscript/ManuscriptEditableTitle.vue'
import OcTabs from '@/components/oc/OcTabs.vue'
import type { ManuscriptChapter } from '@/types/manuscript'

type TabKey = 'all' | 'recent'

const activeTab = ref<TabKey>('all')
const manuscriptTitle = ref('文稿名称名称')
const isPublic = ref(true)
const swipingId = ref<number | null>(null)
const openedId = ref<number | null>(null)
const suppressClickId = ref<number | null>(null)
const swipeStartX = ref(0)
const swipeStartY = ref(0)
const swipeOffset = ref(0)
let suppressClickTimer: ReturnType<typeof setTimeout> | null = null

const chapters = ref<ManuscriptChapter[]>([
  { id: 1, title: '章节名称名称', order: 1, words: '1.2k字', editedAt: '2026年01月01日' },
  { id: 2, title: '章节名称名称', order: 2, words: '1.2k字', editedAt: '2026年01月01日' }
])

const filteredChapters = computed(() => (activeTab.value === 'recent' ? chapters.value.slice(0, 1) : chapters.value))

function handleCreateChapter() {
  uni.navigateTo({ url: '/pages/manuscript-chapter-create/index' })
}

function handleEditChapter(id: number) {
  uni.navigateTo({ url: `/pages/manuscript-chapter-edit/index?id=${id}` })
}

function handleChapterClick(id: number) {
  if (suppressClickId.value === id) {
    suppressClickId.value = null
    return
  }

  if (openedId.value === id || swipingId.value === id) {
    resetSwipe()
    return
  }

  handleEditChapter(id)
}

function handleSwipeStart(id: number, event: TouchLikeEvent) {
  swipingId.value = id
  swipeStartX.value = getTouchX(event)
  swipeStartY.value = getTouchY(event)
  swipeOffset.value = openedId.value === id ? getDeleteWidth() : 0

  if (openedId.value !== id) openedId.value = null
}

function handleSwipeMove(id: number, event: TouchLikeEvent) {
  if (swipingId.value !== id) return

  const deltaX = getTouchX(event) - swipeStartX.value
  const deltaY = getTouchY(event) - swipeStartY.value

  if (Math.abs(deltaY) > Math.abs(deltaX)) return
  event.preventDefault?.()

  const deleteWidth = getDeleteWidth()
  const startOffset = openedId.value === id ? deleteWidth : 0
  swipeOffset.value = Math.max(0, Math.min(deleteWidth, startOffset - deltaX))
}

function handleSwipeEnd(id: number, event: TouchLikeEvent) {
  if (swipingId.value !== id) return

  const deleteWidth = getDeleteWidth()
  const deltaX = getTouchX(event) - swipeStartX.value
  openedId.value = swipeOffset.value >= deleteWidth / 2 || deltaX <= -uni.upx2px(60) ? id : null
  if (Math.abs(deltaX) > uni.upx2px(12)) suppressNextClick(id)
  swipingId.value = null
  swipeOffset.value = 0
}

function handleDeleteChapter(id: number) {
  chapters.value = chapters.value.filter((item) => item.id !== id)
  resetSwipe()
}

function resetSwipe() {
  swipingId.value = null
  openedId.value = null
  suppressClickId.value = null
  swipeOffset.value = 0
}

function suppressNextClick(id: number) {
  suppressClickId.value = id
  if (suppressClickTimer) clearTimeout(suppressClickTimer)

  suppressClickTimer = setTimeout(() => {
    if (suppressClickId.value === id) suppressClickId.value = null
  }, 320)
}

function isDeleteVisible(id: number) {
  return openedId.value === id || (swipingId.value === id && swipeOffset.value > 2)
}

function getDeleteStyle(id: number) {
  const deleteWidth = getDeleteWidth()
  const revealWidth = swipingId.value === id ? swipeOffset.value : openedId.value === id ? deleteWidth : 0
  const translateX = deleteWidth - revealWidth
  const transition = swipingId.value === id ? 'none' : 'transform 0.18s ease'

  return `transform: translate3d(${translateX}px, 0, 0); transition: ${transition};`
}

function getDeleteWidth() {
  return uni.upx2px(172)
}

function handleBack() {
  uni.navigateBack()
}

type TouchLikeEvent = TouchEvent & {
  changedTouches?: TouchList
  touches?: TouchList
}

function getTouchX(event: TouchLikeEvent) {
  return event.changedTouches?.[0]?.clientX ?? event.touches?.[0]?.clientX ?? 0
}

function getTouchY(event: TouchLikeEvent) {
  return event.changedTouches?.[0]?.clientY ?? event.touches?.[0]?.clientY ?? 0
}
</script>

<style scoped lang="scss">
.manuscript-detail {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.manuscript-detail__body {
  flex: 1;
  min-height: 0;
  padding: 0 26rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.manuscript-detail__controls {
  display: flex;
  align-items: center;
}

.manuscript-detail__controls {
  justify-content: space-between;
  gap: 24rpx;
  margin-top: 12rpx;
  margin-bottom: 20rpx;
}

.manuscript-detail__tabs {
  flex: 0 0 214rpx;
  width: 214rpx;
  min-width: 0;
}

.manuscript-detail__public {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.manuscript-detail__public-text {
  color: #b8b8b8;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 400;
  white-space: nowrap;
}

.manuscript-detail__scroll {
  flex: 1;
  min-height: 0;
}

.manuscript-detail__list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 24rpx;
}

.manuscript-detail__swipe {
  position: relative;
  overflow: hidden;
  border-radius: 18rpx;
}

.manuscript-detail__delete {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  width: 172rpx;
  height: 100%;
  margin: 0;
  padding: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: AlibabaPuHui-medium, sans-serif;
  font-size: 30rpx;
  line-height: 40rpx;
  font-weight: 400;
  background: #ff6c7b;
  opacity: 0;
}

.manuscript-detail__delete::after {
  border: 0;
}

.manuscript-detail__delete--active {
  opacity: 1;
}

.manuscript-detail__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 112rpx;
}

@media screen and (min-width: 1200rpx) {
  .manuscript-detail {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>
