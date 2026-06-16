<template>
  <view class="chat-page" :class="`chat-page--${conversationType}`">
    <view class="chat-header">
      <view class="chat-header__row">
        <image class="chat-header__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
        <view class="chat-header__avatar" :class="`chat-header__avatar--${conversationType}`">
          <text class="chat-header__avatar-mark">{{ chatProfile.avatarMark }}</text>
        </view>
        <view class="chat-header__info">
          <text class="chat-header__title">{{ chatTitle }}</text>
          <text v-if="isOcConversation" class="chat-header__meta">{{ ocHeaderMeta }}</text>
        </view>
        <button class="chat-header__more" hover-class="button-hover" @click="handleMore">
          <image class="chat-header__more-icon" src="/static/message/icon-more.png" mode="aspectFit" />
        </button>
      </view>
    </view>

    <view
      class="chat-page__body"
      :class="{ 'chat-page__body--actions-open': showInputActions }"
      :style="chatBodyStyle"
    >
      <scroll-view class="chat-page__scroll" scroll-y :scroll-top="scrollTop" :scroll-into-view="scrollTargetId"
        :upper-threshold="historyLoadingEnabled ? 80 : 0" @scroll="handleScroll" @scrolltoupper="handleScrollToUpper">
        <view class="chat-page__messages" :class="{ 'chat-page__messages--oc': isOcConversation }">
          <view v-if="historyLoadingEnabled && (loadingHistory || !hasMoreHistory)" class="chat-page__history-tip">
            {{ loadingHistory ? '加载中...' : '没有更早的消息了' }}
          </view>
          <view
            v-if="isOcConversation"
            class="chat-oc-intro"
            :class="{ 'chat-oc-intro--expanded': ocIntroExpanded }"
          >
            <text class="chat-oc-intro__label">简介：</text>
            <text class="chat-oc-intro__content">{{ ocIntroduction }}</text>
            <button
              class="chat-oc-intro__toggle"
              hover-class="button-hover"
              :aria-label="ocIntroExpanded ? '收起简介' : '展开简介'"
              @click.stop="toggleOcIntro"
            >
              <text class="chat-oc-intro__toggle-corner"></text>
            </button>
          </view>
          <block v-for="item in chatDisplayItems" :key="item.id">
            <view v-if="item.kind === 'time'" class="chat-time-divider">
              <text class="chat-time-divider__text">{{ item.label }}</text>
            </view>
            <view v-else :id="`message-${item.message.id}`" class="chat-message"
              :class="[`chat-message--${item.message.sender}`, `chat-message--${item.message.status}`]">
              <view class="chat-message__stack">
                <text class="chat-message__bubble">{{ item.message.content }}</text>
                <button v-if="item.message.sender === 'me' && item.message.status === 'failed'"
                  class="chat-message__retry" hover-class="button-hover" @click.stop="handleRetryMessage(item.message)">
                  <text class="chat-message__retry-icon">!</text>
                  <text>{{ getMessageStatusText(item.message) }}</text>
                </button>
              </view>
            </view>
          </block>
          <view id="chat-bottom-anchor" class="chat-page__bottom-anchor"></view>
        </view>
      </scroll-view>
      <button v-if="showNewMessageTip" class="chat-page__new-tip" :class="{ 'chat-page__new-tip--actions-open': showInputActions }" hover-class="button-hover"
        @click="handleJumpToNewMessage">
        {{ newMessageTipText }}
      </button>
    </view>

    <view
      class="chat-input-dock"
      :class="{ 'chat-input-dock--actions-open': showInputActions }"
      :style="chatDockStyle"
    >
      <view class="chat-input-bar">
        <button class="chat-input-bar__back" hover-class="button-hover" @click="handleBack">
          <image class="chat-input-bar__back-icon" src="/static/message/icon-chat-back.png" mode="aspectFit" />
        </button>
        <view class="chat-input-bar__field">
          <input
            v-model="draft"
            class="chat-input-bar__input"
            confirm-type="send"
            :confirm-hold="true"
            :adjust-position="false"
            :cursor-spacing="24"
            :focus="inputFocused"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            @confirm="handleInputConfirm"
          />
        </view>
        <button
          class="chat-input-bar__send"
          hover-class="button-hover"
          :class="{
            'chat-input-bar__send--active': canSend,
            'chat-input-bar__send--waiting': isAwaitingReply
          }"
          @touchstart.stop="handleSendButtonTouchStart"
          @touchend.stop.prevent="handleSendButtonTouchEnd()"
          @touchcancel="handleSendButtonTouchCancel()"
          @mousedown="handleSendButtonMouseDown"
          @click.stop="handleInputAction()"
        >
          <image class="chat-input-bar__send-icon" :src="inputActionIcon" mode="aspectFit" />
        </button>
      </view>

      <OcActionSheet
        v-model="showInputActions"
        presentation="inline"
        variant="grid"
        :actions="inputActions"
        @select="handleInputActionSelect"
      />
    </view>
    <OcConfirmDialog
      v-model="showResetConfirm"
      content="确定重置当前对话吗？"
      @confirm="handleResetConversation"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, reactive, ref, watch } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import OcActionSheet, { type OcSheetAction } from '@/components/oc-detail/OcActionSheet.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import type { ChatMessage, MessageConversationType } from '@/types/message'

