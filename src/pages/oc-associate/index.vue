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
              <text v-for="tag in worldview.tags" :key="tag" class="oc-associate-page__tag">{{ tag }}</text>
            </view>
            <text class="oc-associate-page__linked-count">已有{{ linkedCount }}个关联</text>
          </view>
        </view>
      </view>

      <view class="oc-associate-page__tools">
        <view class="oc-associate-page__tabs">
          <view
            v-for="item in tabs"
            :key="item.value"
            class="oc-associate-page__tab"
            :class="{ 'oc-associate-page__tab--active': activeTab === item.value }"
            @click="activeTab = item.value"
          >
            {{ item.label }}
          </view>
        </view>

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

          <wd-empty v-if="!displayItems.length" tip="暂无可关联OC" icon-size="140rpx" />
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

const tabs: Array<{ label: string; value: AssociateTab }> = [
  { label: '可关联', value: 'available' },
  { label: '已关联', value: 'linked' }
]

const worldview = {
  title: '世界观名称名称名称名称名称名称',
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

const linkedCount = computed(() => ocItems.value.filter((item) => item.status === 'applied').length)

const displayItems = computed(() => {
  const text = keyword.value.trim()
  const source = activeTab.value === 'linked'
    ? ocItems.value.filter((item) => item.status === 'applied')
    : ocItems.value

  if (!text) return source
  return source.filter((item) => item.name.includes(text))
})

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
  flex: 0 0 auto;
  display: flex;
  gap: 18rpx;
  min-width: 0;
  padding: 0 18rpx;
  box-sizing: border-box;
}

.oc-associate-page__cover {
  flex: 0 0 288rpx;
  width: 288rpx;
  height: 214rpx;
  border-radius: 8rpx;
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
  padding-top: 2rpx;
}

.oc-associate-page__worldview-title {
  color: #111111;
  font-size: 27rpx;
  line-height: 33rpx;
  font-weight: 700;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.oc-associate-page__worldview-desc {
  margin-top: 6rpx;
  color: #111111;
  font-size: 23rpx;
  line-height: 29rpx;
  font-weight: 500;
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
  justify-content: space-between;
  gap: 12rpx;
}

.oc-associate-page__tags {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 4rpx;
  overflow: hidden;
}

.oc-associate-page__tag {
  flex: 0 1 auto;
  max-width: 96rpx;
  height: 25rpx;
  padding: 0 9rpx;
  border-radius: 5rpx;
  color: #c8c8c8;
  font-size: 17rpx;
  line-height: 25rpx;
  background: rgba(255, 255, 255, 0.68);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.oc-associate-page__linked-count {
  flex: 0 0 auto;
  color: #a5a5a5;
  font-size: 21rpx;
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
  height: 72rpx;
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.oc-associate-page__tab {
  position: relative;
  color: #999999;
  font-size: 31rpx;
  line-height: 72rpx;
  font-weight: 500;
  white-space: nowrap;
}

.oc-associate-page__tab--active {
  color: #333333;
}

.oc-associate-page__tab--active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 9rpx;
  width: 32rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: #333333;
  transform: translateX(-50%);
}

.oc-associate-page__search {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 58rpx;
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

.oc-associate-page__search::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 13rpx 13rpx 0;
  border-color: transparent #62b1ff transparent transparent;
}

.oc-associate-page__search-input {
  flex: 1;
  min-width: 0;
  height: 58rpx;
  color: #333333;
  font-size: 22rpx;
  line-height: 58rpx;
}

.oc-associate-page__search-placeholder {
  color: rgba(204, 204, 204, 0.72);
  font-size: 22rpx;
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
  height: 105rpx;
  padding: 0 18rpx 0 21rpx;
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
  flex: 0 0 73rpx;
  width: 73rpx;
  height: 73rpx;
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
  font-size: 26rpx;
  line-height: 34rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-associate-card__button {
  position: relative;
  flex: 0 0 137rpx;
  width: 137rpx;
  height: 51rpx;
  margin: 0;
  padding: 0;
  border-radius: 10rpx;
  color: #ffffff;
  font-size: 25rpx;
  line-height: 53rpx;
  font-weight: 600;
  background: #ff667a;
  overflow: hidden;
}

.oc-associate-card__button::after {
  border: 0;
}

.oc-associate-card__button::before {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 14rpx 14rpx 0;
  border-color: transparent #62b1ff transparent transparent;
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
