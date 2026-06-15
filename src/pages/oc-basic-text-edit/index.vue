<template>
  <view class="oc-basic-text-edit">
    <AppTopBar
      variant="editor"
      :title="title"
      action-text="保存"
      :action-tone="actionTone"
      @action="handleSave"
    />

    <scroll-view
      class="oc-basic-text-edit__body"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="isScrollAnimating"
      :show-scrollbar="false"
      :style="bodyStyle"
      @scroll="handleScroll"
    >
      <textarea
        class="oc-basic-text-edit__textarea"
        :value="content"
        :placeholder="placeholder"
        placeholder-class="oc-basic-text-edit__placeholder"
        maxlength="-1"
        auto-height
        :adjust-position="false"
        :cursor-spacing="24"
        @tap="handleTextareaTap"
        @focus="handleTextareaFocus"
        @input="handleInput"
        @keyboardheightchange="handleKeyboardHeightChange"
        @blur="handleTextareaBlur"
      />
    </scroll-view>

    <view class="oc-basic-text-edit__bottom">
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
import { useKeyboardAwareScroll } from '@/composables/useKeyboardAwareScroll'

interface BasicTextEditInitPayload {
  title?: string
  content?: string
  placeholder?: string
}

interface BasicTextEditSubmitPayload {
  content: string
}

interface EventChannelLike {
  on(event: 'init', callback: (payload: BasicTextEditInitPayload) => void): void
  emit(event: 'submit', payload: BasicTextEditSubmitPayload): void
}

type PageQuery = Record<string, string | string[] | undefined>

const DEFAULT_TITLE = '编辑内容'

const title = ref(DEFAULT_TITLE)
const content = ref('')
const placeholder = ref('开始写...')
const showLeaveConfirm = ref(false)
const isLeavingConfirmed = ref(false)
let eventChannel: EventChannelLike | null = null

const { isDirty, canSubmit, actionTone, markClean } = useDirtyState(() => content.value)

// 键盘感知滚动逻辑统一抽到 composable
const {
  keyboardHeight,
  scrollTop,
  bodyStyle,
  isScrollAnimating,
  handleScroll,
  handleTap: handleTextareaTap,
  handleFocus: handleTextareaFocus,
  handleBlur: handleTextareaBlur,
  handleKeyboardHeightChange
} = useKeyboardAwareScroll()

function getEventChannel() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as unknown as {
    getOpenerEventChannel?: () => EventChannelLike
  }

  return currentPage.getOpenerEventChannel?.() ?? null
}

function getQueryValue(query: PageQuery | undefined, key: string) {
  const value = query?.[key]
  const rawValue = Array.isArray(value) ? value[0] : value
  if (!rawValue) return ''

  try {
    return decodeURIComponent(rawValue)
  } catch {
    return rawValue
  }
}

function applyInitPayload(payload: BasicTextEditInitPayload) {
  title.value = payload.title || DEFAULT_TITLE
  content.value = payload.content || ''
  placeholder.value = payload.placeholder || '开始写...'
  markClean()
}

onLoad((query) => {
  applyInitPayload({
    title: getQueryValue(query as PageQuery, 'title'),
    content: getQueryValue(query as PageQuery, 'content'),
    placeholder: getQueryValue(query as PageQuery, 'placeholder')
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

function handleInput(event: Event) {
  content.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handleSave() {
  if (!canSubmit.value) return

  eventChannel?.emit('submit', {
    content: content.value
  })
  markClean()

  uni.navigateBack()
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
.oc-basic-text-edit {
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

.oc-basic-text-edit__body {
  flex: 1;
  min-height: 0;
  padding: 42rpx 30rpx calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  /* 不要 transition: padding-bottom —— 空间渐变跟不上滚动，长文本滚到底点击会被截断 */
}

.oc-basic-text-edit__textarea {
  min-height: calc(100vh - var(--status-bar-height) - 20rpx - 88rpx - 42rpx - 100rpx - env(safe-area-inset-bottom));
  width: 100%;
  padding: 0;
  box-sizing: border-box;
  color: #333;
  font-size: 30rpx;
  line-height: 44rpx;
  background: transparent;
}

.oc-basic-text-edit__placeholder {
  color: #8d969d;
  font-size: 30rpx;
}

.oc-basic-text-edit__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}
</style>
