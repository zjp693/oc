<template>
  <view class="moments-page">
    <view v-if="pageMenuOpen || activeMomentMenu" class="moments-page__menu-mask" @click="closeMenus"></view>

    <scroll-view class="moments-page__scroll" scroll-y>
      <view class="moments-cover">
        <AppTopBar inline-padding="30rpx">
          <template #content>
            <view class="moments-cover__top-space"></view>
          </template>
        </AppTopBar>

        <image class="moments-cover__image" src="/static/oc/detail-landscape.jpg" mode="aspectFill" />
        <view class="moments-cover__profile">
          <text class="moments-cover__name">{{ sceneProfile.name }}</text>
          <view class="moments-cover__avatar">
            <image class="moments-cover__avatar-image" :src="sceneProfile.avatar" mode="aspectFill" />
          </view>
        </view>
      </view>

      <view class="moments-list">
        <view v-for="item in moments" :key="item.id" class="moment-item">
          <view class="moment-item__avatar">
            <image class="moment-item__avatar-image" :src="item.avatar" mode="aspectFill" />
          </view>

          <view class="moment-item__body">
            <view class="moment-item__head">
              <text class="moment-item__name">{{ item.authorName }}</text>
              <view class="moment-item__tools">
                <text class="moment-item__time">{{ item.createdAt }}</text>
                <button
                  v-if="sceneConfig.canDelete && item.canDelete"
                  class="moment-item__menu"
                  hover-class="button-hover"
                  @click.stop="toggleMomentMenu(item.id)"
                >
                  <image class="moment-item__menu-icon" src="/static/phone/icon-ellipsis.png" mode="aspectFit" />
                </button>
              </view>
            </view>

            <text class="moment-item__content">{{ item.content }}</text>

            <view v-if="activeMomentMenu === item.id" class="moments-popover moments-popover--item" @click.stop>
              <button class="moments-popover__item" hover-class="button-hover" @click="handleDelete(item.id)">
                <image class="moments-popover__icon" src="/static/phone/icon-moments-delete-format.png" mode="aspectFit" />
                <text>删除该朋友圈</text>
              </button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-if="pageMenuOpen" class="moments-popover moments-popover--page" @click.stop>
      <button class="moments-popover__item moments-popover__item--primary" hover-class="button-hover" @click="handlePublish">
        <image class="moments-popover__icon" src="/static/phone/icon-moments-publish-camera.png" mode="aspectFit" />
        <text>发布朋友圈</text>
      </button>
    </view>

    <view class="moments-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <button v-if="sceneConfig.canPublish" class="moments-page__publish-trigger" hover-class="button-hover" @click.stop="togglePageMenu">
        <image class="moments-page__publish-icon" src="/static/phone/icon-application-menu-dots.png" mode="aspectFit" />
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'

type MomentsOwnerType = 'user' | 'oc'

interface MomentItem {
  id: string
  authorName: string
  avatar: string
  content: string
  createdAt: string
  canDelete: boolean
}

interface MomentsSceneConfig {
  ownerType: MomentsOwnerType
  canPublish: boolean
  canDelete: boolean
  canComment: boolean
  showOcComments: boolean
  showUserComments: boolean
}

interface MomentsProfile {
  name: string
  avatar: string
}

const pageMenuOpen = ref(false)
const activeMomentMenu = ref<string | null>(null)
const scene = ref<MomentsOwnerType>('oc')

const sceneConfig = computed<MomentsSceneConfig>(() => {
  if (scene.value === 'user') {
    return {
      ownerType: 'user',
      // canPublish 决定右下角发布按钮是否显示。
      canPublish: true,
      // canDelete 决定每条动态右上角删除菜单是否可用。
      canDelete: true,
      // canComment 决定是否显示/启用评论入口，用户朋友圈暂不做用户评论。
      canComment: false,
      showOcComments: true,
      showUserComments: false
    }
  }

  return {
    ownerType: 'oc',
    // canPublish 决定右下角发布按钮是否显示，OC 手机朋友圈用户不可代发。
    canPublish: false,
    // canDelete 决定每条动态右上角删除菜单是否可用，OC 手机朋友圈用户不可删除。
    canDelete: false,
    // canComment 决定是否显示/启用评论入口。
    canComment: true,
    showOcComments: true,
    showUserComments: true
  }
})

const sceneProfile = computed<MomentsProfile>(() => {
  // ownerType 决定封面昵称、头像、mock 数据来源。
  return sceneConfig.value.ownerType === 'user'
    ? { name: '用户昵称昵称', avatar: '/static/home/oc1-avatar.png' }
    : { name: 'OC昵称昵称', avatar: '/static/home/oc1-avatar.png' }
})

const userMoments = ref<MomentItem[]>([
  {
    id: 'user-moment-1',
    authorName: '用户昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    canDelete: true,
    content:
      '用户朋友圈内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容...'
  },
  {
    id: 'user-moment-2',
    authorName: '用户昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '昨天12:12',
    canDelete: true,
    content:
      '用户发布的朋友圈内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容...'
  }
])

