<template>
  <view class="phone-page">
    <view class="phone-page__content">
      <view class="phone-profile">
        <view class="phone-profile__avatar">
          <image class="phone-profile__avatar-image" src="/static/home/oc1-avatar.png" mode="aspectFill" />
        </view>

        <view class="phone-profile__body">
          <text class="phone-profile__name">角色名字名字名字</text>
          <view class="phone-profile__meta">
            <text class="phone-profile__dialog">已累计200次对话</text>
          </view>
          <view class="phone-profile__badge">
            <text>幻化值：12.22k</text>
            <image class="phone-profile__spark" src="/static/phone/haFill-39-stars.png" mode="aspectFit" />
          </view>
        </view>

        <view class="phone-profile__close" @click="handleBack">
          <image class="phone-profile__close-icon" src="/static/phone/icon-phone-switch-page.png" mode="aspectFit" />
        </view>
        <text class="phone-profile__day">第N天</text>
      </view>

      <view class="phone-note" @click="handleNoteOpen">
        <view class="phone-note__head">
          <text class="phone-note__title">便签</text>
          <text class="phone-note__time">{{ latestNote.timeLabel }}</text>
        </view>
        <text class="phone-note__subtitle">{{ latestNote.title }}</text>
        <text class="phone-note__content">
          {{ latestNote.content }}
        </text>
      </view>

      <view
        class="phone-page__apps"
        @touchstart="handleAppsTouchStart"
        @touchmove="handleAppsTouchMove"
        @touchend="handleAppsTouchEnd"
        @touchcancel="handleAppsTouchCancel"
      >
        <view class="phone-page__apps-track" :style="appsTrackStyle">
          <view v-for="(page, pageIndex) in appPages" :key="pageIndex" class="phone-page__apps-page">
            <view class="phone-app-grid">
              <view v-for="item in page" :key="item.id" class="phone-app" @click="handleApp(item)">
                <view class="phone-app__icon">
                  <image v-if="item.icon" class="phone-app__icon-image" :src="item.icon" mode="aspectFit" />
                </view>
                <text class="phone-app__label">{{ item.title }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="phone-page__indicator">
        <view class="phone-page__indicator-track">
          <view
            v-for="(_, index) in appPages"
            :key="index"
            class="phone-page__indicator-dot"
            :class="{ 'phone-page__indicator-dot--active': index === activePage }"
          ></view>
        </view>
      </view>
    </view>

    <view class="phone-page__dock">
      <view v-for="item in dockItems" :key="item.id" class="phone-app" @click="handleApp(item)">
        <view class="phone-app__icon">
          <image v-if="item.icon" class="phone-app__icon-image" :src="item.icon" mode="aspectFit" />
        </view>
        <text class="phone-app__label">{{ item.title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePhoneTextRecords } from '@/composables/usePhoneTextRecords'

interface PhoneEntry {
  id: string
  title: string
  icon?: string
  url?: string
}

const appItems: PhoneEntry[] = [
  { id: 'diary', title: '日记', icon: '/static/phone/icon-diary-notebook.png', url: '/pages/phone-diary/index' },
  { id: 'contacts', title: '通讯录', icon: '/static/phone/icon-contacts-me.png', url: '/pages/phone-contact/index' },
  { id: 'moments', title: '朋友圈', icon: '/static/phone/icon-moments-lens.png', url: '/pages/moments/index?scene=oc' },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `app-placeholder-${index}`,
    title: '名称'
  }))
]

const dockItems: PhoneEntry[] = Array.from({ length: 4 }, (_, index) => ({
  id: `dock-placeholder-${index}`,
  title: '名称'
}))

const { list: noteList } = usePhoneTextRecords('note')
const latestNote = noteList.value[0] ?? {
  id: 'note-empty',
  kind: 'note',
  title: '标题标题标题',
  content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容...',
  timeLabel: '昨天12:12'
}

const APP_PAGE_SIZE = 12
const APP_SWIPE_THRESHOLD = uni.upx2px(80)
const activePage = ref(0)
const appsTouchStartX = ref(0)
const appsTouchStartY = ref(0)
const appsTouchCurrentX = ref(0)
const appsTouchCurrentY = ref(0)
const appsTouching = ref(false)
const appPages = computed(() => {
  const pages: PhoneEntry[][] = []
  for (let index = 0; index < appItems.length; index += APP_PAGE_SIZE) {
    pages.push(appItems.slice(index, index + APP_PAGE_SIZE))
  }
  return pages
})
const appsTrackStyle = computed(() => `transform: translate3d(${-activePage.value * 100}%, 0, 0);`)

function handleNoteOpen() {
  uni.navigateTo({
    url: '/pages/phone-note/index'
  })
}

function handleApp(item: PhoneEntry) {
  if (!item.url) return
  uni.navigateTo({
    url: item.url
  })
}

function handleBack() {
  uni.navigateBack()
}

function handleAppsTouchStart(event: TouchLikeEvent) {
  const point = getTouchPoint(event)
  if (!point) return

  appsTouchStartX.value = point.x
  appsTouchStartY.value = point.y
  appsTouchCurrentX.value = point.x
  appsTouchCurrentY.value = point.y
  appsTouching.value = true
}

function handleAppsTouchMove(event: TouchLikeEvent) {
  if (!appsTouching.value) return

  const point = getTouchPoint(event)
  if (!point) return

  appsTouchCurrentX.value = point.x
  appsTouchCurrentY.value = point.y
}