type ChatDisplayItem =
  | { id: string; kind: 'time'; label: string }
  | { id: string; kind: 'message'; message: ChatMessage }

interface ChatProfile {
  title: string
  avatarMark: string
  autoReply: boolean
  creatorName?: string
  introduction?: string
}

interface KeyboardHeightChangeEvent {
  height?: number
}

interface KeyboardApi {
  onKeyboardHeightChange?: (callback: (event: KeyboardHeightChangeEvent) => void) => void
  offKeyboardHeightChange?: (callback: (event: KeyboardHeightChangeEvent) => void) => void
}

const instance = getCurrentInstance()
const conversationType = ref<MessageConversationType>('user')
const conversationId = ref('default')
const draft = ref('')
const scrollTop = ref(0)
const scrollTargetId = ref('')
const keyboardHeight = ref(0)
const inputFocused = ref(false)
const loadingHistory = ref(false)
const hasMoreHistory = ref(true)
const ocIntroExpanded = ref(false)
const showInputActions = ref(false)
const showResetConfirm = ref(false)
const showNewMessageTip = ref(false)
const isAwaitingReply = ref(false)
const pendingNewMessageCount = ref(0)
const historyBatch = ref(0)
const baseTime = new Date('2026-12-12T12:00:00').getTime()
const pendingSendTimers = new Map<string, ReturnType<typeof setTimeout>>()
const pendingIncomingTimers = new Map<string, ReturnType<typeof setTimeout>>()
const sendButtonKeepKeyboard = ref(false)
const sendButtonKeyboardStateCaptured = ref(false)
let lastSendButtonTouchAt = 0
let sendButtonStateResetTimer: ReturnType<typeof setTimeout> | undefined
let restoreInputFocusTimer: ReturnType<typeof setTimeout> | undefined
const historyLoadingEnabled = false
const timeDividerEnabled = false
const scrollMetrics = reactive({
  scrollTop: 0,
  scrollHeight: 0,
  viewportHeight: 0
})

const chatMessages = ref<ChatMessage[]>([])
const inputActions: OcSheetAction[] = [
  {
    key: 'reset',
    label: '重置对话',
    icon: 'reset',
    iconUrl: '/static/message/icon-reset-chat.png',
    iconSize: '45rpx'
  },
  {
    key: 'phone',
    label: '查手机',
    icon: 'phone',
    iconUrl: '/static/home/icon-iphone.png',
    iconSize: '45rpx'
  }
]

