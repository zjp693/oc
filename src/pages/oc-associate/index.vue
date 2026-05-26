<template>
  <view class="oc-associate-page">
    <AppTopBar title="关联OC" inline-padding="16rpx" />

    <view class="oc-associate-page__body">
      <view class="oc-associate-page__worldview">
        <view class="oc-associate-page__cover">
          <image v-if="worldview.coverUrl" class="oc-associate-page__cover-image" :src="worldview.coverUrl" mode="aspectFill" />
          <wd-icon v-else name="image" size="34rpx" color="#8aa1ac" />
        </view>

        <view class="oc-associate-page__worldview-info">
          <text class="oc-associate-page__worldview-title">{{ worldview.title }}</text>
          <text class="oc-associate-page__worldview-desc">{{ worldview.description }}</text>

          <view class="oc-associate-page__meta-row">
            <view class="oc-associate-page__tags">
              <view
                v-for="item in metaIcons"
                :key="item"
                class="oc-associate-page__tag"
                :style="{ zIndex: item }"
              >
                <wd-icon name="image" size="16rpx" color="#8aa1ac" />
              </view>
            </view>
            <text class="oc-associate-page__linked-count">已有{{ linkedCount }}个关联</text>
          </view>
        </view>
      </view>

      <view class="oc-associate-page__tools">
        <OcTabs
          class="oc-associate-page__tabs"
          :model-value="activeTab"
          :tabs="tabs"
          @change="handleTabChange"
        />

        <view class="oc-associate-page__search">
          <input
            class="oc-associate-page__search-input"
            v-model="keyword"
            placeholder="请输入"
            placeholder-class="oc-associate-page__search-placeholder"
            confirm-type="search"
          />
          <image class="oc-associate-page__search-icon" src="/static/common/search.png" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="oc-associate-page__scroll" scroll-y>
        <view class="oc-associate-page__list">
          <view v-for="item in displayItems" :key="item.id" class="oc-associate-card">
            <view class="oc-associate-card__avatar">
              <image v-if="item.avatarUrl" class="oc-associate-card__avatar-image" :src="item.avatarUrl" mode="aspectFill" />
              <wd-icon v-else name="image" size="24rpx" color="#8aa1ac" />
            </view>

            <text class="oc-associate-card__name">{{ item.name }}</text>

            <button
              class="oc-associate-card__button"
              :class="{ 'oc-associate-card__button--applied': item.status === 'applied' }"
              hover-class="button-hover"
              @click="handleApply(item.id)"
            >
              {{ item.status === 'applied' ? '已申请' : '申请关联' }}
            </button>
          </view>

        </view>
      </scroll-view>
    </view>

    <view class="oc-associate-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import OcTabs from '@/components/oc/OcTabs.vue'

type AssociateTab = 'available' | 'linked'
type AssociateStatus = 'available' | 'applied'

interface AssociateOcItem {
  id: number
  name: string
  avatarUrl?: string
  status: AssociateStatus
}

const keyword = ref('')
const activeTab = ref<AssociateTab>('available')
const metaIcons = Array.from({ length: 7 }, (_, index) => index + 1)

const tabs: Array<{ label: string; value: AssociateTab }> = [
  { label: '可关联', value: 'available' },
  { label: '已关联', value: 'linked' }
]

const worldview = {
  title: '世界观名称名称名称名称名称名称世界观名称名称名称名称名称名称',
  description: '简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介',
  coverUrl: '',
  tags: ['乙', '乙乙乙乙乙']
}

const ocItems = ref<AssociateOcItem[]>([
  { id: 1, name: 'OC名称名称名称', status: 'available' },
  { id: 2, name: 'OC名称名称名称', status: 'applied' },
  { id: 3, name: '海绵宝宝', status: 'available' },
  { id: 4, name: '派大星', status: 'applied' },
  { id: 5, name: 'OC名称名称名称名称', status: 'available' }
])

const linkedCount = computed(() => 88)

const displayItems = computed(() => {
  const text = keyword.value.trim()
  const source = activeTab.value === 'linked'
    ? ocItems.value.filter((item) => item.status === 'applied')
    : ocItems.value

  if (!text) return source
  return source.filter((item) => item.name.includes(text))
})

function handleTabChange(value: string) {
  if (value !== 'available' && value !== 'linked') return
  activeTab.value = value
}

