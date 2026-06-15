<template>
  <view class="moments-publish-page">
    <AppTopBar
      title="发布朋友圈"
      action-text="发布"
      :action-disabled="!content.trim()"
      inline-padding="30rpx"
      @action="handlePublish"
    />

    <!-- scroll-view 当滚动体：键盘弹起时加大 padding-bottom 腾出键盘高度，
         再按「点击位置 + 键盘高度」精确把光标行滚到键盘正上方。 -->
    <scroll-view
      class="moments-publish-page__body"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="isScrollAnimating"
      :show-scrollbar="false"
      :style="bodyStyle"
      @scroll="handleScroll"
    >
      <textarea
        class="moments-publish-page__textarea"
        :value="content"
        placeholder="开始写..."
        placeholder-class="moments-publish-page__placeholder"
        maxlength="-1"
        auto-height
        :adjust-position="false"
        :cursor-spacing="24"
        :show-confirm-bar="false"
        @tap="handleTextareaTap"
        @input="handleInput"
        @focus="handleTextareaFocus"
        @blur="handleTextareaBlur"
        @keyboardheightchange="handleKeyboardHeightChange"
      />
    </scroll-view>

    <view class="moments-publish-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import { useKeyboardAwareScroll } from '@/composables/useKeyboardAwareScroll'

const content = ref('')

// 键盘感知滚动逻辑统一抽到 composable
const {
  scrollTop,
  bodyStyle,
  isScrollAnimating,
  handleScroll,
  handleTap: handleTextareaTap,
  handleFocus: handleTextareaFocus,
  handleBlur: handleTextareaBlur,
  handleKeyboardHeightChange
} = useKeyboardAwareScroll()

function handleInput(event: Event) {
  content.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handlePublish() {
  if (!content.value.trim()) return
  uni.showToast({
    title: '已发布',
    icon: 'none'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 450)
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.moments-publish-page {
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

.moments-publish-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 30rpx calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  /* 不要 transition: padding-bottom —— 空间渐变跟不上滚动，长文本滚到底点击会被截断 */
}

.moments-publish-page :deep(.app-top-bar__action--primary) {
  color: #ffffff;
  background: #ff6c7b;
}

.moments-publish-page :deep(.app-top-bar__action[disabled]) {
  opacity: 1;
  color: #ffffff;
  background: #f7adb5;
}

.moments-publish-page__textarea {
  display: block;
  /* 固定算式撑满可视区（不要 min-height:100%，否则短内容滚动会把文字甩出去）
     顶栏默认 variant = status-bar-height + 20rpx + 88rpx；底部栏 100rpx + 安全区 */
  min-height: calc(100vh - var(--status-bar-height) - 20rpx - 88rpx - 30rpx - 100rpx - env(safe-area-inset-bottom));
  width: 100%;
  padding: 30rpx 0 0;
  color: #333333;
  font-size: 30rpx;
  line-height: 44rpx;
  background: transparent;
  box-sizing: border-box;
}

.moments-publish-page__placeholder {
  color: #8d969d;
}

.moments-publish-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}
</style>