const chatProfile = computed<ChatProfile>(() => {
  if (conversationType.value === 'oc') {
    return {
      title: '角色名称名称名称',
      avatarMark: 'OC',
      autoReply: true,
      creatorName: '创建者名称名称名称',
      introduction:
        '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。'
    }
  }

  return {
    title: '用户昵称昵称',
    avatarMark: '▧',
    autoReply: false
  }
})
const isOcConversation = computed(() => conversationType.value === 'oc')
const chatTitle = computed(() => chatProfile.value.title)
const ocHeaderMeta = computed(() => {
  const creatorName = chatProfile.value.creatorName || '创建者'
  return `@${creatorName} · 内容由AI生成`
})
const ocIntroduction = computed(() => chatProfile.value.introduction || '')
const conversationKey = computed(() => `${conversationType.value}:${conversationId.value}`)
const draftStorageKey = computed(() => `chat-draft:${conversationKey.value}`)
const canSend = computed(() => draft.value.trim().length > 0 && !isAwaitingReply.value)
const shouldAwaitReply = computed(() => chatProfile.value.autoReply)
const inputActionIcon = computed(() =>
  isAwaitingReply.value
    ? '/static/message/icon-rotation.png'
    : canSend.value
      ? '/static/message/icon-send-plane.png'
      : '/static/message/icon-input-plus.png'
)
const isKeyboardVisible = computed(() => keyboardHeight.value > 0)
const chatBodyStyle = computed(() => {
  if (isKeyboardVisible.value) {
    return `padding-bottom: calc(124rpx + ${keyboardHeight.value}px);`
  }

  return ''
})
const chatDockStyle = computed(() => {
  if (isKeyboardVisible.value) {
    return `bottom: ${keyboardHeight.value}px; padding-bottom: 0;`
  }

  return ''
})
const newMessageTipText = computed(() => {
  const count = pendingNewMessageCount.value
  return count > 1 ? `${count}条新消息` : '有新消息'
})
const chatDisplayItems = computed<ChatDisplayItem[]>(() => {
  const items: ChatDisplayItem[] = []
  let previousTime = 0

  chatMessages.value.forEach((message) => {
    if (timeDividerEnabled && shouldShowTimeDivider(previousTime, message.createdAt)) {
      items.push({
        id: `time-${message.id}`,
        kind: 'time',
        label: formatChatTime(message.createdAt)
      })
    }

    items.push({
      id: `message-${message.id}`,
      kind: 'message',
      message
    })
    previousTime = message.createdAt
  })

  return items
})
const latestMessageDomId = computed(() => {
  const latest = chatMessages.value[chatMessages.value.length - 1]
  return latest ? `message-${latest.id}` : ''
})
const latestScrollTargetId = computed(() => (latestMessageDomId.value ? 'chat-bottom-anchor' : ''))

onLoad((query) => {
  registerKeyboardListener()
  initializeConversation(query)
})

onUnload(() => {
  unregisterKeyboardListener()
  pendingSendTimers.forEach((timer) => clearTimeout(timer))
  pendingSendTimers.clear()
  pendingIncomingTimers.forEach((timer) => clearTimeout(timer))
  pendingIncomingTimers.clear()
  clearSendButtonStateResetTimer()
  clearRestoreInputFocusTimer()
})

watch(draft, (value) => {
  if (value) {
    closeInputActions()
    uni.setStorageSync(draftStorageKey.value, value)
    return
  }

  uni.removeStorageSync(draftStorageKey.value)
})

interface SendOptions {
  keepKeyboard?: boolean
}

function handleInputConfirm() {
  handleSend({ keepKeyboard: true })
}

function handleSend(options: SendOptions = {}) {
  const content = draft.value.trim()
  if (!canSend.value) return
  const keepKeyboard = options.keepKeyboard === true
  const clientId = `local-${Date.now()}`
  const message: ChatMessage = {
    id: clientId,
    clientId,
    sender: 'me',
    content,
    createdAt: Date.now(),
    status: 'sending'
  }

  chatMessages.value.push(message)
  draft.value = ''
  isAwaitingReply.value = shouldAwaitReply.value
  closeInputActions()
  scrollToLatestMessage()
  sendMessage(message)
  keepInputKeyboardStateAfterSend(keepKeyboard)
}

function handleInputFocus() {
  inputFocused.value = true
  closeInputActions()
}

function handleInputBlur() {
  if (sendButtonKeepKeyboard.value) {
    restoreInputFocus()
    return
  }

  inputFocused.value = false
}

function handleSendButtonTouchStart(event: TouchEvent) {
  captureSendButtonKeyboardState()

  if (sendButtonKeepKeyboard.value) {
    event.preventDefault()
  }
}

function handleSendButtonTouchEnd() {
  lastSendButtonTouchAt = Date.now()
  handleInputAction('touch')
}

function handleSendButtonTouchCancel() {
  scheduleSendButtonKeyboardStateReset(0)
}

function handleSendButtonMouseDown(event: MouseEvent) {
  captureSendButtonKeyboardState()

  if (sendButtonKeepKeyboard.value) {
    event.preventDefault()
  }
}

function registerKeyboardListener() {
  const keyboardApi = uni as unknown as KeyboardApi
  keyboardApi.onKeyboardHeightChange?.(handleKeyboardHeightChange)
}

