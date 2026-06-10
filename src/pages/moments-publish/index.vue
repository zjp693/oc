<template>
  <view class="moments-publish-page">
    <AppTopBar
      title="发布朋友圈"
      action-text="发布"
      :action-disabled="!content.trim()"
      inline-padding="30rpx"
      @action="handlePublish"
    />

    <view class="moments-publish-page__body">
      <textarea
        class="moments-publish-page__textarea"
        :value="content"
        placeholder="开始写..."
        placeholder-class="moments-publish-page__placeholder"
        maxlength="-1"
        :adjust-position="true"
        :cursor-spacing="24"
        @input="handleInput"
      />
    </view>

    <view class="moments-publish-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'

const content = ref('')

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
  display: flex;
  flex-direction: column;
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
  flex: 1;
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
