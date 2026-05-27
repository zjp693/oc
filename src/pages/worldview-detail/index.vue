<template>
  <view class="worldview-detail">
    <scroll-view class="worldview-detail__scroll" scroll-y @scroll="handleHeaderScroll">
      <view class="worldview-detail__inner">
        <view class="worldview-detail__hero">
          <image v-if="detail.coverUrl" class="worldview-detail__hero-image" :src="detail.coverUrl" mode="aspectFill" />
          <wd-icon v-else name="image" size="32rpx" color="#8aa1ac" />
          <view class="worldview-detail__hero-gradient" />
        </view>

        <view class="worldview-detail__sticky-shell">
          <view class="worldview-detail__sticky" :class="{ 'worldview-detail__sticky--fixed': isHeaderPinned }">
            <view class="worldview-detail__header">
              <view class="worldview-detail__title-row">
                <view class="worldview-detail__title-wrap">
                  <text class="worldview-detail__title">{{ detail.title }}</text>
                  <view class="worldview-detail__title-line" />
                </view>
                <image class="worldview-detail__stars" src="/static/worldview/icon-title-stars.png" mode="aspectFit" />
              </view>

              <view class="worldview-detail__meta-row">
                <text class="worldview-detail__meta-title">世界观中的角色</text>
                <text class="worldview-detail__meta-count">已加入00个角色</text>
              </view>

              <WorldviewRoleRail class="worldview-detail__roles-window" :roles="roles" @role-click="handleOpenAssociateOc" />
            </view>
          </view>
        </view>

        <view class="worldview-detail__content">
          <view class="worldview-detail__summary">
            <text class="worldview-detail__label">简介：</text>
            <text class="worldview-detail__paragraph">{{ detail.intro }}</text>
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
      </view>
    </scroll-view>

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
import { ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcActionSheet, { type OcSheetAction } from '@/components/oc-detail/OcActionSheet.vue'
import WorldviewRoleRail from '@/components/worldview/WorldviewRoleRail.vue'
import type { CustomGroup } from '@/types/custom-attrs'

interface WorldviewDetail {
  coverUrl: string
  title: string
  intro: string
}

interface WorldviewSection {
  id: number
  title: string
  content: string
}

interface WorldviewGroup {
  id: number
  title: string
  sections: WorldviewSection[]
}

interface WorldviewEditPayload {
  id: number
  title: string
  intro: string
  coverImageUrl: string
  linkedOcs: Array<{ id: number; avatarUrl: string }>
  customGroups: CustomGroup[]
  isPublic: boolean
  allowOtherOc: boolean
}

const isHeaderPinned = ref(false)
const showMoreSheet = ref(false)
const worldviewId = 1
const WORLDVIEW_EDIT_STORAGE_KEY = 'worldview-edit-data'

const detail = ref<WorldviewDetail>({
  coverUrl: '/static/oc/detail-landscape.jpg',
  title: '世界观名称名称',
  intro: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
})

const roles = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  avatarUrl: ''
}))

const longText = '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'

const groups = ref<WorldviewGroup[]>([
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
])

const moreActions: OcSheetAction[] = [
  { key: 'edit', label: '编辑', icon: 'edit-1', iconUrl: '/static/oc/icon-edit.png' }
]

const heroHeight = uni.upx2px(562)
const stickyOverlap = uni.upx2px(96)
const headerPinScrollTop = Math.max(0, heroHeight - stickyOverlap)

function handleBack() {
  uni.navigateBack()
}

function handleHeaderScroll(event: { detail: { scrollTop: number } }) {
  const nextPinned = event.detail.scrollTop >= headerPinScrollTop
  if (nextPinned !== isHeaderPinned.value) {
    isHeaderPinned.value = nextPinned
  }
}

function handleMoreAction(key: string) {
  if (key === 'edit') {
    openEditPage()
  }
}

function handleOpenAssociateOc() {
  uni.navigateTo({
    url: `/pages/oc-associate/index?worldviewId=${worldviewId}`
  })
}

function openEditPage() {
  uni.setStorageSync(WORLDVIEW_EDIT_STORAGE_KEY, getEditPayload())
  uni.navigateTo({
    url: `/pages/worldview-create/index?mode=edit&id=${worldviewId}`
  })
}

function getEditPayload(): WorldviewEditPayload {
  return {
    id: worldviewId,
    title: detail.value.title,
    intro: detail.value.intro,
    coverImageUrl: detail.value.coverUrl,
    linkedOcs: roles.map((item) => ({ id: item.id, avatarUrl: item.avatarUrl })),
    customGroups: groups.value.map((group) => ({
      id: group.id,
      title: group.title,
      attrs: group.sections.map((section) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        placeholder: !section.title && !section.content
      }))
    })),
    isPublic: true,
    allowOtherOc: true
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

.worldview-detail__inner {
  min-height: 100%;
  padding-bottom: 278rpx;
  box-sizing: border-box;
}

.worldview-detail__hero {
  position: relative;
  width: 100%;
  height: 562rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.worldview-detail__hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.worldview-detail__hero-gradient {
  position: absolute;
  left: 0;
  right: 0;
  top: 368rpx;
  z-index: 1;
  height: 336rpx;
  background-image: url('/static/worldview/detail-gradient.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
  pointer-events: none;
}

.worldview-detail__sticky-shell {
  position: relative;
  z-index: 11;
  width: 100%;
  min-height: 296.5rpx;
  margin-top: -96rpx;
  box-sizing: border-box;
}

.worldview-detail__sticky {
  position: relative;
  z-index: 11;
  width: 100%;
  background: rgba(245, 245, 245, 0);
  overflow: visible;
  box-sizing: border-box;
}

.worldview-detail__sticky--fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  background: #f5f5f5;
  transform: translateZ(0);
  backface-visibility: hidden;
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
  margin-top: 18rpx;
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
