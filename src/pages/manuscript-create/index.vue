<template>
  <view class="manuscript-form">
    <AppTopBar
      variant="editor"
      title="新增文稿"
      action-text="保存"
      :action-tone="actionTone"
      show-public
      :public-value="isPublic"
      @update:public-value="isPublic = $event"
      @action="handleSave"
    />

    <view class="manuscript-form__body">
      <view class="manuscript-form__field">
        <input
          class="manuscript-form__input"
          :value="title"
          maxlength="12"
          placeholder="请输入文稿名称..."
          placeholder-class="manuscript-form__placeholder"
          :adjust-position="false"
          :cursor-spacing="24"
          @input="handleTitleInput"
        />
        <text class="manuscript-form__count">{{ title.length }}/12</text>
      </view>
    </view>

    <view class="manuscript-form__bottom">
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
const isPublic = ref(true)
const { canSubmit, actionTone, markClean } = useDirtyState(() => ({
  title: title.value,
  isPublic: isPublic.value
}), {
  isFilled: (value) => value.title.trim().length > 0
})

function handleTitleInput(event: Event) {
  title.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handleSave() {
  if (!title.value.trim()) {
    uni.showToast({
      title: '文稿名称不能为空',
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
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.manuscript-form {
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

.manuscript-form__body {
  flex: 1;
  min-height: 0;
  padding: 0 26rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.manuscript-form__field {
  display: flex;
  align-items: center;
}

.manuscript-form__field {
  height: 83rpx;
  margin-top: 42rpx;
  border-bottom: 1rpx solid rgba(51, 51, 51, 0.32);
}

.manuscript-form__input {
  flex: 1;
  min-width: 0;
  height: 82rpx;
  color: #333333;
  font-size: 30rpx;
}

.manuscript-form__placeholder {
  color: #8d969d;
}

.manuscript-form__count {
  flex: 0 0 auto;
  color: #8e8e8e;
  font-size: 22rpx;
}

.manuscript-form__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(12rpx + env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

</style>

