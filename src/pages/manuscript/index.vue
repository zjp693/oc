<template>
  <view class="manuscript-page">
    <AppPageHeader
      v-model="keyword"
      title="文稿"
      @search="handleSearch"
      @create="handleCreate"
    />

    <view class="manuscript-page__body">
      <OcTabs v-model="activeTab" class="manuscript-page__tabs" />

      <scroll-view class="manuscript-page__scroll" scroll-y>
        <view class="manuscript-page__list">
          <view
            v-for="item in filteredItems"
            :key="item.id"
            class="manuscript-page__swipe"
            @touchstart="handleSwipeStart(item.id, $event)"
            @touchmove="handleSwipeMove(item.id, $event)"
            @touchend="handleSwipeEnd(item.id, $event)"
            @touchcancel="handleSwipeEnd(item.id, $event)"
          >
            <ManuscriptCard
              :title="item.title"
              :chapters="item.chapters"
              :words="item.words"
              :edited-at="item.editedAt"
              @click="handleCardClick(item.id)"
            />
            <button
              class="manuscript-page__delete"
              :class="{ 'manuscript-page__delete--active': isDeleteVisible(item.id) }"
              :style="getDeleteStyle(item.id)"
              hover-class="button-hover"
              @tap.stop
              @click.stop="handleDelete(item.id)"
            >
              删除
            </button>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="manuscript-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import ManuscriptCard from '@/components/manuscript/ManuscriptCard.vue'
import OcTabs from '@/components/oc/OcTabs.vue'
import type { ManuscriptItem } from '@/types/manuscript'

type TabKey = 'all' | 'recent'

const keyword = ref('')
const activeTab = ref<TabKey>('all')
const swipingId = ref<number | null>(null)
const openedId = ref<number | null>(null)
const suppressClickId = ref<number | null>(null)
const swipeStartX = ref(0)
const swipeStartY = ref(0)
const swipeOffset = ref(0)
let suppressClickTimer: ReturnType<typeof setTimeout> | null = null

const manuscripts = ref<ManuscriptItem[]>([
  { id: 1, title: '文稿名称名称', chapters: 0, words: '1.2k字', editedAt: '2026年01月01日' },
  { id: 2, title: '文稿名称名称', chapters: 0, words: '1.2k字', editedAt: '2026年01月01日' }
])

const filteredItems = computed(() => {
  const source = activeTab.value === 'recent' ? manuscripts.value.slice(0, 1) : manuscripts.value
  const text = keyword.value.trim()
  if (!text) return source
  return source.filter((item) => item.title.includes(text))
})

function handleSearch() {
  // 搜索功能暂时使用本地筛选，后续接接口时再启用服务端搜索。
}

function handleCreate() {
  uni.navigateTo({ url: '/pages/manuscript-create/index' })
}

function handleOpenDetail(id: number) {
  uni.navigateTo({ url: `/pages/manuscript-detail/index?id=${id}` })
}

function handleCardClick(id: number) {
  if (suppressClickId.value === id) {
    suppressClickId.value = null
    return
  }

  if (openedId.value === id || swipingId.value === id) {
    resetSwipe()
    return
  }

  handleOpenDetail(id)
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

function handleDelete(id: number) {
  manuscripts.value = manuscripts.value.filter((item) => item.id !== id)
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
.manuscript-page {
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

.manuscript-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 0 calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.manuscript-page__tabs {
  margin-top: 12rpx;
  margin-bottom: 20rpx;
}

.manuscript-page__scroll {
  flex: 1;
  min-height: 0;
}

.manuscript-page__list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 0 22rpx 24rpx;
}

.manuscript-page__swipe {
  position: relative;
  overflow: hidden;
  border-radius: 18rpx;
}

.manuscript-page__delete {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  width: 172rpx;
  height: 192rpx;
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

.manuscript-page__delete::after {
  border: 0;
}

.manuscript-page__delete--active {
  opacity: 1;
}

.manuscript-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

</style>
