<template>
  <view class="oc-page">
    <OcPageHeader
      v-model="keyword"
      @search="handleSearch"
      @create="handleCreate"
    />

    <view class="oc-page__body">
      <OcTabs v-if="!isDraftMode" v-model="activeTab" class="oc-page__tabs" />
      <view v-else class="oc-page__draft-head">
        <text class="oc-page__draft-title">草稿箱</text>
      </view>

      <scroll-view class="oc-page__scroll" scroll-y>
        <OcGridList :items="displayItems" :empty-tip="emptyTip" @item-click="handleOpenItem" />
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
  },
  {
    id: 13,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 14,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 15,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  ...Array.from({ length: 21 }, (_, index) => {
    const id = index + 16
    const names = ['角色名称名称名称名称', '海绵宝宝', '派大星']
    const item: OcItem = {
      id,
      title: names[index % names.length],
      description: '角色简介简介内容简介内容',
      locked: index === 8
    }
    if (index === 2) item.status = 'reviewing'
    if (index === 5) item.status = 'rejected'
    return item
  })
])

const draftItems = ref<OcItem[]>([
  {
    id: 101,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 102,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 103,
    title: '派大星',
    description: '角色简介简介内容简介内容',
    locked: true
  },
  {
    id: 104,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 105,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 106,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 107,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 108,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 109,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 110,
    title: '角色名称名称名称名称',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 111,
    title: '海绵宝宝',
    description: '角色简介简介内容简介内容'
  },
  {
    id: 112,
    title: '派大星',
    description: '角色简介简介内容简介内容'
  },
  ...Array.from({ length: 24 }, (_, index) => {
    const id = index + 113
    const names = ['角色名称名称名称名称', '海绵宝宝', '派大星']
    return {
      id,
      title: names[index % names.length],
      description: '角色简介简介内容简介内容',
      locked: index === 4 || index === 17
    }
  })
])

const recentIds = [1, 2, 3, 5, 8, 11, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

const isDraftMode = computed(() => bottomValue.value === 'draft')

const ocDisplayItems = computed(() => {
  const source = activeTab.value === 'recent'
    ? ocItems.value.filter((item) => recentIds.includes(item.id))
    : ocItems.value

  return source
})

const displayItems = computed(() => {
  return isDraftMode.value ? draftItems.value : ocDisplayItems.value
})

const emptyTip = computed(() => {
  return isDraftMode.value ? '暂无草稿' : '暂无OC'
})

function handleSearch() {
  // 搜索功能暂时关闭，后续接接口时再启用。
}

function handleCreate() {
  uni.navigateTo({
    url: '/pages/oc-create/index'
  })
}

function handleOpenItem(item: OcItem) {
  if (isDraftMode.value) {
    uni.navigateTo({
      url: `/pages/oc-create/index?draftId=${item.id}`
    })
    return
  }

  uni.navigateTo({
    url: `/pages/oc-detail/index?id=${item.id}`
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
.oc-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.oc-page__body {
  flex: 1;
  min-height: 0;
  padding-top: 0;
  padding-right: 16rpx;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  padding-left: 16rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.oc-page__tabs {
  flex: 0 0 auto;
  height: 72rpx;
  margin-top: 12rpx;
  margin-bottom: 20rpx;
}

.oc-page__draft-head {
  flex: 0 0 auto;
  height: 72rpx;
  margin-top: 12rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.oc-page__draft-title {
  position: relative;
  color: #333333; 
  font-size: 34rpx;
  line-height: 72rpx;
  font-weight: 500;
}

.oc-page__draft-title::after {
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

.oc-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.oc-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

</style>