const ocMoments = ref<MomentItem[]>([
  {
    id: 'oc-moment-1',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    canDelete: false,
    content:
      '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容...'
  },
  {
    id: 'oc-moment-2',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    canDelete: false,
    content:
      '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容...'
  },
  {
    id: 'oc-moment-3',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    canDelete: false,
    content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
  },
  {
    id: 'oc-moment-4',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    canDelete: false,
    content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
  }
])

const moments = computed(() => (sceneConfig.value.ownerType === 'user' ? userMoments.value : ocMoments.value))

onLoad((query) => {
  scene.value = normalizeScene(query?.scene)
})

function normalizeScene(value: unknown): MomentsOwnerType {
  const text = Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '')
  return text === 'user' ? 'user' : 'oc'
}

function togglePageMenu() {
  if (!sceneConfig.value.canPublish) return
  activeMomentMenu.value = null
  pageMenuOpen.value = !pageMenuOpen.value
}

function toggleMomentMenu(id: string) {
  if (!sceneConfig.value.canDelete) return
  pageMenuOpen.value = false
  activeMomentMenu.value = activeMomentMenu.value === id ? null : id
}

function closeMenus() {
  pageMenuOpen.value = false
  activeMomentMenu.value = null
}

function handlePublish() {
  if (!sceneConfig.value.canPublish) return
  closeMenus()
  uni.navigateTo({
    url: '/pages/moments-publish/index'
  })
}

function handleDelete(id: string) {
  if (!sceneConfig.value.canDelete) return
  userMoments.value = userMoments.value.filter((item) => item.id !== id)
  closeMenus()
  uni.showToast({
    title: '已删除',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.moments-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
}

.moments-page__menu-mask {
  position: absolute;
  z-index: 18;
  inset: 0;
  background: transparent;
}

.moments-cover {
  position: relative;
  height: 750rpx;
  background: #e5e5e5;
  overflow: visible;
}

.moments-cover__top-space {
  width: 100%;
  height: 1rpx;
}

.moments-cover__image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.moments-cover__profile {
  position: absolute;
  right: 24rpx;
  bottom: 20rpx;
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
}

.moments-cover__name {
  max-width: 260rpx;
  padding-bottom: 24rpx;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 34rpx;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.moments-cover__avatar {
  width: 109rpx;
  height: 109rpx;
  padding: 9rpx;
  box-sizing: border-box;
  border: 2rpx solid #bbbbbb;
}

.moments-cover__avatar-image {
  width: 100%;
  height: 100%;
}

.moments-popover {
  position: absolute;
  z-index: 20;
  padding: 8rpx 0;
  border-radius: 12rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.16);
}

.moments-popover--page {
  right: 28rpx;
  bottom: calc(116rpx + env(safe-area-inset-bottom));
}

.moments-popover--item {
  top: 44rpx;
  right: 0;
}

.moments-popover__item {
  width: 100%;
  margin: 0;
  padding: 12rpx 28rpx;
  border-radius: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #333333;
  font-size: 28rpx;
  line-height: 38rpx;
  font-weight: 600;
  background: transparent;
}

.moments-popover__item::after {
  border: 0;
}

.moments-popover__item--primary {
  color: #ff667a;
}

.moments-popover__icon {
  width: 34rpx;
  height: 34rpx;
}

.moments-page__scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: #f7f7f7;
}

.moments-list {
  padding: 16rpx 30rpx 28rpx;
  box-sizing: border-box;
}

.moment-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 0 18rpx;
  border-bottom: 1rpx solid rgba(229, 229, 229, 0.98);
  box-sizing: border-box;
}

.moment-item__avatar {
  flex: 0 0 82rpx;
  width: 82rpx;
  height: 82rpx;
  padding: 7rpx;
  border: 2rpx solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.moment-item__avatar-image {
  width: 67rpx;
  height: 67rpx;
  border: 5rpx solid #ffffff;
  border-radius: 50%;
  box-sizing: border-box;
}

.moment-item__body {
  position: relative;
  flex: 1;
  min-width: 0;
  padding-right: 2rpx;
  box-sizing: border-box;
}

.moment-item__head {
  min-height: 42rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14rpx;
}

.moment-item__name {
  flex: 1;
  min-width: 0;
  color: #8bb6ce;
  font-size: 30rpx;
  line-height: 36rpx;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.moment-item__tools {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.moment-item__time {
  color: #9a9a9a;
  font-size: 30rpx;
  line-height: 32rpx;
  white-space: nowrap;
  margin-right: 8rpx;
}

.moment-item__menu {
  width: 45rpx;
  height: 45rpx;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.moment-item__menu::after {
  border: 0;
}

.moment-item__menu-icon {
  width: 45rpx;
  height: 45rpx;
}

.moment-item__content {
  display: -webkit-box;
  margin-top: 0;
  color: #333333;
  font-size: 30rpx;
  line-height: 44rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.moments-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 6;
  height: 100rpx;
}

.moments-page__publish-trigger {
  position: absolute;
  right: 24rpx;
  top: 0;
  width: 92rpx;
  height: 74rpx;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.moments-page__publish-trigger::after {
  border: 0;
}

.moments-page__publish-icon {
  width: 41rpx;
  height: 41rpx;
}

.button-hover {
  opacity: 0.82;
}
</style>
