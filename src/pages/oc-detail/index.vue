<template>
  <view class="oc-detail-page">
    <scroll-view
      class="oc-detail-page__scroll"
      scroll-y
      :scroll-top="pageScrollTop"
      :scroll-with-animation="false"
    >
      <OcDetailHero />

      <view class="oc-detail-page__content">
        <OcDetailProfile
          :title="detail.title"
          :followed="followed"
          @follow="handleFollow"
          @chat="handleChat"
        />

        <view class="oc-detail-page__tabs">
          <OcDetailTabs v-model="activeTab" @change="handleTabChange" />
        </view>

        <OcSettingPanel v-if="activeTab === 'setting'" />
        <OcWorldviewPanel v-else @setting="showWorldviewSheet = true" />
      </view>
    </scroll-view>

    <view class="oc-detail-page__more" @click="showMoreSheet = true">
      <wd-icon name="more" size="34rpx" color="#333333" />
    </view>

    <view class="oc-detail-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>

    <OcActionSheet
      v-model="showMoreSheet"
      title="更多"
      :actions="moreActions"
      @select="handleMoreAction"
    />
    <OcActionSheet
      v-model="showWorldviewSheet"
      title="世界观设置"
      :actions="worldviewActions"
      @select="handleWorldviewAction"
    />
    <OcConfirmDialog
      v-model="showConfirm"
      content="确定要与当前世界观解除关联吗?"
      @confirm="handleConfirmUnlink"
    />
  </view>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcActionSheet, { type OcSheetAction } from '@/components/oc-detail/OcActionSheet.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import OcDetailHero from '@/components/oc-detail/OcDetailHero.vue'
import OcDetailProfile from '@/components/oc-detail/OcDetailProfile.vue'
import OcDetailTabs, { type OcDetailTab } from '@/components/oc-detail/OcDetailTabs.vue'
import OcSettingPanel from '@/components/oc-detail/OcSettingPanel.vue'
import OcWorldviewPanel from '@/components/oc-detail/OcWorldviewPanel.vue'

const activeTab = ref<OcDetailTab>('setting')
const pageScrollTop = ref(0)
const followed = ref(false)
const showMoreSheet = ref(false)
const showWorldviewSheet = ref(false)
const showConfirm = ref(false)

const detail = {
  id: 1,
  title: '角色名称名称名称'
}

const moreActions: OcSheetAction[] = [
  { key: 'edit', label: '编辑', icon: 'edit-1' }
]

const worldviewActions: OcSheetAction[] = [
  { key: 'unlink', label: '解除与当前世界观的关联', icon: 'link' }
]

function handleTabChange(tab: OcDetailTab) {
  activeTab.value = tab
  pageScrollTop.value = 1
  nextTick(() => {
    pageScrollTop.value = 0
  })
}

function handleFollow() {
  followed.value = !followed.value
}

function handleChat() {
  uni.showToast({
    title: '对话功能待接入',
    icon: 'none'
  })
}

function handleMoreAction(key: string) {
  if (key === 'edit') {
    uni.showToast({
      title: '编辑功能待接入',
      icon: 'none'
    })
  }
}

function handleWorldviewAction(key: string) {
  if (key === 'unlink') {
    showConfirm.value = true
  }
}

function handleConfirmUnlink() {
  uni.showToast({
    title: '已解除关联',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.oc-detail-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
}

.oc-detail-page__scroll {
  height: 100%;
}

.oc-detail-page__content {
  position: relative;
  min-height: 720rpx;
  padding-top: 0;
  background: linear-gradient(180deg, rgba(245, 245, 245, 0.86) 0%, #f5f5f5 34%);
}

.oc-detail-page__tabs {
  position: sticky;
  top: 0;
  z-index: 4;
  margin-top: 18rpx;
  background: rgba(245, 245, 245, 0.96);
}

.oc-detail-page__more {
  position: fixed;
  right: 26rpx;
  bottom: calc(143rpx + env(safe-area-inset-bottom));
  z-index: 7;
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
}

.oc-detail-page__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 6;
  height: 112rpx;
}

@media screen and (min-width: 600px) {
  .oc-detail-page {
    max-width: 402px;
    margin: 0 auto;
  }
}
</style>
