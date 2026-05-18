<template>
  <view class="manuscript-page">
    <AppPageHeader
      v-model="keyword"
      title="文稿"
      inline-padding="19rpx"
      @search="handleSearch"
      @create="handleCreate"
    />

    <view class="manuscript-page__body">
      <ManuscriptTabs v-model="activeTab" class="manuscript-page__tabs" />

      <scroll-view class="manuscript-page__scroll" scroll-y>
        <view class="manuscript-page__list">
          <ManuscriptCard
            v-for="item in filteredItems"
            :key="item.id"
            :title="item.title"
            :chapters="item.chapters"
            :words="item.words"
            :edited-at="item.editedAt"
            @click="handleOpenDetail(item.id)"
          />
        </view>
      </scroll-view>
    </view>

    <view class="manuscript-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import ManuscriptCard from '@/components/manuscript/ManuscriptCard.vue'
import ManuscriptTabs from '@/components/manuscript/ManuscriptTabs.vue'
import type { ManuscriptItem } from '@/types/manuscript'

type ManuscriptTabKey = 'all' | 'recent'

const keyword = ref('')
const activeTab = ref<ManuscriptTabKey>('all')

const manuscripts = ref<ManuscriptItem[]>([
  { id: 1, title: '文稿名称名称', chapters: 0, words: '1.2k字', editedAt: '2026年01月01日' },
  { id: 2, title: '文稿名称名称', chapters: 0, words: '1.2k字', editedAt: '2026年01月01日' }
])

const filteredItems = computed(() => {
  const source = activeTab.value === 'recent' ? manuscripts.value.slice(0, 1) : manuscripts.value
  const text = keyword.value.trim()
  if (!text) return source
  return source.filter((item) => item.title.includes(text))
})

function handleSearch() {
  // 搜索功能暂时使用本地筛选，后续接接口时再启用服务端搜索。
}

function handleCreate() {
  uni.navigateTo({ url: '/pages/manuscript-create/index' })
}

function handleOpenDetail(id: number) {
  uni.navigateTo({ url: `/pages/manuscript-detail/index?id=${id}` })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.manuscript-page {
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

.manuscript-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 19rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.manuscript-page__tabs {
  margin-top: 12rpx;
  margin-bottom: 20rpx;
}

.manuscript-page__scroll {
  flex: 1;
  min-height: 0;
}

.manuscript-page__list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 24rpx;
}

.manuscript-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 112rpx;
}

@media screen and (min-width: 1200rpx) {
  .manuscript-page {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>
