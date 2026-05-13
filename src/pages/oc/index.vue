<template>
  <view class="oc-page">
    <view class="oc-page__body">
      <OcPageHeader
        v-model="keyword"
        @search="handleSearch"
        @create="handleCreate"
      />

      <OcTabs v-model="activeTab" class="oc-page__tabs" />

      <scroll-view class="oc-page__scroll" scroll-y>
        <OcGridList :items="filteredItems" @item-click="handleOpenDetail" />
      </scroll-view>
    </view>

    <view class="oc-page__bottom">
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
import OcGridList from '@/components/oc/OcGridList.vue'
import OcPageHeader from '@/components/oc/OcPageHeader.vue'
import OcTabs from '@/components/oc/OcTabs.vue'
import type { OcItem } from '@/types/oc'

type OcTabKey = 'all' | 'recent'

const keyword = ref('')
const activeTab = ref<OcTabKey>('all')
const bottomValue = ref('allOc')

const bottomOptions = [
  { label: '全部OC', value: 'allOc' },
  { label: '草稿箱', value: 'draft' }
]

const ocItems = ref<OcItem[]>([
  {
    id: 1,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容',
    status: 'reviewing'
  },
  {
    id: 2,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容',
    status: 'rejected'
  },
  {
    id: 3,
    title: '派大星',
    description: '角色简介简介内容简介内容',
    locked: true
  },
  {
    id: 4,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 5,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 6,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 7,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 8,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 9,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 10,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 11,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 12,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  }
])

const recentIds = [1, 2, 3, 5, 8, 11]

const filteredItems = computed(() => {
  const text = keyword.value.trim()
  const source = activeTab.value === 'recent'
    ? ocItems.value.filter((item) => recentIds.includes(item.id))
    : ocItems.value

  if (!text) return source

  return source.filter((item) => {
    return item.title.includes(text) || item.description.includes(text)
  })
})

function handleSearch() {
  // 搜索内容由 filteredItems 响应式处理，后续接接口时在这里发请求。
}

function handleCreate() {
  uni.showToast({
    title: '创建功能待接入',
    icon: 'none'
  })
}

function handleOpenDetail(item: OcItem) {
  uni.showToast({
    title: item.title,
    icon: 'none'
  })
}

function handleBottomChange(value: string) {
  bottomValue.value = value

  if (value === 'draft') {
    uni.showToast({
      title: '草稿箱待接入',
      icon: 'none'
    })
  }
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.oc-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f6fbff;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.oc-page__body {
  height: 100%;
  padding: calc(var(--status-bar-height) + 40rpx) 16rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.oc-page__tabs {
  flex: 0 0 auto;
  margin-top: 8rpx;
}

.oc-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.oc-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(12rpx + env(safe-area-inset-bottom));
  z-index: 5;
  height: 112rpx;
}

@media screen and (min-width: 600px) {
  .oc-page {
    max-width: 402px;
    margin: 0 auto;
  }
}
</style>
