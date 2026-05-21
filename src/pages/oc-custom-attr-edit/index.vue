<template>
  <view class="attr-edit-page">
    <view class="attr-edit-page__body">
      <text class="attr-edit-page__group-title">{{ groupTitle }}</text>

      <view class="attr-edit-page__title-row">
        <input
          v-model="titleValue"
          class="attr-edit-page__title-input"
          maxlength="15"
          placeholder="请输入名称"
          placeholder-class="attr-edit-page__placeholder"
          :adjust-position="true"
          :cursor-spacing="24"
          @input="handleTitleInput"
        />
        <text class="attr-edit-page__count">{{ titleValue.length }}/15</text>
      </view>

      <textarea
        v-model="contentValue"
        class="attr-edit-page__content-input"
        maxlength="-1"
        placeholder="请输入内容"
        placeholder-class="attr-edit-page__placeholder"
        :adjust-position="true"
        :cursor-spacing="24"
        @input="handleContentInput"
      />
    </view>

    <view class="attr-edit-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'

interface AttrEditInitPayload {
  groupTitle?: string
  title?: string
  content?: string
}

interface AttrEditSubmitPayload {
  title: string
  content: string
}

interface EventChannelLike {
  on(event: 'init', callback: (payload: AttrEditInitPayload) => void): void
  emit(event: 'submit', payload: AttrEditSubmitPayload): void
}

type InputLikeEvent = Event & {
  detail?: {
    value?: string
  }
}

const DEFAULT_GROUP_TITLE = '自定义属性'

const groupTitle = ref(DEFAULT_GROUP_TITLE)
const titleValue = ref('')
const contentValue = ref('')
let eventChannel: EventChannelLike | null = null

function getEventChannel() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as unknown as {
    getOpenerEventChannel?: () => EventChannelLike
  }

  return currentPage.getOpenerEventChannel?.() ?? null
}

onLoad(() => {
  eventChannel = getEventChannel()
  eventChannel?.on('init', (payload) => {
    groupTitle.value = payload.groupTitle || DEFAULT_GROUP_TITLE
    titleValue.value = payload.title || ''
    contentValue.value = payload.content || ''
  })
})

function getInputValue(event: InputLikeEvent) {
  return event.detail?.value ?? ''
}

function saveDraft() {
  eventChannel?.emit('submit', {
    title: titleValue.value,
    content: contentValue.value
  })
}

function handleTitleInput(event: InputLikeEvent) {
  titleValue.value = getInputValue(event)
  saveDraft()
}

function handleContentInput(event: InputLikeEvent) {
  contentValue.value = getInputValue(event)
  saveDraft()
}

function handleBack() {
  saveDraft()
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.attr-edit-page {
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

.attr-edit-page__body {
  flex: 1;
  min-height: 0;
  padding: calc(var(--status-bar-height) + 72rpx) 30rpx calc(138rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.attr-edit-page__group-title {
  display: block;
  margin-bottom: 62rpx;
  color: #ff667a;
  font-size: 34rpx;
  line-height: 48rpx;
  font-weight: 700;
}

.attr-edit-page__title-row {
  height: 82rpx;
  border-bottom: 1rpx solid rgba(51, 51, 51, 0.24);
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.attr-edit-page__title-input {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  padding: 0;
  color: #333;
  font-size: 30rpx;
  line-height: 72rpx;
}

.attr-edit-page__count {
  flex: 0 0 92rpx;
  color: #858585;
  font-size: 23rpx;
  line-height: 32rpx;
  text-align: right;
}

.attr-edit-page__content-input {
  width: 100%;
  flex: 1;
  min-height: 360rpx;
  margin-top: 16rpx;
  padding: 0;
  box-sizing: border-box;
  color: #333;
  font-size: 30rpx;
  line-height: 44rpx;
  background: transparent;
}

.attr-edit-page__placeholder {
  color: #8d969d;
  font-size: 30rpx;
}

.attr-edit-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 112rpx;
}

@media screen and (min-width: 1200rpx) {
  .attr-edit-page {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>
