<template>
  <view class="check-phone-page">
    <PhoneSearchHeader v-model="keyword" title="查手机" />

    <OcTabs v-model="activeTab" :tabs="tabs" class="check-phone-page__tabs" />

    <scroll-view class="check-phone-page__scroll" scroll-y>
      <view class="check-phone-page__list">
        <OcGridList :items="filteredRoles" empty-tip="暂无角色" @item-click="handleOpen" />
      </view>
    </scroll-view>

    <view class="check-phone-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcGridList from '@/components/oc/OcGridList.vue'
import OcTabs from '@/components/oc/OcTabs.vue'
import PhoneSearchHeader from '@/components/phone/PhoneSearchHeader.vue'
import type { OcItem } from '@/types/oc'

type CheckPhoneTab = 'all' | 'recent'

interface PhoneRole extends OcItem {
  recent?: boolean
}

const keyword = ref('')
const activeTab = ref<CheckPhoneTab>('all')

const tabs: Array<{ label: string; value: CheckPhoneTab }> = [
  { label: '全部', value: 'all' },
  { label: '最近', value: 'recent' }
]

const roles: PhoneRole[] = [
  { id: 1, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 2, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 3, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 4, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 5, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 6, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 7, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 8, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 9, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 10, title: '角色名称名称名称', description: '角色简介内容...', locked: true, recent: true },
  { id: 11, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 12, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 13, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 14, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 15, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 16, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 17, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 18, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 19, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 20, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 21, title: '派大星', description: '角色简介内容...', locked: true, recent: true },
  { id: 22, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 23, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 24, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 25, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 26, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 27, title: '派大星', description: '角色简介内容...', recent: true },
  { id: 28, title: '角色名称名称名称', description: '角色简介内容...', recent: true },
  { id: 29, title: '海绵宝宝', description: '角色简介内容...', recent: true },
  { id: 30, title: '派大星', description: '角色简介内容...', recent: true }
]

const filteredRoles = computed(() => {
  return roles.filter((item) => {
    if (activeTab.value === 'recent' && !item.recent) return false
    return true
  })
})

function handleOpen(item: OcItem) {
  uni.navigateTo({
    url: `/pages/phone/index?id=${item.id}`
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.check-phone-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.check-phone-page__tabs {
  flex: 0 0 auto;
  height: 72rpx;
  margin-top: 12rpx;
  margin-bottom: 20rpx;
}

.check-phone-page__scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.check-phone-page__list {
  padding: 0 23rpx 34rpx;
  box-sizing: border-box;
}

.check-phone-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
}
</style>
