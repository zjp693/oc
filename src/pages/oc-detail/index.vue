<template>
  <view class="oc-detail-page">
    <scroll-view
      class="oc-detail-page__scroll"
      scroll-y
      :scroll-top="pageScrollTop"
      :scroll-with-animation="false"
      @scroll="handlePageScroll"
    >
      <view class="oc-detail-page__hero-wrap">
        <OcDetailHero :cover-url="detail.coverUrl" />
        <view class="oc-detail-page__hero-gradient" />
      </view>

      <view class="oc-detail-page__content">
        <view class="oc-detail-page__sticky">
          <view class="oc-detail-page__profile">
            <OcDetailProfile
              :title="detail.title"
              :followed="followed"
              @follow="handleFollow"
              @chat="handleChat"
            />
          </view>

          <view class="oc-detail-page__tabs">
            <OcDetailTabs v-model="activeTab" @change="handleTabChange" />
          </view>
        </view>

        <OcSettingPanel v-if="activeTab === 'setting'" />
        <OcWorldviewPanel v-else @setting="showWorldviewSheet = true" />
      </view>
    </scroll-view>

    <view class="oc-detail-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <view class="oc-detail-page__more" @click="showMoreSheet = true">
        <image class="oc-detail-page__more-icon" src="/static/oc/icon-more-menu.png" mode="aspectFit" />
      </view>
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
import { nextTick, onMounted, ref } from 'vue'
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
const currentScrollTop = ref(0)
const stickyTop = ref(0)
const followed = ref(false)
const showMoreSheet = ref(false)
const showWorldviewSheet = ref(false)
const showConfirm = ref(false)

const detail = {
  id: 1,
  title: '角色名称名称名称',
  coverUrl: '/static/oc/detail-landscape.jpg'
}

const moreActions: OcSheetAction[] = [
  { key: 'edit', label: '编辑', icon: 'edit-1', iconUrl: '/static/oc/icon-edit.png' }
]

const worldviewActions: OcSheetAction[] = [
  { key: 'unlink', label: '解除与当前世界观的关联', icon: 'link' }
]

onMounted(() => {
  nextTick(() => {
    updateStickyTop()
  })
})

function handleTabChange(tab: OcDetailTab) {
  activeTab.value = tab

  nextTick(() => {
    const stickyTarget = Math.ceil(stickyTop.value)

    if (currentScrollTop.value >= stickyTarget) {
      pageScrollTop.value = stickyTarget
      currentScrollTop.value = stickyTarget
    }
  })
}

function handlePageScroll(event: { detail: { scrollTop: number } }) {
  currentScrollTop.value = event.detail.scrollTop
}

function updateStickyTop() {
  uni
    .createSelectorQuery()
    .select('.oc-detail-page__sticky')
    .boundingClientRect((rect) => {
      if (!rect || Array.isArray(rect)) return
      stickyTop.value = Math.max(0, rect.top || 0)
    })
    .exec()
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
}

.oc-detail-page__scroll {
  height: 100%;
}

.oc-detail-page__hero-wrap {
  position: relative;
  height: 822rpx;
  overflow: visible;
}

.oc-detail-page__hero-gradient {
  position: absolute;
  left: 0;
  top: 537rpx;
  z-index: 1;
  width: 100vw;
  height: 394rpx;
  line-height: 37rpx;
  background: linear-gradient(
    180deg,
    rgba(248, 248, 248, 0) 0%,
    rgba(248, 248, 248, 0.1) 15%,
    rgba(248, 248, 248, 0.2) 21%,
    rgba(248, 248, 248, 0.8) 40.7%,
    rgba(248, 248, 248, 1) 53%,
    rgba(248, 248, 248, 0) 100%
  );
  pointer-events: none;
}

.oc-detail-page__content {
  position: relative;
  z-index: 2;
  min-height: 720rpx;
  padding-top: 0;
  background: #f4f4f4;
  overflow: visible;
}

.oc-detail-page__content::before {
  content: '';
  position: absolute;
  left: 0;
  top: -210rpx;
  z-index: 0;
  width: 100vw;
  height: 394rpx;
  line-height: 37rpx;
  background: linear-gradient(
    180deg,
    rgba(248, 248, 248, 0) 0%,
    rgba(248, 248, 248, 0.1) 15%,
    rgba(248, 248, 248, 0.2) 21%,
    rgba(248, 248, 248, 0.8) 40.7%,
    rgba(248, 248, 248, 1) 53%,
    rgba(248, 248, 248, 0) 100%
  );
  color: rgba(255, 255, 255, 1);
  font-size: 26rpx;
  text-align: center;
  font-family: PingFang SC, PingFangSC-Regular, sans-serif;
  pointer-events: none;
}

.oc-detail-page__sticky {
  position: sticky;
  top: 0;
  z-index: 8;
  margin-top: -162rpx;
  padding-top: 0;
  background: #f4f4f4;
}

.oc-detail-page__profile {
  position: relative;
  width: 100%;
}

.oc-detail-page__tabs {
  position: relative;
  height: 76rpx;
  margin-top: 10rpx;
  display: flex;
  align-items: center;
  background: transparent;
}

.oc-detail-page__more {
  position: absolute;
  right: 32rpx;
  bottom: 19rpx;
  z-index: 2;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.oc-detail-page__more-icon {
  width: 41rpx;
  height: 41rpx;
}

.oc-detail-page__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 6;
  height: 112rpx;
  overflow: hidden;
  background: #fff;
}

@media screen and (min-width: 600px) {
  .oc-detail-page {
    max-width: 402px;
    margin: 0 auto;
  }
}
</style>
