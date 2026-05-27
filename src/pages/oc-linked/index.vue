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
      <OcTabs
        class="oc-linked-page__tabs"
        :model-value="activeTab"
        :tabs="tabs"
        @change="handleTabChange"
      />

      <scroll-view class="oc-linked-page__scroll" scroll-y>
        <view class="oc-linked-page__list">
          <view v-for="item in displayItems" :key="item.id" class="oc-linked-card">
            <view class="oc-linked-card__avatar">
              <image v-if="item.avatarUrl" class="oc-linked-card__avatar-image" :src="item.avatarUrl" mode="aspectFill" />
              <wd-icon v-else name="image" size="24rpx" color="#8aa1ac" />
            </view>

            <view class="oc-linked-card__content">
              <text class="oc-linked-card__name">{{ item.name }}</text>
              <text v-if="activeTab === 'linked'" class="oc-linked-card__time">关联时间:{{ item.linkedAt }}</text>
            </view>

            <button
              v-if="activeTab === 'available'"
              class="oc-linked-card__button"
              :class="{ 'oc-linked-card__button--applied': item.status === 'applied' }"
              hover-class="button-hover"
              @click="handleApply(item.id)"
            >
              {{ item.status === 'applied' ? '已申请' : '申请关联' }}
            </button>
          </view>

          <view v-if="!displayItems.length" class="oc-linked-page__empty">
            <text>暂无OC</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="oc-linked-page__bottom">
      <BottomSwitchBar
        v-model="bottomMode"
        :options="bottomOptions"
        @back="handleBack"
        @change="handleBottomChange"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import OcTabs from '@/components/oc/OcTabs.vue'

type LinkedTab = 'linked' | 'available'
type BottomMode = 'associate' | 'requests'
type OcStatus = 'linked' | 'available' | 'applied'

interface LinkedOcItem {
  id: number
  name: string
  status: OcStatus
  linkedAt?: string
  avatarUrl?: string
}

const keyword = ref('')
const activeTab = ref<LinkedTab>('linked')
const bottomMode = ref<BottomMode>('associate')

const tabs: Array<{ label: string; value: LinkedTab }> = [
  { label: '已关联', value: 'linked' },
  { label: '关联新OC', value: 'available' }
]

const bottomOptions: Array<{ label: string; value: BottomMode }> = [
  { label: '关联OC', value: 'associate' },
  { label: '查看申请', value: 'requests' }
]

const ocItems = ref<LinkedOcItem[]>([
  { id: 1, name: 'OC名称名称名称', status: 'linked', linkedAt: '2026.12.22' },
  { id: 2, name: 'OC名称名称名称', status: 'linked', linkedAt: '2026.12.22' },
  { id: 3, name: 'OC名称名称名称', status: 'available' },
  { id: 4, name: 'OC名称名称名称', status: 'applied' }
])

const displayItems = computed(() => {
  const text = keyword.value.trim()
  const source = ocItems.value.filter((item) => {
    if (activeTab.value === 'linked') return item.status === 'linked'
    return item.status === 'available' || item.status === 'applied'
  })

  if (!text) return source
  return source.filter((item) => item.name.includes(text))
})

function handleTabChange(value: string) {
  if (value !== 'linked' && value !== 'available') return
  activeTab.value = value
}

function handleSearch(value: string) {
  keyword.value = value
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

function handleBottomChange(value: string) {
  if (value !== 'requests') return

  uni.showToast({
    title: '暂无申请',
    icon: 'none'
  })
  bottomMode.value = 'associate'
}

function handleBack() {
  uni.navigateBack()
}
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
  padding: 0 16rpx calc(118rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.oc-linked-page__tabs {
  flex: 0 0 auto;
  height: 72rpx;
  padding: 0 16rpx;
  box-sizing: border-box;
}

.oc-linked-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.oc-linked-page__list {
  padding: 14rpx 8rpx 32rpx;
  box-sizing: border-box;
}

.oc-linked-card {
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

.oc-linked-card__button {
  flex: 0 0 159rpx;
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

.oc-linked-card__button::after {
  border: 0;
}

.oc-linked-card__button--applied {
  color: #999999;
  background: rgba(245, 245, 245, 0.92);
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
  height: 112rpx;
  overflow: hidden;
  background: #ffffff;
}

@media screen and (min-width: 600px) {
  .oc-linked-page {
    max-width: 402px;
    margin: 0 auto;
  }
}
</style>
