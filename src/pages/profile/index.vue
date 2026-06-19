<template>
  <view class="profile-page" :class="`profile-page--${profileMode}`">
    <view class="profile-page__status"></view>

    <view class="profile-page__header">
      <ProfileAvatar @click="handleAvatarFrame" />

      <view class="profile-info">
        <text class="profile-info__name">角色名称名称</text>
        <view class="profile-info__id-row">
          <text>ID 434343434</text>
          <image class="profile-info__copy" src="/static/oc/icon-copy.png" mode="aspectFit" />
        </view>
      </view>
    </view>

    <ProfileStatsBar
      class="profile-stats"
      :mode="profileMode"
      :items="visibleStats"
      :followed="followed"
      @follow="handleFollow"
      @chat="handleChat"
      @stat-click="handleStatClick"
    />

    <OcTabs
      class="profile-tabs"
      :model-value="activeTab"
      :tabs="profileTabs"
      inline-padding="0"
      item-gap="58rpx"
      active-line-color="#ff667a"
      @change="handleTabChange"
    />

    <view class="profile-body">
      <scroll-view class="profile-body__scroll" scroll-y>
        <view v-if="activeTab === 'oc'" class="profile-body__content profile-body__content--oc">
          <OcGridList
            :items="ocItems"
            :columns="3"
            column-gap="8rpx"
            row-gap="18rpx"
            cover-ratio="1 / 1"
            @item-click="handleOcClick"
          />
        </view>

        <view v-else-if="activeTab === 'worldview'" class="profile-body__content profile-body__content--worldview">
          <OcGridList
            :items="worldviewItems"
            :columns="2"
            column-gap="11rpx"
            row-gap="20rpx"
            cover-ratio="4 / 3"
            :description-lines="2"
            @item-click="handleWorldviewClick"
          />
        </view>

        <view v-else class="profile-body__content profile-body__content--manuscript">
          <ManuscriptCard
            v-for="item in manuscriptItems"
            :key="item.id"
            :title="item.title"
            :chapters="item.chapters"
            :words="item.words"
            :edited-at="item.editedAt"
            @click="handleManuscriptClick(item.id)"
          />
        </view>
      </scroll-view>
    </view>

    <view v-if="showEditMenu" class="profile-menu-mask" @click="closeEditMenu"></view>

    <ProfileActionPopover
      v-if="showEditMenu"
      :label="menuActionText"
      :icon-src="menuActionIcon"
      :tone="isSelfProfile ? 'default' : 'danger'"
      @click="handleMenuAction"
    />

    <view class="profile-bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <view class="profile-bottom__more" @click.stop="toggleEditMenu">
        <image class="profile-bottom__more-icon" src="/static/phone/icon-application-menu-dots.png" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import ManuscriptCard from '@/components/manuscript/ManuscriptCard.vue'
import OcGridList from '@/components/oc/OcGridList.vue'
import OcTabs from '@/components/oc/OcTabs.vue'
import ProfileActionPopover from '@/components/profile/ProfileActionPopover.vue'
import ProfileAvatar from '@/components/profile/ProfileAvatar.vue'
import ProfileStatsBar, { type ProfileStatItem } from '@/components/profile/ProfileStatsBar.vue'
import type { ManuscriptItem } from '@/types/manuscript'
import type { OcItem } from '@/types/oc'

type ProfileTab = 'oc' | 'worldview' | 'manuscript'
type ProfileMode = 'self' | 'other'

const activeTab = ref<ProfileTab>('oc')
const profileMode = ref<ProfileMode>('self')
const showEditMenu = ref(false)
const followed = ref(false)

const isSelfProfile = computed(() => profileMode.value === 'self')

const profileTabs: Array<{ label: string; value: ProfileTab }> = [
  { label: 'OC', value: 'oc' },
  { label: '世界观', value: 'worldview' },
  { label: '文稿', value: 'manuscript' }
]

const stats: ProfileStatItem[] = [
  { value: '23', label: '关注' },
  { value: '23', label: '粉丝' },
  { value: '23 k', label: '被连接' },
  { value: '23.10 k', label: '拥有幻化值' }
]

const visibleStats = computed(() => {
  if (isSelfProfile.value) return stats
  return stats.filter((item) => item.label !== '关注')
})

