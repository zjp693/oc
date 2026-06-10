<template>
  <view class="oc-basic-text-edit">
    <AppTopBar
      variant="editor"
      :title="title"
      action-text="保存"
      :action-tone="actionTone"
      @action="handleSave"
    />

    <view class="oc-basic-text-edit__body" :style="bodyStyle">
      <textarea
        class="oc-basic-text-edit__textarea"
        :value="content"
        :placeholder="placeholder"
        placeholder-class="oc-basic-text-edit__placeholder"
        maxlength="-1"
        :adjust-position="false"
        :cursor-spacing="24"
        @input="handleInput"
        @keyboardheightchange="handleKeyboardHeightChange"
        @blur="handleTextareaBlur"
      />
    </view>

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
import { computed, ref } from 'vue'
import { onBackPress, onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import { useDirtyState } from '@/composables/useDirtyState'

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
type KeyboardHeightEvent = Event & {
  detail?: {
    height?: number
  }
}

const DEFAULT_TITLE = '编辑内容'

const title = ref(DEFAULT_TITLE)
const content = ref('')
const placeholder = ref('开始写...')
const showLeaveConfirm = ref(false)
const isLeavingConfirmed = ref(false)
const keyboardHeight = ref(0)
let eventChannel: EventChannelLike | null = null

const { isDirty, canSubmit, actionTone, markClean } = useDirtyState(() => content.value)

const bodyStyle = computed(() => ({
  paddingBottom: `calc(100rpx + env(safe-area-inset-bottom) + ${keyboardHeight.value}px)`
}))

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

function handleKeyboardHeightChange(event: KeyboardHeightEvent) {
  keyboardHeight.value = Math.max(0, Math.round(event.detail?.height || 0))
}

function handleTextareaBlur() {
  keyboardHeight.value = 0
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
  display: flex;
  flex-direction: column;
}

.oc-basic-text-edit__textarea {
  flex: 1;
  min-height: 0;
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