function unregisterKeyboardListener() {
  const keyboardApi = uni as unknown as KeyboardApi
  keyboardApi.offKeyboardHeightChange?.(handleKeyboardHeightChange)
}

function handleKeyboardHeightChange(event: KeyboardHeightChangeEvent) {
  const nextHeight = Math.max(0, Number(event.height || 0))
  keyboardHeight.value = nextHeight

  if (nextHeight > 0) {
    showInputActions.value = false
  }

  nextTick(() => {
    measureScrollArea()
    if (nextHeight > 0) {
      scrollToLatestMessage()
    }
  })
}

function handleInputAction(origin: 'click' | 'touch' = 'click') {
  if (origin === 'click' && Date.now() - lastSendButtonTouchAt < 350) {
    return
  }

  if (isAwaitingReply.value) {
    scheduleSendButtonKeyboardStateReset(0)
    return
  }

  if (canSend.value) {
    const keepKeyboard = sendButtonKeyboardStateCaptured.value
      ? sendButtonKeepKeyboard.value
      : isKeyboardVisible.value

    handleSend({ keepKeyboard })
    scheduleSendButtonKeyboardStateReset(keepKeyboard ? 180 : 0)
    return
  }

  scheduleSendButtonKeyboardStateReset(0)
  showInputActions.value = !showInputActions.value

  nextTick(() => {
    measureScrollArea()
    scrollToLatestMessage()
  })
}

function captureSendButtonKeyboardState() {
  clearSendButtonStateResetTimer()
  sendButtonKeepKeyboard.value = canSend.value && isKeyboardVisible.value
  sendButtonKeyboardStateCaptured.value = true
}

function scheduleSendButtonKeyboardStateReset(delay = 0) {
  clearSendButtonStateResetTimer()

  sendButtonStateResetTimer = setTimeout(() => {
    sendButtonKeepKeyboard.value = false
    sendButtonKeyboardStateCaptured.value = false
    sendButtonStateResetTimer = undefined
  }, delay)
}

function clearSendButtonStateResetTimer() {
  if (!sendButtonStateResetTimer) return

  clearTimeout(sendButtonStateResetTimer)
  sendButtonStateResetTimer = undefined
}

function keepInputKeyboardStateAfterSend(keepKeyboard: boolean) {
  if (!keepKeyboard) {
    clearRestoreInputFocusTimer()
    inputFocused.value = false
    uni.hideKeyboard()
    return
  }

  inputFocused.value = true
}

function restoreInputFocus() {
  clearRestoreInputFocusTimer()
  inputFocused.value = false

  restoreInputFocusTimer = setTimeout(() => {
    inputFocused.value = true
    restoreInputFocusTimer = undefined
  }, 20)
}

function clearRestoreInputFocusTimer() {
  if (!restoreInputFocusTimer) return

  clearTimeout(restoreInputFocusTimer)
  restoreInputFocusTimer = undefined
}

function closeInputActions() {
  if (!showInputActions.value) return

  showInputActions.value = false

  nextTick(() => {
    measureScrollArea()
  })
}

function handleInputActionSelect(key: string) {
  if (key === 'reset') {
    showResetConfirm.value = true
    return
  }

  if (key === 'phone') {
    uni.showToast({
      title: '查手机功能待接入',
      icon: 'none'
    })
  }
}

function handleResetConversation() {
  chatMessages.value = createMockConversationMessages(conversationKey.value)
  draft.value = ''
  isAwaitingReply.value = false
  scrollToLatestMessage()
  uni.showToast({
    title: '已重置对话',
    icon: 'none'
  })
}

function handleRetryMessage(message: ChatMessage) {
  if (!message.clientId) return
  isAwaitingReply.value = shouldAwaitReply.value
  updateMessageStatus(message.clientId, 'sending')
  scrollToLatestMessage()
  sendMessage(message)
}

function initializeConversation(query?: Record<string, unknown>) {
  const queryType = normalizeQueryValue(query?.type)
  const queryId = normalizeQueryValue(query?.id)

  conversationType.value = queryType === 'oc' || queryType === 'user' ? queryType : 'user'
  conversationId.value = queryId || `${conversationType.value}-default`
  chatMessages.value = createMockConversationMessages(conversationKey.value)
  historyBatch.value = 0
  hasMoreHistory.value = true
  ocIntroExpanded.value = false
  showNewMessageTip.value = false
  isAwaitingReply.value = false
  pendingNewMessageCount.value = 0
  draft.value = String(uni.getStorageSync(draftStorageKey.value) || '')
  nextTick(() => {
    measureScrollArea()
    scrollToLatestMessage()
  })
}

