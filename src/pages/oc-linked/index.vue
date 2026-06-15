<template>
  <view class="oc-linked-page">
    <AppTopBar
      v-model="keyword"
      title="关联OC"
      variant="search"
      inline-padding="30rpx"
      placeholder="请输入"
      @search="handleSearch"
    />

    <view class="oc-linked-page__body">
      <view class="oc-linked-page__tabs-row">
        <OcTabs
          class="oc-linked-page__tabs"
          :model-value="activeTab"
          :tabs="tabs"
          inline-padding="0rpx"
          @change="handleTabChange"
        />
        <view
          v-if="activeTab === 'available'"
          class="oc-linked-page__link-button"
          :class="{ 'oc-linked-page__link-button--active': selectedAvailableIds.length }"
          hover-class="button-hover"
          @click="handleConfirmLink"
        >
          关联
        </view>
      </view>

      <scroll-view class="oc-linked-page__scroll" scroll-y>
        <view class="oc-linked-page__list">
          <view
            v-for="item in displayItems"
            :key="item.id"
            class="oc-linked-card"
            :class="{
              'oc-linked-card--selectable': activeTab === 'available',
              'oc-linked-card--unlink-active': activeUnlinkId === item.id
            }"
            @click="handleCardClick(item.id)"
            @touchstart="handleCardTouchStart(item.id, $event)"
            @touchmove="handleCardTouchMove($event)"
            @touchend="handleCardTouchEnd(item.id)"
            @touchcancel="handleCardTouchEnd(item.id)"
          >
            <view class="oc-linked-card__avatar">
              <image v-if="item.avatarUrl" class="oc-linked-card__avatar-image" :src="item.avatarUrl" mode="aspectFill" />
              <wd-icon v-else name="image" size="24rpx" color="#8aa1ac" />
            </view>

            <view class="oc-linked-card__content">
              <text class="oc-linked-card__name">{{ item.name }}</text>
              <text v-if="activeTab === 'linked'" class="oc-linked-card__time">关联时间:{{ item.linkedAt }}</text>
            </view>

            <image
              v-if="activeTab === 'available'"
              class="oc-linked-card__check"
              :src="selectedAvailableIds.includes(item.id) ? '/static/phone/icon-contact-check.png' : '/static/phone/icon-contact-unchecked.png'"
              mode="aspectFit"
              @click.stop="toggleSelected(item.id)"
            />
            <view
              v-if="activeTab === 'linked'"
              class="oc-linked-card__unlink"
              :class="{ 'oc-linked-card__unlink--active': activeUnlinkId === item.id }"
              @click.stop="handleUnlink(item.id)"
            >
              解除关联
            </view>
          </view>

          <view v-if="!displayItems.length" class="oc-linked-page__empty">
            <text>暂无OC</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="oc-linked-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import OcTabs from '@/components/oc/OcTabs.vue'

type LinkedTab = 'linked' | 'available'
type OcStatus = 'linked' | 'available'

interface LinkedOcItem {
  id: number
  name: string
  status: OcStatus
  linkedAt?: string
  avatarUrl?: string
}

const keyword = ref('')
const activeTab = ref<LinkedTab>('linked')
const selectedAvailableIds = ref<number[]>([])
const activeUnlinkId = ref<number | null>(null)
const touchState = ref({
  id: 0,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0
})
let longPressTimer: ReturnType<typeof setTimeout> | undefined

const tabs: Array<{ label: string; value: LinkedTab }> = [
  { label: '已关联', value: 'linked' },
  { label: '关联新OC', value: 'available' }
]

const ocItems = ref<LinkedOcItem[]>([
  { id: 1, name: 'OC名称名称名称', status: 'linked', linkedAt: '2026.12.22' },
  { id: 2, name: 'OC名称名称名称', status: 'linked', linkedAt: '2026.12.22' },
  { id: 3, name: 'OC名称名称名称', status: 'available' },
  { id: 4, name: 'OC名称名称名称', status: 'available' }
])

const displayItems = computed(() => {
  const text = keyword.value.trim()
  const source = ocItems.value.filter((item) => {
    if (activeTab.value === 'linked') return item.status === 'linked'
    return item.status === 'available'
  })

  if (!text) return source
  return source.filter((item) => item.name.includes(text))
})

function handleTabChange(value: string) {
  if (value !== 'linked' && value !== 'available') return
  activeTab.value = value
  activeUnlinkId.value = null

  if (value === 'linked') {
    selectedAvailableIds.value = []
  }
}

function handleSearch(value: string) {
  keyword.value = value
  activeUnlinkId.value = null
}

function handleCardClick(id: number) {
  if (activeTab.value === 'available') {
    toggleSelected(id)
    return
  }

  if (activeUnlinkId.value === id) {
    activeUnlinkId.value = null
  }
}

function handleCardTouchStart(id: number, event: TouchEvent) {
  if (activeTab.value !== 'linked') return

  const touch = getTouchPoint(event)
  if (!touch) return

  clearLongPressTimer()
  touchState.value = {
    id,
    startX: touch.x,
    startY: touch.y,
    deltaX: 0,
    deltaY: 0
  }
  longPressTimer = setTimeout(() => {
    activeUnlinkId.value = id
    longPressTimer = undefined
  }, 450)
}

