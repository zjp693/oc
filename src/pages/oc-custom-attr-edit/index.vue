<template>
  <view class="attr-edit-page">
    <AppTopBar
      class="attr-edit-page__top-bar"
      variant="editor"
      action-text="保存"
      :action-tone="actionTone"
      @action="handleSave"
    >
      <template #leading>
        <text class="attr-edit-page__top-title">{{ groupTitle }}</text>
      </template>
    </AppTopBar>

    <view class="attr-edit-page__body">
      <view class="attr-edit-page__title-row">
        <input
          v-model="titleValue"
          class="attr-edit-page__title-input"
          maxlength="15"
          placeholder="请输入名称"
          placeholder-class="attr-edit-page__placeholder"
          :adjust-position="false"
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
        :adjust-position="false"
        :cursor-spacing="24"
        @input="handleContentInput"
      />
    </view>

    <view class="attr-edit-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>

    <OcConfirmDialog
      v-model="showLeaveConfirm"
      content="当前内容未保存，确认退出吗？"
      @confirm="handleConfirmLeave"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onBackPress, onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import { useDirtyState } from '@/composables/useDirtyState'

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

type AttrEditQuery = Record<string, string | string[] | undefined>

const DEFAULT_GROUP_TITLE = '自定义属性'

const groupTitle = ref(DEFAULT_GROUP_TITLE)
const titleValue = ref('')
const contentValue = ref('')
const showLeaveConfirm = ref(false)
const isLeavingConfirmed = ref(false)
let eventChannel: EventChannelLike | null = null

const { isDirty, canSubmit, actionTone, markClean } = useDirtyState(() => ({
  title: titleValue.value,
  content: contentValue.value
}))

function getEventChannel() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as unknown as {
    getOpenerEventChannel?: () => EventChannelLike
  }

  return currentPage.getOpenerEventChannel?.() ?? null
}

function getQueryValue(query: AttrEditQuery | undefined, key: string) {
  const value = query?.[key]
  const rawValue = Array.isArray(value) ? value[0] : value
  if (!rawValue) return ''

  try {
    return decodeURIComponent(rawValue)
  } catch {
    return rawValue
  }
}

function applyInitPayload(payload: AttrEditInitPayload) {
  groupTitle.value = payload.groupTitle || DEFAULT_GROUP_TITLE
  titleValue.value = payload.title || ''
  contentValue.value = payload.content || ''
  markClean()
}

onLoad((query) => {
  applyInitPayload({
    groupTitle: getQueryValue(query as AttrEditQuery, 'groupTitle'),
    title: getQueryValue(query as AttrEditQuery, 'title'),
    content: getQueryValue(query as AttrEditQuery, 'content')
  })

  eventChannel = getEventChannel()
  eventChannel?.on('init', applyInitPayload)
})

onBackPress(() => {
  if (isLeavingConfirmed.value) return false
  if (!isDirty.value) return false

  showLeaveConfirm.value = true
  return true
})

function getInputValue(event: InputLikeEvent) {
  return event.detail?.value ?? ''
}

function saveData() {
  eventChannel?.emit('submit', {
    title: titleValue.value,
    content: contentValue.value
  })
}

function handleTitleInput(event: InputLikeEvent) {
  titleValue.value = getInputValue(event)
}

function handleContentInput(event: InputLikeEvent) {
  contentValue.value = getInputValue(event)
}

function handleSave() {
  if (!canSubmit.value) return

  saveData()
  markClean()

  uni.showToast({
    title: '已保存',
    icon: 'none'
  })
}

function handleBack() {
  if (isLeavingConfirmed.value) {
    uni.navigateBack()
    return
  }

  if (isDirty.value) {
    showLeaveConfirm.value = true
    return
  }

  uni.navigateBack()
}

function handleConfirmLeave() {
  isLeavingConfirmed.value = true
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
  padding: 42rpx 30rpx calc(138rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.attr-edit-page__top-title {
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
  min-height: 0;
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
  height: 100rpx;
}

</style>
