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
            mode="chapter"
            title-tone="dark"
            icon-tone="dark"
            placeholder="章节名称"
          />
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

    <OcConfirmDialog
      v-model="showLeaveConfirm"
      content="当前内容未保存，确认退出吗？"
      @confirm="handleConfirmLeave"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onBackPress } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import ManuscriptEditableTitle from '@/components/manuscript/ManuscriptEditableTitle.vue'
import ManuscriptTopFade from '@/components/manuscript/ManuscriptTopFade.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import { useDirtyState } from '@/composables/useDirtyState'

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