function toggleOcIntro() {
  ocIntroExpanded.value = !ocIntroExpanded.value

  nextTick(() => {
    measureScrollArea()
    if (ocIntroExpanded.value) {
      scrollToLatestMessage()
    }
  })
}

function createMockConversationMessages(key: string): ChatMessage[] {
  const prefix = key.replace(/[^a-zA-Z0-9_-]/g, '-')

  if (key.startsWith('oc:')) {
    return [
      createMockMessageWithId(`${prefix}-1`, 1, 'other', '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'),
      createMockMessageWithId(`${prefix}-2`, 2, 'me', '内容内容内容内容内容内容内容内容内容内容内容内容内容内容')
    ]
  }

  return [
    createMockMessageWithId(`${prefix}-1`, 1, 'other', '内容内容内容内容内容内容内容内容内容'),
    createMockMessageWithId(`${prefix}-2`, 2, 'me', '内容内容内容内容内容内容内容内容内容内容'),
    createMockMessageWithId(`${prefix}-3`, 3, 'other', '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'),
    createMockMessageWithId(`${prefix}-4`, 4, 'me', '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。'),
    createMockMessageWithId(`${prefix}-5`, 5, 'other', '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'),
    createMockMessageWithId(`${prefix}-6`, 6, 'me', '内容内容内容内容内容内容内容内容内容内容'),
    createMockMessageWithId(`${prefix}-7`, 7, 'other', '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容')
  ]
}

function createMockMessageWithId(
  id: string,
  order: number,
  sender: ChatMessage['sender'],
  content: string
): ChatMessage {
  return {
    id,
    sender,
    content,
    createdAt: baseTime + order * 60 * 1000,
    status: 'sent'
  }
}