const menuActionText = computed(() => (isSelfProfile.value ? '编辑资料' : '举报该用户'))
const menuActionIcon = computed(() =>
  isSelfProfile.value ? '/static/profile/icon-edit-profile.png' : '/static/profile/icon-report-user.png'
)

const ocNames = ['角色名称名称名称名称', '海绵宝宝', '派大星']
const ocItems: OcItem[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  title: ocNames[index % ocNames.length],
  description: '角色简介简介内容内容内容'
}))

const worldviewItems: OcItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  title: '世界观名称名称名称名称名称',
  description: '世界观简介内容内容内容内容内容内容'
}))

const manuscriptItems: ManuscriptItem[] = Array.from({ length: 14 }, (_, index) => ({
  id: index + 1,
  title: '文稿名称名称',
  chapters: 0,
  words: '1.2k字',
  editedAt: '2026年01月01日'
}))

onLoad((query) => {
  profileMode.value = query?.mode === 'other' ? 'other' : 'self'
})

function handleTabChange(value: string) {
  if (value !== 'oc' && value !== 'worldview' && value !== 'manuscript') return
  activeTab.value = value
  showEditMenu.value = false
}

function handleAvatarFrame() {
  if (!isSelfProfile.value) return
  uni.navigateTo({ url: '/pages/avatar/index' })
}

function handleOcClick(item: OcItem) {
  uni.navigateTo({ url: `/pages/oc-detail/index?id=${item.id}` })
}

function handleWorldviewClick(item: OcItem) {
  uni.navigateTo({ url: `/pages/worldview-detail/index?id=${item.id}` })
}

function handleManuscriptClick(id: number) {
  uni.navigateTo({ url: `/pages/manuscript-detail/index?id=${id}` })
}

function handleMenuAction() {
  showEditMenu.value = false
  if (!isSelfProfile.value) {
    uni.navigateTo({ url: '/pages/report/index' })
    return
  }

  uni.navigateTo({ url: '/pages/profile-edit/index' })
}

function handleFollow() {
  followed.value = !followed.value
}

function handleChat() {
  uni.navigateTo({ url: '/pages/chat/index?type=user' })
}

function handleStatClick(item: ProfileStatItem) {
  if (!isSelfProfile.value || item.label !== '关注') return
  uni.navigateTo({ url: '/pages/follow/index?mode=mine' })
}

function toggleEditMenu() {
  showEditMenu.value = !showEditMenu.value
}

function closeEditMenu() {
  showEditMenu.value = false
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.profile-page {
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

.profile-page__status {
  flex: 0 0 calc(var(--status-bar-height) + 28rpx);
}

.profile-page__header {
  flex: 0 0 auto;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  gap: 28rpx;
  box-sizing: border-box;
}

.profile-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.profile-info__name {
  position: relative;
  color: #333333;
  font-size: 38rpx;
  line-height: 52rpx;
  font-weight: 600;
  white-space: nowrap;
}

.profile-info__name::after {
  content: "";
  position: absolute;
  left: calc(100% + 4rpx);
  top: 50%;
  width: 30rpx;
  height: 30rpx;
  background-image: url('/static/profile/icon-name-stars.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-45%);
}

.profile-info__id-row {
  margin-top: 8rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #666666;
  font-size: 24rpx;
  line-height: 32rpx;
}

.profile-info__copy {
  width: 24rpx;
  height: 24rpx;
}

.profile-stats {
  flex: 0 0 auto;
  margin-top: 30rpx;
}

.profile-tabs {
  flex: 0 0 72rpx;
  margin-top: 20rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.profile-body {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.profile-body__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  margin-top: 10rpx;
}

.profile-body__content {
  box-sizing: border-box;
}

.profile-body__content--oc {
  padding: 4rpx 20rpx 10rpx;
}

.profile-body__content--worldview {
  padding: 0 20rpx;
}

.profile-body__content--manuscript {
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.profile-menu-mask {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: transparent;
}

.profile-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
  display: grid;
  overflow: hidden;
}

.profile-bottom > * {
  grid-area: 1 / 1;
}

.profile-bottom__more {
  justify-self: end;
  align-self: center;
  z-index: 6;
  width: 48rpx;
  height: 48rpx;
  margin-right: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-bottom__more-icon {
  width: 41rpx;
  height: 41rpx;
}

.button-hover {
  opacity: 0.86;
}
</style>