function handleApply(id: number) {
  const target = ocItems.value.find((item) => item.id === id)
  if (!target || target.status === 'applied') return

  target.status = 'applied'
  uni.showToast({
    title: '已申请关联',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.oc-associate-page {
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

.oc-associate-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 16rpx calc(118rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.oc-associate-page__worldview {
  display: flex;
  gap: 18rpx;
  min-width: 0;
  padding: 10rpx 22rpx 10rpx 10rpx;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15rpx;
}

.oc-associate-page__cover {
  width: 333rpx;
  height: 250rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e1e1e1;
}

.oc-associate-page__cover-image {
  width: 100%;
  height: 100%;
}

.oc-associate-page__worldview-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding-top: 0;
}

.oc-associate-page__worldview-title {
  color: #111111;
  font-size: 30rpx;
  line-height: 38rpx;
  font-weight: 500;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.oc-associate-page__worldview-desc {
  margin-top: 6rpx;
  color: #111111;
  font-size: 26rpx;
  line-height: 32rpx;
  font-weight: 400;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.oc-associate-page__meta-row {
  margin-top: auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.oc-associate-page__tags {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  padding-left: 2rpx;
  overflow: hidden;
}

.oc-associate-page__tag {
  flex: 0 0 auto;
  width: 30rpx;
  height: 30rpx;
  margin-left: -12rpx;
  border-radius: 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8e8e8;
  overflow: hidden;
  box-sizing: border-box;
}

.oc-associate-page__tag:first-child {
  margin-left: 0;
}

.oc-associate-page__linked-count {
  flex: 0 0 auto;
  margin-left: auto;
  color: #a5a5a5;
  font-size: 23rpx;
  line-height: 25rpx;
  white-space: nowrap;
}

.oc-associate-page__tools {
  flex: 0 0 auto;
  height: 74rpx;
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-sizing: border-box;
}

.oc-associate-page__tabs {
  flex: 0 0 auto;
  width: auto;
  height: 72rpx;
}

.oc-associate-page__search {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 64rpx;
  padding: 0 25rpx 0 28rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
  background: rgba(255, 255, 255, 0.66);
  box-shadow: 0 2rpx 12rpx rgba(190, 190, 190, 0.12);
  box-sizing: border-box;
  overflow: hidden;
}


.oc-associate-page__search-input {
  flex: 1;
  min-width: 0;
  height: 64rpx;
  color: #333333;
  font-size: 30rpx;
  line-height: 58rpx;
}

.oc-associate-page__search-placeholder {
  color: rgba(204, 204, 204, 0.72);
}

.oc-associate-page__search-icon {
  flex: 0 0 29rpx;
  width: 29rpx;
  height: 29rpx;
  opacity: 0.46;
}

.oc-associate-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.oc-associate-page__list {
  padding: 17rpx 8rpx 28rpx;
  box-sizing: border-box;
}

.oc-associate-card {
  min-width: 0;
  padding: 22rpx 18rpx 22rpx 21rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  gap: 22rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8rpx 20rpx rgba(210, 210, 210, 0.08);
  box-sizing: border-box;
}

.oc-associate-card + .oc-associate-card {
  margin-top: 24rpx;
}

.oc-associate-card__avatar {
  width: 94rpx;
  height: 94rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #e1e1e1;
}

.oc-associate-card__avatar-image {
  width: 100%;
  height: 100%;
}

.oc-associate-card__name {
  flex: 1;
  min-width: 0;
  color: #333333;
  font-size: 30rpx;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-associate-card__button {
  position: relative;
  // flex: 0 0 137rpx;
  width: 159rpx;
  height: 60rpx;
  margin: 0;
  padding: 0;
  border-radius: 19rpx;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 60rpx;
  font-weight: 400;
  background: #ff667a;
  overflow: hidden;
}

.oc-associate-card__button::after {
  border: 0;
}


.oc-associate-card__button--applied {
  color: #999999;
  background: rgba(245, 245, 245, 0.92);
}

.button-hover {
  opacity: 0.84;
}

.oc-associate-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 112rpx;
  overflow: hidden;
  background: #ffffff;
}

@media screen and (min-width: 600px) {
  .oc-associate-page {
    max-width: 402px;
    margin: 0 auto;
  }
}
</style>