function handleCardTouchMove(event: TouchEvent) {
  if (activeTab.value !== 'linked' || !touchState.value.id) return

  const touch = getTouchPoint(event)
  if (!touch) return

  const deltaX = touch.x - touchState.value.startX
  const deltaY = touch.y - touchState.value.startY
  touchState.value = {
    ...touchState.value,
    deltaX,
    deltaY
  }

  if (Math.abs(deltaX) > uni.upx2px(18) || Math.abs(deltaY) > uni.upx2px(18)) {
    clearLongPressTimer()
  }
}

function handleCardTouchEnd(id: number) {
  if (activeTab.value !== 'linked') return

  clearLongPressTimer()
  const { deltaX, deltaY } = touchState.value
  const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > uni.upx2px(56)

  if (isHorizontalSwipe) {
    activeUnlinkId.value = deltaX < 0 ? id : null
  }

  touchState.value = {
    id: 0,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0
  }
}

function toggleSelected(id: number) {
  const target = ocItems.value.find((item) => item.id === id)
  if (!target || target.status !== 'available') return

  selectedAvailableIds.value = selectedAvailableIds.value.includes(id)
    ? selectedAvailableIds.value.filter((item) => item !== id)
    : [...selectedAvailableIds.value, id]
}

function handleConfirmLink() {
  if (!selectedAvailableIds.value.length) return

  ocItems.value = ocItems.value.map((item) => {
    if (!selectedAvailableIds.value.includes(item.id)) return item

    return {
      ...item,
      status: 'linked',
      linkedAt: getTodayText()
    }
  })
  selectedAvailableIds.value = []
  activeTab.value = 'linked'

  uni.showToast({
    title: '已关联',
    icon: 'none'
  })
}

function handleUnlink(id: number) {
  ocItems.value = ocItems.value.map((item) => {
    if (item.id !== id) return item

    return {
      ...item,
      status: 'available',
      linkedAt: undefined
    }
  })
  activeUnlinkId.value = null

  uni.showToast({
    title: '已解除关联',
    icon: 'none'
  })
}

function getTodayText() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

function getTouchPoint(event: TouchEvent) {
  const touch = event.changedTouches?.[0] || event.touches?.[0]
  if (!touch) return undefined

  return {
    x: touch.clientX ?? touch.pageX ?? 0,
    y: touch.clientY ?? touch.pageY ?? 0
  }
}

function clearLongPressTimer() {
  if (!longPressTimer) return

  clearTimeout(longPressTimer)
  longPressTimer = undefined
}

function handleBack() {
  uni.navigateBack()
}

onBeforeUnmount(() => {
  clearLongPressTimer()
})
</script>

<style scoped lang="scss">
.oc-linked-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.oc-linked-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 0 calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.oc-linked-page__tabs-row {
  flex: 0 0 auto;
  // height: 92rpx;
  padding:15rpx 22rpx 15rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.oc-linked-page__tabs {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  height: 72rpx;
  box-sizing: border-box;
}

.oc-linked-page__link-button {
  flex: 0 0 118rpx;
  width: 118rpx;
  height: 65rpx;
  border-radius: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 65rpx;
  font-weight: 600;
  background: #f9b1ba;
}

.oc-linked-page__link-button::after {
  border: 0;
}

.oc-linked-page__link-button--active {
  background: #ff6c7b;
}

.oc-linked-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.oc-linked-page__list {
  padding: 14rpx 22rpx 32rpx;
  box-sizing: border-box;
}

.oc-linked-card {
  position: relative;
  min-width: 0;
  min-height: 130rpx;
  padding: 22rpx 24rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  gap: 26rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8rpx 20rpx rgba(210, 210, 210, 0.08);
  box-sizing: border-box;
  overflow: hidden;
  transition: padding-right 0.18s ease;
}

.oc-linked-card--selectable {
  cursor: pointer;
}

.oc-linked-card--unlink-active {
  padding-right: 186rpx;
}

.oc-linked-card + .oc-linked-card {
  margin-top: 16rpx;
}

.oc-linked-card__avatar {
  flex: 0 0 90rpx;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e1e1e1;
}

.oc-linked-card__avatar-image {
  width: 100%;
  height: 100%;
}

.oc-linked-card__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.oc-linked-card__name {
  min-width: 0;
  color: #333333;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-linked-card__time {
  margin-top: 8rpx;
  color: #888888;
  font-size: 26rpx;
  line-height: 36rpx;
  white-space: nowrap;
}

.oc-linked-card__check {
  flex: 0 0 48rpx;
  width: 48rpx;
  height: 48rpx;
  display: block;
}

.oc-linked-card__unlink {
  position: absolute;
  right: 18rpx;
  top: 50%;
  z-index: 2;
  width: 159rpx;
  height: 60rpx;
  border-radius: 19rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-size: 30rpx;
  line-height: 60rpx;
  font-weight: 400;
  background: rgba(245, 245, 245, 0.92);
  opacity: 0;
  pointer-events: none;
  transform: translate(16rpx, -50%);
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.oc-linked-card__unlink--active {
  opacity: 1;
  pointer-events: auto;
  transform: translate(0, -50%);
}

.oc-linked-page__empty {
  height: 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999999;
  font-size: 26rpx;
}

.button-hover {
  opacity: 0.84;
}

.oc-linked-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
  overflow: hidden;
}

</style>