function normalizeQueryValue(value: unknown) {
  if (Array.isArray(value)) return String(value[0] ?? '')
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function scrollToLatestMessage() {
  nextTick(() => {
    showNewMessageTip.value = false
    pendingNewMessageCount.value = 0
    scrollTargetId.value = ''
    nextTick(() => {
      scrollTargetId.value = latestScrollTargetId.value
    })
  })
}

function handleScroll(event: { detail?: { scrollTop?: number; scrollHeight?: number } }) {
  scrollMetrics.scrollTop = event.detail?.scrollTop ?? 0
  scrollMetrics.scrollHeight = event.detail?.scrollHeight ?? scrollMetrics.scrollHeight
  updateNearBottomState()
}

function handleScrollToUpper() {
  if (!historyLoadingEnabled) return
  loadOlderMessages()
}

function handleJumpToNewMessage() {
  scrollToLatestMessage()
}

function loadOlderMessages() {
  if (!historyLoadingEnabled) return
  if (loadingHistory.value || !hasMoreHistory.value) return

  loadingHistory.value = true
  const previousScrollTop = scrollMetrics.scrollTop
  const previousScrollHeight = scrollMetrics.scrollHeight

  setTimeout(() => {
    const nextBatch = historyBatch.value + 1
    const olderMessages = createMockHistoryMessages(nextBatch)
    historyBatch.value = nextBatch
    hasMoreHistory.value = nextBatch < 3
    chatMessages.value = [...olderMessages, ...chatMessages.value]

    nextTick(() => {
      measureScrollArea((nextScrollHeight) => {
        const heightDelta = Math.max(0, nextScrollHeight - previousScrollHeight)
        scrollTargetId.value = ''
        scrollTop.value = previousScrollTop + heightDelta
        scrollMetrics.scrollTop = scrollTop.value
        loadingHistory.value = false
      })
    })
  }, 520)
}

function createMockHistoryMessages(batch: number): ChatMessage[] {
  const prefix = `${conversationKey.value}:history:${batch}`.replace(/[^a-zA-Z0-9_-]/g, '-')
  const baseOrder = -batch * 3

  return [
    createMockMessageWithId(`${prefix}-1`, baseOrder - 2, 'other', '更早的内容内容内容内容内容内容内容内容内容'),
    createMockMessageWithId(`${prefix}-2`, baseOrder - 1, 'me', '更早的内容内容内容内容内容内容内容'),
    createMockMessageWithId(`${prefix}-3`, baseOrder, 'other', '更早的内容内容内容内容内容内容内容内容内容内容')
  ]
}

function updateNearBottomState() {
  if (!scrollMetrics.viewportHeight) return
  const distanceToBottom = scrollMetrics.scrollHeight - scrollMetrics.scrollTop - scrollMetrics.viewportHeight
  if (distanceToBottom <= uni.upx2px(160)) {
    showNewMessageTip.value = false
    pendingNewMessageCount.value = 0
  }
}

function isNearBottom() {
  if (!scrollMetrics.viewportHeight) return true
  return scrollMetrics.scrollHeight - scrollMetrics.scrollTop - scrollMetrics.viewportHeight <= uni.upx2px(160)
}

function measureScrollArea(callback?: (scrollHeight: number) => void) {
  const query = uni.createSelectorQuery().in(instance?.proxy)
  query.select('.chat-page__scroll').boundingClientRect((rect) => {
    const value = Array.isArray(rect) ? rect[0] : rect
    scrollMetrics.viewportHeight = Number(value?.height ?? scrollMetrics.viewportHeight)
  })
  query.select('.chat-page__messages').boundingClientRect((rect) => {
    const value = Array.isArray(rect) ? rect[0] : rect
    const height = Number(value?.height ?? scrollMetrics.scrollHeight)
    scrollMetrics.scrollHeight = height
    callback?.(height)
  })
  query.exec()
}

function sendMessage(message: ChatMessage) {
  const clientId = message.clientId
  if (!clientId) return

  const oldTimer = pendingSendTimers.get(clientId)
  if (oldTimer) clearTimeout(oldTimer)

  const timer = setTimeout(() => {
    pendingSendTimers.delete(clientId)
    const failed = shouldMockSendFail(message.content)
    updateMessageStatus(clientId, failed ? 'failed' : 'sent')
    if (failed || !scheduleMockIncomingMessage(message)) {
      isAwaitingReply.value = false
    }
  }, 700)

  pendingSendTimers.set(clientId, timer)
}

function appendIncomingMessage(message: ChatMessage) {
  const shouldFollow = isNearBottom()
  chatMessages.value.push(message)
  isAwaitingReply.value = false

  nextTick(() => {
    measureScrollArea()
    if (shouldFollow) {
      scrollToLatestMessage()
      return
    }

    pendingNewMessageCount.value += 1
    showNewMessageTip.value = true
  })
}

function scheduleMockIncomingMessage(sourceMessage: ChatMessage) {
  if (!chatProfile.value.autoReply) return false

  const clientId = sourceMessage.clientId
  if (!clientId) return false

  const timer = setTimeout(() => {
    pendingIncomingTimers.delete(clientId)
    appendIncomingMessage({
      id: `reply-${Date.now()}`,
      sender: 'other',
      content: '内容内容内容内容内容内容内容内容内容',
      createdAt: Date.now(),
      status: 'sent'
    })
  }, 900)

  pendingIncomingTimers.set(clientId, timer)
  return true
}

function updateMessageStatus(clientId: string, status: ChatMessage['status']) {
  chatMessages.value = chatMessages.value.map((item) => {
    if (item.clientId !== clientId) return item
    return { ...item, status }
  })
}

function shouldMockSendFail(content: string) {
  return content.includes('失败') || content.toLowerCase().includes('fail')
}

function getMessageStatusText(message: ChatMessage) {
  if (message.status === 'failed') return '发送失败，点击重试'
  return ''
}

function shouldShowTimeDivider(previousTime: number, currentTime: number) {
  if (!previousTime) return true
  return currentTime - previousTime >= 5 * 60 * 1000
}

function formatChatTime(timestamp: number) {
  const date = new Date(timestamp)
  const month = padTimePart(date.getMonth() + 1)
  const day = padTimePart(date.getDate())
  const hour = padTimePart(date.getHours())
  const minute = padTimePart(date.getMinutes())

  return `${month}/${day} ${hour}:${minute}`
}

function padTimePart(value: number) {
  return value < 10 ? `0${value}` : String(value)
}

function handleMore() {
  uni.navigateTo({
    url: `/pages/chat-settings/index?type=${conversationType.value}&id=${conversationId.value}`
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.chat-page {
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

.chat-header {
  position: relative;
  z-index: 6;
  flex: 0 0 auto;
  height: calc(var(--status-bar-height) + 20rpx + 112rpx);
  padding-top: calc(var(--status-bar-height) + 20rpx);
  box-sizing: border-box;
}

.chat-header__row {
  position: relative;
  height: 112rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 18rpx;
  overflow: visible;
}

.chat-header__lingbao {
  position: absolute;
  z-index: 0;
  left: 2rpx;
  top: -6rpx;
  width: 73rpx;
  height: 104rpx;
  opacity: 0.9;
  pointer-events: none;
}

.chat-header__avatar {
  position: relative;
  z-index: 1;
  flex: 0 0 93rpx;
  width: 93rpx;
  height: 93rpx;
  border: 2rpx solid rgba(51, 51, 51, 0.24);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.35);
}

.chat-header__avatar--oc {
  border-radius: 0;
}

.chat-header__avatar--user {
  border-radius: 0;
}

.chat-header__avatar-mark {
  width: 75rpx;
  height: 75rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(115, 138, 150, 0.82);
  font-size: 20rpx;
  line-height: 30rpx;
  background: #e5e5e5;
}

.chat-header__title {
  display: block;
  width: 100%;
  color: #333333;
  font-size: 30rpx;
  line-height: 40rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-header__info {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chat-header__meta {
  display: block;
  width: 100%;
  margin-top: 2rpx;
  color: #c6c6c6;
  font-size: 24rpx;
  line-height: 32rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-header__more {
  position: relative;
  z-index: 1;
  flex: 0 0 58rpx;
  width: 58rpx;
  height: 58rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  background: transparent;
}

.chat-header__more::after {
  border: 0;
}

.chat-header__more-icon {
  width: 45rpx;
  height: 45rpx;
}

.chat-page__body {
  position: relative;
  flex: 1;
  min-height: 0;
  padding: 0 24rpx calc(114rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.chat-page__body--actions-open {
  padding-bottom: calc(306rpx + env(safe-area-inset-bottom));
}

.chat-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.chat-page__messages {
  // padding: 12rpx 0 12rpx;
  box-sizing: border-box;
}

.chat-page__messages--oc {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chat-page__bottom-anchor {
  flex: 0 0 56rpx;
  height: 56rpx;
}

.chat-page__history-tip {
  padding: 4rpx 0 20rpx;
  color: #9a9a9a;
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
}

.chat-page__new-tip {
  position: absolute;
  left: 50%;
  bottom: calc(118rpx + env(safe-area-inset-bottom));
  z-index: 4;
  height: 52rpx;
  margin: 0;
  padding: 0 24rpx;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24rpx;
  line-height: 52rpx;
  background: rgba(86, 169, 236, 0.94);
  box-shadow: 0 4rpx 18rpx rgba(86, 169, 236, 0.28);
  transform: translateX(-50%);
}

.chat-page__new-tip--actions-open {
  bottom: calc(312rpx + env(safe-area-inset-bottom));
}

.chat-page__new-tip::after {
  border: 0;
}

.chat-oc-intro {
  position: relative;
  align-self: flex-start;
  width: 620rpx;
  max-width: 100%;
  margin: 0 0 34rpx 32rpx;
  padding: 20rpx 36rpx 18rpx 24rpx;
  border-radius: 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.92);
}

.chat-oc-intro__label,
.chat-oc-intro__content {
  display: block;
  color: #666666;
  font-size: 30rpx;
  line-height: 1.3;
  word-break: break-all;
}

.chat-oc-intro__content {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.chat-oc-intro--expanded .chat-oc-intro__content {
  display: block;
  overflow: visible;
  -webkit-line-clamp: unset;
}

.chat-oc-intro__label {
  margin-bottom: 4rpx;
}

.chat-oc-intro__toggle {
  position: absolute;
  right: 16rpx;
  bottom: 12rpx;
  width: 28rpx;
  height: 28rpx;
  margin: 0;
  padding: 0;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.chat-oc-intro__toggle::after {
  border: 0;
}

.chat-oc-intro__toggle-corner {
  position: relative;
  width: 18rpx;
  height: 18rpx;
  transform: rotate(90deg);
}

.chat-oc-intro__toggle-corner::before,
.chat-oc-intro__toggle-corner::after {
  content: '';
  position: absolute;
  border-color: #333333;
  border-style: solid;
  box-sizing: border-box;
}

.chat-oc-intro__toggle-corner::before {
  right: 0;
  bottom: 0;
  width: 12rpx;
  height: 12rpx;
  border-width: 0 2rpx 2rpx 0;
}

.chat-oc-intro__toggle-corner::after {
  right: 0;
  bottom: 0;
  width: 7rpx;
  height: 7rpx;
  border-width: 2rpx 0 0 2rpx;
  transform: translate(-6rpx, -6rpx);
}

.chat-oc-intro--expanded .chat-oc-intro__toggle-corner {
  transform: rotate(270deg);
}

.chat-time-divider {
  margin: 12rpx 0 26rpx;
  display: flex;
  justify-content: center;
}

.chat-time-divider__text {
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  color: #999999;
  font-size: 22rpx;
  line-height: 30rpx;
  background: rgba(255, 255, 255, 0.58);
}

.chat-message {
  width: 100%;
  display: flex;
}

.chat-message+.chat-message {
  margin-top: 41rpx;
}

.chat-message--other {
  justify-content: flex-start;
}

.chat-message--me {
  justify-content: flex-end;
}

.chat-message__stack {
  max-width: 560rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chat-message--me .chat-message__stack {
  align-items: flex-end;
}

.chat-message__bubble {
  max-width: 100%;
  padding: 16rpx 20rpx;
  border-radius: 28rpx;
  box-sizing: border-box;
  color: #111111;
  font-size: 34rpx;
  line-height: 1.45;
  word-break: break-all;
}

.chat-message--other .chat-message__bubble {
  background: rgba(255, 255, 255, 0.92);
}

.chat-message--me .chat-message__bubble {
  color: #ffffff;
  background: #56a9ec;
}

.chat-message--sending .chat-message__bubble {
  opacity: 0.72;
}

.chat-message--failed .chat-message__bubble {
  opacity: 0.88;
}

.chat-message__status {
  margin-top: 8rpx;
  padding-right: 8rpx;
  color: #9a9a9a;
  font-size: 22rpx;
  line-height: 30rpx;
}

.chat-message__retry {
  margin: 8rpx 0 0;
  padding: 0 8rpx;
  border-radius: 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #ff667a;
  font-size: 22rpx;
  line-height: 30rpx;
  background: transparent;
}

.chat-message__retry::after {
  border: 0;
}

.chat-message__retry-icon {
  width: 26rpx;
  height: 26rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18rpx;
  line-height: 26rpx;
  font-weight: 600;
  background: #ff667a;
}

.chat-input-dock {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  background: transparent;
}

.chat-input-dock--actions-open {
  padding-bottom: 0;
  background: #f8f8f8;
}

.chat-input-bar {
  position: relative;
  z-index: 0;
  height: 112rpx;
  padding: 0 13rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.chat-input-bar::before {
  content: '';
  position: absolute;
  z-index: -1;
  left: -11rpx;
  right: -11rpx;
  top: -11rpx;
  height: 134rpx;
  background-image: url('/static/message/input-bar-bg.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  pointer-events: none;
}

.chat-input-bar__back {
  flex: 0 0 56rpx;
  width: 56rpx;
  height: 112rpx;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.chat-input-bar__back::after,
.chat-input-bar__send::after {
  border: 0;
}

.chat-input-bar__back-icon {
  width: 50rpx;
  height: 50rpx;
}

.chat-input-bar__field {
  flex: 1;
  min-width: 0;
  // height: 90rpx;
  padding: 0 24rpx;
  border-radius: 16rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
}

.chat-input-bar__input {
  width: 100%;
  height: 80rpx;
  color: #333333;
  font-size: 30rpx;
  line-height: 72rpx;
}

.chat-input-bar__send {
  width: 73rpx;
  height: 73rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.chat-input-bar__send--active {
  padding-top: 4rpx;
  padding-right: 4rpx;
  background: rgba(255, 108, 123, 1);
}

.chat-input-bar__send--waiting {
  background: rgba(206, 206, 206, 1);
}

.chat-input-bar__send-icon {
  width: 73rpx;
  height: 73rpx;
}

.chat-input-bar__send--active .chat-input-bar__send-icon,
.chat-input-bar__send--waiting .chat-input-bar__send-icon {
  width: 38rpx;
  height: 38rpx;
}

.chat-input-bar__send--waiting .chat-input-bar__send-icon {
  animation: chat-send-rotate 0.9s linear infinite;
}

@keyframes chat-send-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.button-hover {
  opacity: 0.82;
}
</style>
