<template>
  <view class="worldview-page">
    <image class="worldview-page__preload" src="/static/worldview/role-scroll-right-fade.png" mode="scaleToFill" />

    <AppPageHeader
      v-model="keyword"
      title="世界观"
      @search="handleSearch"
      @create="handleCreate"
    />

    <view class="worldview-page__body">
      <OcTabs v-if="!isDraftMode" v-model="activeTab" class="worldview-page__tabs" />
      <view v-else class="worldview-page__draft-head">
        <text class="worldview-page__draft-title">草稿箱</text>
      </view>

      <scroll-view class="worldview-page__scroll" scroll-y>
        <view class="worldview-page__grid-wrap">
          <OcGridList
            :items="displayItems"
            :empty-tip="emptyTip"
            :columns="2"
            column-gap="11rpx"
            row-gap="19rpx"
            cover-ratio="4 / 3"
            :description-lines="2"
            @item-click="handleOpenItem"
          />
        </view>
      </scroll-view>
    </view>

    <view class="worldview-page__bottom">
      <BottomSwitchBar
        :model-value="bottomValue"
        :options="bottomOptions"
        @change="handleBottomChange"
        @back="handleBack"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import OcGridList from '@/components/oc/OcGridList.vue'
import OcTabs from '@/components/oc/OcTabs.vue'
import type { WorldviewItem } from '@/types/worldview'

type WorldviewTabKey = 'all' | 'recent'

const keyword = ref('')
const activeTab = ref<WorldviewTabKey>('all')
const bottomValue = ref('worldview')

const bottomOptions = [
  { label: '世界观', value: 'worldview' },
  { label: '草稿箱', value: 'draft' }
]

const worldviewItems = ref<WorldviewItem[]>([
  {
    id: 1,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容',
    status: 'rejected'
  },
  {
    id: 2,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容',
    status: 'reviewing'
  },
  {
    id: 3,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容',
    locked: true
  },
  {
    id: 4,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容'
  },
  ...Array.from({ length: 24 }, (_, index) => {
    const id = index + 5
    const item: WorldviewItem = {
      id,
      title: '世界观名称名称名称名称名称',
      description: '世界观简介内容内容内容内容内容内容',
      locked: index === 7 || index === 18
    }
    if (index === 3) item.status = 'reviewing'
    if (index === 10) item.status = 'rejected'
    return item
  })
])

const draftItems = ref<WorldviewItem[]>([
  {
    id: 101,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容'
  },
  {
    id: 102,
    title: '世界观名称名称名称名称名称',
    description: '世界观简介内容内容内容内容内容内容'
  },
  ...Array.from({ length: 22 }, (_, index) => {
    const id = index + 103
    return {
      id,
      title: '世界观名称名称名称名称名称',
      description: '世界观简介内容内容内容内容内容内容',
      locked: index === 5 || index === 16
    }
  })
])

const recentIds = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

const isDraftMode = computed(() => bottomValue.value === 'draft')

const filteredWorldviewItems = computed(() => {
  const source = activeTab.value === 'recent'
    ? worldviewItems.value.filter((item) => recentIds.includes(item.id))
    : worldviewItems.value
  const text = keyword.value.trim()

  if (!text) return source
  return source.filter((item) => item.title.includes(text) || item.description.includes(text))
})

const filteredDraftItems = computed(() => {
  const text = keyword.value.trim()

  if (!text) return draftItems.value
  return draftItems.value.filter((item) => item.title.includes(text) || item.description.includes(text))
})

const displayItems = computed(() => {
  return isDraftMode.value ? filteredDraftItems.value : filteredWorldviewItems.value
})

const emptyTip = computed(() => {
  return isDraftMode.value ? '暂无草稿' : '暂无世界观'
})

function handleSearch() {
  // 搜索功能暂时使用本地筛选，后续接接口时再启用服务端搜索。
}

function handleCreate() {
  uni.navigateTo({
    url: '/pages/worldview-create/index'
  })
}

function handleOpenItem(item: WorldviewItem) {
  if (isDraftMode.value) {
    uni.navigateTo({
      url: `/pages/worldview-create/index?draftId=${item.id}`
    })
    return
  }

  uni.navigateTo({
    url: `/pages/worldview-detail/index?id=${item.id}`
  })
}

function handleBottomChange(value: string) {
  bottomValue.value = value
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.worldview-page {
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

.worldview-page__preload {
  position: absolute;
  width: 1rpx;
  height: 1rpx;
  opacity: 0;
  pointer-events: none;
}

.worldview-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 0 calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.worldview-page__tabs {
  flex: 0 0 auto;
  height: 72rpx;
  margin-top: 4rpx;
  margin-bottom: 30rpx;
}

.worldview-page__draft-head {
  flex: 0 0 auto;
  height: 72rpx;
  margin-top: 4rpx;
  margin-bottom: 30rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.worldview-page__draft-title {
  position: relative;
  color: #333333;
  font-size: 34rpx;
  line-height: 72rpx;
  font-weight: 500;
}

.worldview-page__draft-title::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 8rpx;
  width: 30rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background-color: #333333;
  transform: translateX(-50%);
}

.worldview-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.worldview-page__grid-wrap {
  padding: 0 22rpx;
  box-sizing: border-box;
}

.worldview-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

</style>