function handleAppsTouchEnd(event: TouchLikeEvent) {
  if (!appsTouching.value) return

  const point = getTouchPoint(event)
  if (point) {
    appsTouchCurrentX.value = point.x
    appsTouchCurrentY.value = point.y
  }

  const deltaX = appsTouchCurrentX.value - appsTouchStartX.value
  const deltaY = appsTouchCurrentY.value - appsTouchStartY.value
  appsTouching.value = false

  if (Math.abs(deltaX) < APP_SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return

  if (deltaX < 0) {
    activePage.value = Math.min(activePage.value + 1, appPages.value.length - 1)
  } else {
    activePage.value = Math.max(activePage.value - 1, 0)
  }
}

function handleAppsTouchCancel() {
  appsTouching.value = false
}

type TouchLikeEvent = TouchEvent | {
  touches?: Array<TouchPoint>
  changedTouches?: Array<TouchPoint>
}

interface TouchPoint {
  clientX?: number
  clientY?: number
  pageX?: number
  pageY?: number
}

function getTouchPoint(event: TouchLikeEvent) {
  const touch = event.changedTouches?.[0] || event.touches?.[0]
  if (!touch) return undefined

  return {
    x: touch.clientX ?? touch.pageX ?? 0,
    y: touch.clientY ?? touch.pageY ?? 0
  }
}
</script>

<style scoped lang="scss">
.phone-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f6fbff;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.phone-page__content {
  height: 100%;
  padding: calc(var(--status-bar-height) + 76rpx) 38rpx calc(254rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  overflow: hidden;
}

.phone-profile {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 180rpx;
}

.phone-profile__avatar {
  width: 168rpx;
  height: 168rpx;
  border: 2rpx solid rgba(187, 187, 187);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.28);
}

.phone-profile__avatar-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}

.phone-profile__body {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
  padding-right: 96rpx;
  box-sizing: border-box;
}

.phone-profile__name {
  display: block;
  color: #111111;
  font-size: 38rpx;
  line-height: 52rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-profile__meta {
  margin-top: 2rpx;
  display: flex;
  align-items: center;
}

.phone-profile__dialog {
  color: rgba(51, 51, 51, 0.56);
  font-size: 30rpx;
  line-height: 42rpx;
}

.phone-profile__badge {
  max-width: 100%;
  height: 50rpx;
  margin-top: 6rpx;
  padding: 0 18rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  color: #ffffff;
  font-size: 23rpx;
  line-height: 50rpx;
  font-weight: 500;
  background: #FF6C7B;
  white-space: nowrap;
  overflow: hidden;
}

.phone-profile__spark {
  flex: 0 0 54rpx;
  width: 54rpx;
  height: 45rpx;
}

.phone-profile__day {
  position: absolute;
  right: 0;
  top: 112rpx;
  color: #ff667a;
  font-size: 27rpx;
  line-height: 36rpx;
  font-weight: 600;
}

.phone-profile__close {
  position: absolute;
  right: 0;
  top: 10rpx;
  width: 64rpx;
  height: 64rpx;
  padding: 15rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
}

.phone-profile__close-icon {
  width: 34rpx;
  height: 34rpx;
}

.phone-note {
  margin-top: 34rpx;
  padding: 22rpx 24rpx 20rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.5);
}

.phone-note__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.phone-note__title {
  color: #111111;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 600;
}

.phone-note__time {
  color: rgba(51, 51, 51, 0.42);
  font-size: 24rpx;
  line-height: 32rpx;
  white-space: nowrap;
}

.phone-note__subtitle,
.phone-note__content {
  display: block;
  color: #111111;
  font-size: 28rpx;
  line-height: 41rpx;
}

.phone-note__subtitle {
  margin-top: 10rpx;
  font-weight: 500;
}

.phone-note__content {
  margin-top: 2rpx;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.phone-app-grid {
  display: grid;
  grid-template-columns: repeat(4, 123rpx);
  justify-content: space-between;
  row-gap: 45rpx;
}

.phone-page__apps {
  margin-top: 42rpx;
  overflow: hidden;
}

.phone-page__apps-track {
  display: flex;
  align-items: flex-start;
  transition: transform 220ms ease;
  will-change: transform;
}

.phone-page__apps-page {
  flex: 0 0 100%;
  width: 100%;
  min-width: 0;
}

.phone-app {
  width: 123rpx;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phone-app__icon {
  width: 123rpx;
  height: 123rpx;
  border-radius: 28rpx;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
}

.phone-app__icon-image {
  width: 45rpx;
  height: 45rpx;
}

.phone-app__label {
  margin-top: 12rpx;
  color: #333333;
  font-size: 24rpx;
  line-height: 32rpx;
  text-align: center;
}

.phone-page__indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(312rpx + env(safe-area-inset-bottom));
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.phone-page__indicator-track {
  width: 106rpx;
  height: 25rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: rgba(255, 255, 255, 0.3);
}

.phone-page__indicator-dot {
  width: 13rpx;
  height: 13rpx;
  border-radius: 50%;
  opacity: 0.45;
  background: rgba(255, 255, 255, 0.92);
}

.phone-page__indicator-dot--active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.92);
}

.phone-page__dock {
  position: absolute;
  left: 38rpx;
  right: 38rpx;
  bottom: calc(49rpx + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(4, 123rpx);
  justify-content: space-between;
}

</style>
