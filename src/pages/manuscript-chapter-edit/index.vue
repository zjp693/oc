<template>
  <view class="chapter-editor">
    <view class="chapter-editor__top">
      <ManuscriptTopFade />
      <AppTopBar
        class="chapter-editor__top-bar"
        variant="editor"
        action-text="保存"
        :action-tone="actionTone"
        @action="handleSave"
      >
        <template #leading>
          <view class="chapter-editor__title">
            <image class="chapter-editor__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
            <text class="chapter-editor__prefix" data-title="第N章">第N章</text>
            <text class="chapter-editor__separator">·</text>
            <view class="chapter-editor__name-wrap" @tap.stop="focusTitleInput" @click.stop="focusTitleInput">
              <text class="chapter-editor__title-measure">{{ chapterTitle || '章节名称' }}</text>
              <input
                class="chapter-editor__title-input"
                :value="chapterTitle"
                maxlength="15"
                :focus="titleInputFocused"
                :adjust-position="true"
                :cursor-spacing="24"
                @input="handleTitleInput"
                @blur="titleInputFocused = false"
              />
              <image
                class="chapter-editor__edit-icon"
                src="/static/manuscript/icon-writing-fluently.png"
                mode="aspectFit"
                @tap.stop="focusTitleInput"
                @click.stop="focusTitleInput"
              />
            </view>
          </view>
        </template>
      </AppTopBar>
    </view>

    <view class="chapter-editor__body">
      <textarea
        class="chapter-editor__textarea"
        :value="content"
        placeholder="开始写..."
        placeholder-class="chapter-editor__placeholder"
        maxlength="-1"
        :adjust-position="true"
        :cursor-spacing="24"
        @input="handleInput"
      />
    </view>

    <view class="chapter-editor__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import ManuscriptTopFade from '@/components/manuscript/ManuscriptTopFade.vue'
import { useDirtyState } from '@/composables/useDirtyState'

const content = ref('')
const chapterTitle = ref('章节名称')
const titleInputFocused = ref(false)
const { canSubmit, actionTone, markClean } = useDirtyState(() => ({
  title: chapterTitle.value,
  content: content.value
}))

function handleInput(event: Event) {
  content.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handleTitleInput(event: Event) {
  chapterTitle.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function focusTitleInput() {
  titleInputFocused.value = false

  nextTick(() => {
    titleInputFocused.value = true
  })
}

function handleSave() {
  if (!canSubmit.value) return

  markClean()

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
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.chapter-editor__body {
  flex: 1;
  min-height: 0;
  padding: 0 26rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.chapter-editor__top {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  height: calc(var(--status-bar-height) + 102rpx);
  overflow: visible;
}

.chapter-editor__top-bar {
  position: relative;
  z-index: 1;
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
  left: -26rpx;
  top: -14rpx;
  width: 74rpx;
  height: 104rpx;
  opacity: 0.9;
  pointer-events: none;
}

.chapter-editor__prefix,
.chapter-editor__separator,
.chapter-editor__title-measure,
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

.chapter-editor__name-wrap {
  position: relative;
  z-index: 1;
  flex: 0 1 auto;
  min-width: 54rpx;
  max-width: 100%;
  height: 60rpx;
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
}

.chapter-editor__title-measure {
  min-width: 1em;
  max-width: 100%;
  color: transparent;
  overflow: hidden;
}

.chapter-editor__title-input {
  position: absolute;
  left: 0;
  top: 0;
  width: calc(100% - 40rpx);
  max-width: calc(100% - 40rpx);
  min-width: 0;
  height: 60rpx;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  background: transparent;
}

.chapter-editor__edit-icon {
  position: relative;
  z-index: 1;
  flex: 0 0 32rpx;
  width: 32rpx;
  height: 32rpx;
  margin-left: 8rpx;
}

.chapter-editor__textarea {
  flex: 1;
  width: 100%;
  margin-top: 26rpx;
  padding: 23rpx 12rpx 0;
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
