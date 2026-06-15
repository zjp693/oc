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
          <ManuscriptEditableTitle
            v-model:title="chapterTitle"
            v-model:order="chapterOrder"
            :adjust-position="false"
            mode="chapter"
            title-tone="dark"
            icon-tone="dark"
            placeholder="请输入章节名称"
          />
        </template>
      </AppTopBar>
    </view>

    <!-- adjustNothing + adjust-position=false（避免顶飞）。
         scroll-view 当滚动体：键盘弹起时加大 padding-bottom 腾出键盘高度，
         再按「点击位置 + 键盘高度」精确把光标行滚到键盘正上方（不再瞎滚到底）。 -->
    <scroll-view
      class="chapter-editor__body"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="isScrollAnimating"
      :show-scrollbar="false"
      :style="bodyStyle"
      @scroll="handleScroll"
    >
      <textarea
        class="chapter-editor__textarea"
        :value="content"
        placeholder="开始写..."
        placeholder-class="chapter-editor__placeholder"
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

    <view class="chapter-editor__bottom" :class="{ 'chapter-editor__bottom--hidden': keyboardHeight > 0 }">
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
import ManuscriptEditableTitle from '@/components/manuscript/ManuscriptEditableTitle.vue'
import ManuscriptTopFade from '@/components/manuscript/ManuscriptTopFade.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import { useDirtyState } from '@/composables/useDirtyState'
import { useKeyboardAwareScroll } from '@/composables/useKeyboardAwareScroll'

const content = ref('')
const chapterOrder = ref<number | string>('N')
const chapterTitle = ref('章节名称')
const showLeaveConfirm = ref(false)
const isLeavingConfirmed = ref(false)
const { isDirty, canSubmit, actionTone, markClean } = useDirtyState(() => ({
  order: chapterOrder.value,
  title: chapterTitle.value,
  content: content.value
}))

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

type ChapterEditQuery = Record<string, string | string[] | undefined>

function getQueryValue(query: ChapterEditQuery | undefined, key: string) {
  const value = query?.[key]
  const rawValue = Array.isArray(value) ? value[0] : value
  if (!rawValue) return ''

  try {
    return decodeURIComponent(rawValue)
  } catch {
    return rawValue
  }
}

onLoad((query) => {
  const title = getQueryValue(query as ChapterEditQuery, 'title')
  if (title) chapterTitle.value = title
  markClean()
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
  if (!chapterTitle.value.trim()) {
    uni.showToast({
      title: '章节名称不能为空',
      icon: 'none'
    })
    return
  }

  if (!canSubmit.value) return

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
  padding: 26rpx 26rpx calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  /* 不要给 padding-bottom 加 transition：键盘弹起时额外滚动空间必须瞬间到位，
     否则长文本滚到底后，scrollTop 会被截断在旧的最大值，光标抬不上来。 */
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

.chapter-editor__textarea {
  display: block;
  /* 固定算式撑满可视区（不要 min-height:100%，否则短内容滚动会把文字甩出去） */
  min-height: calc(100vh - var(--status-bar-height) - 102rpx - 26rpx - 100rpx - env(safe-area-inset-bottom));
  width: 100%;
  padding: 8rpx 12rpx 0;
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
  height: 100rpx;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.chapter-editor__bottom--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(20rpx);
}

</style>
