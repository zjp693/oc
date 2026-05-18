<template>
  <view class="chapter-editor">
    <view class="chapter-editor__body">
      <view class="chapter-editor__status">
        <text>12:00</text>
        <view class="chapter-editor__icons">
          <text>▮▮▮</text>
          <text>⌁</text>
          <text>▰</text>
        </view>
      </view>

      <view class="chapter-editor__top">
        <view class="chapter-editor__title">
          <image class="chapter-editor__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
          <text class="chapter-editor__prefix" data-title="第N章">第N章</text>
          <text class="chapter-editor__separator">·</text>
          <input
            class="chapter-editor__title-input"
            :value="chapterTitle"
            maxlength="15"
            @input="handleTitleInput"
          />
          <image
            class="chapter-editor__edit-icon"
            src="/static/manuscript/icon-writing-fluently.png"
            mode="aspectFit"
          />
        </view>
        <wd-button
          custom-class="chapter-editor__save"
          custom-style="background:#ffaec0;border-color:#ffaec0;color:#ffffff;"
          round
          size="small"
          @click="handleSave"
        >
          保存
        </wd-button>
      </view>

      <textarea
        class="chapter-editor__textarea"
        :value="content"
        placeholder="开始写..."
        placeholder-class="chapter-editor__placeholder"
        maxlength="-1"
        @input="handleInput"
      />
    </view>

    <view class="chapter-editor__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'

const content = ref('')
const chapterTitle = ref('章节名称名称名称名称')

function handleInput(event: Event) {
  content.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handleTitleInput(event: Event) {
  chapterTitle.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handleSave() {
  uni.showToast({
    title: '已保存',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.chapter-editor {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.chapter-editor__body {
  height: 100%;
  padding: calc(var(--status-bar-height) + 22rpx) 28rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.chapter-editor__status,
.chapter-editor__top {
  display: flex;
  align-items: center;
}

.chapter-editor__status {
  height: 44rpx;
  justify-content: space-between;
  padding: 0 8rpx;
  color: #222222;
  font-size: 28rpx;
  font-weight: 600;
}

.chapter-editor__icons {
  display: flex;
  gap: 12rpx;
  color: #333333;
  font-size: 20rpx;
}

.chapter-editor__top {
  justify-content: space-between;
  margin-top: 34rpx;
  gap: 18rpx;
}

.chapter-editor__title {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 72rpx;
  display: flex;
  align-items: center;
}

.chapter-editor__lingbao {
  position: absolute;
  z-index: 0;
  left: -38rpx;
  top: -55rpx;
  width: 98rpx;
  height: 140rpx;
  opacity: 0.9;
  pointer-events: none;
}

.chapter-editor__prefix,
.chapter-editor__separator,
.chapter-editor__title-input {
  position: relative;
  z-index: 1;
  color: #ff5674;
  font-size: 38rpx;
  line-height: 48rpx;
  font-weight: 700;
  white-space: nowrap;
}

.chapter-editor__prefix::before {
  content: attr(data-title);
  position: absolute;
  z-index: -1;
  left: 5rpx;
  top: 5rpx;
  width: 160rpx;
  color: rgba(255, 86, 116, 0.12);
  font: inherit;
  line-height: inherit;
  white-space: nowrap;
  pointer-events: none;
}

.chapter-editor__title-input {
  flex: 1;
  min-width: 0;
  height: 60rpx;
}

.chapter-editor__edit-icon {
  position: relative;
  z-index: 1;
  flex: 0 0 32rpx;
  width: 32rpx;
  height: 32rpx;
  margin-left: 8rpx;
}

:deep(.chapter-editor__save) {
  width: 119rpx !important;
  height: 67rpx !important;
  padding: 0;
  font-size: 27rpx;
  font-weight: 700;
}

.chapter-editor__textarea {
  flex: 1;
  width: 100%;
  margin-top: 38rpx;
  padding: 14rpx 0;
  color: #333333;
  font-size: 30rpx;
  line-height: 44rpx;
  background: transparent;
  box-sizing: border-box;
}

.chapter-editor__placeholder {
  color: #8d969d;
}

.chapter-editor__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 112rpx;
}

@media screen and (min-width: 1200rpx) {
  .chapter-editor {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>
