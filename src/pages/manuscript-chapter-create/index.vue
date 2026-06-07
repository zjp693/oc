<template>
  <view class="chapter-form">
    <AppTopBar
      variant="editor"
      title="新增第N章"
      action-text="保存"
      :action-tone="actionTone"
      @action="handleSave"
    />

    <view class="chapter-form__body">
      <view class="chapter-form__field">
        <input
          class="chapter-form__input"
          :value="title"
          maxlength="15"
          placeholder="请输入章节名称"
          placeholder-class="chapter-form__placeholder"
          :adjust-position="false"
          :cursor-spacing="24"
          @input="handleTitleInput"
        />
        <text class="chapter-form__count">{{ title.length }}/15</text>
      </view>
    </view>

    <view class="chapter-form__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import { useDirtyState } from '@/composables/useDirtyState'

const title = ref('')
const { canSubmit, actionTone } = useDirtyState(() => title.value, { mode: 'filled' })

function handleTitleInput(event: Event) {
  title.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handleSave() {
  if (!title.value.trim()) {
    uni.showToast({
      title: '章节名称不能为空',
      icon: 'none'
    })
    return
  }

  if (!canSubmit.value) return

  uni.navigateTo({ url: '/pages/manuscript-chapter-edit/index' })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.chapter-form {
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

.chapter-form__body {
  flex: 1;
  min-height: 0;
  padding: 0 26rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.chapter-form__field {
  display: flex;
  align-items: center;
}

.chapter-form__field {
  height: 83rpx;
  margin-top: 42rpx;
  border-bottom: 1rpx solid rgba(51, 51, 51, 0.32);
}

.chapter-form__input {
  flex: 1;
  min-width: 0;
  height: 82rpx;
  color: #333333;
  font-size: 30rpx;
}

.chapter-form__placeholder {
  color: #8d969d;
}

.chapter-form__count {
  flex: 0 0 auto;
  color: #8e8e8e;
  font-size: 22rpx;
}

.chapter-form__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

</style>

