<template>
  <view class="manuscript-detail">
    <view class="manuscript-detail__body">
      <view class="manuscript-detail__top">
        <ManuscriptTitle title="文稿名称名称" editable />
        <wd-button
          custom-class="manuscript-detail__create"
          custom-style="background:#ff6680;border-color:#ff6680;color:#ffffff;"
          round
          size="small"
          @click="handleCreateChapter"
        >
          创建
        </wd-button>
      </view>

      <view class="manuscript-detail__controls">
        <ManuscriptTabs v-model="activeTab" class="manuscript-detail__tabs" />
        <view class="manuscript-detail__public">
          <text>公开</text>
          <wd-switch v-model="isPublic" size="20px" active-color="#ff6680" inactive-color="#d8d8d8" />
        </view>
      </view>

      <scroll-view class="manuscript-detail__scroll" scroll-y>
        <view class="manuscript-detail__list">
          <ManuscriptCard
            v-for="item in filteredChapters"
            :key="item.id"
            variant="chapter"
            :order="item.order"
            :title="item.title"
            :words="item.words"
            :edited-at="item.editedAt"
            @click="handleEditChapter(item.id)"
          />
        </view>
      </scroll-view>
    </view>

    <view class="manuscript-detail__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import ManuscriptCard from '@/components/manuscript/ManuscriptCard.vue'
import ManuscriptTabs from '@/components/manuscript/ManuscriptTabs.vue'
import ManuscriptTitle from '@/components/manuscript/ManuscriptTitle.vue'
import type { ManuscriptChapter } from '@/types/manuscript'

type ManuscriptTabKey = 'all' | 'recent'

const activeTab = ref<ManuscriptTabKey>('all')
const isPublic = ref(true)

const chapters = ref<ManuscriptChapter[]>([
  { id: 1, title: '章节名称名称', order: 1, words: '1.2k字', editedAt: '2026年01月01日' },
  { id: 2, title: '章节名称名称', order: 2, words: '1.2k字', editedAt: '2026年01月01日' }
])

const filteredChapters = computed(() => (activeTab.value === 'recent' ? chapters.value.slice(0, 1) : chapters.value))

function handleCreateChapter() {
  uni.navigateTo({ url: '/pages/manuscript-chapter-create/index' })
}

function handleEditChapter(id: number) {
  uni.navigateTo({ url: `/pages/manuscript-chapter-edit/index?id=${id}` })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.manuscript-detail {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.manuscript-detail__body {
  height: 100%;
  padding: calc(var(--status-bar-height) + 56rpx) 16rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.manuscript-detail__top,
.manuscript-detail__controls,
.manuscript-detail__public {
  display: flex;
  align-items: center;
}

.manuscript-detail__top {
  justify-content: space-between;
  padding-right: 12rpx;
}

:deep(.manuscript-detail__create) {
  width: 119rpx !important;
  height: 67rpx !important;
  padding: 0;
  font-size: 27rpx;
  font-weight: 700;
}

.manuscript-detail__controls {
  justify-content: space-between;
  margin-top: 8rpx;
  margin-bottom: 20rpx;
}

.manuscript-detail__tabs {
  flex: 1;
  min-width: 0;
}

.manuscript-detail__public {
  gap: 16rpx;
  color: #a7a7a7;
  font-size: 30rpx;
  line-height: 42rpx;
  padding-right: 16rpx;
}

.manuscript-detail__scroll {
  flex: 1;
  min-height: 0;
}

.manuscript-detail__list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-bottom: 24rpx;
}

.manuscript-detail__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 112rpx;
}

@media screen and (min-width: 1200rpx) {
  .manuscript-detail {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>

