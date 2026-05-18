<template>
  <view class="manuscript-form">
    <view class="manuscript-form__body">
      <view class="manuscript-form__status">
        <text>12:00</text>
        <view class="manuscript-form__icons">
          <text>▮▮▮</text>
          <text>⌁</text>
          <text>▰</text>
        </view>
      </view>

      <view class="manuscript-form__top">
        <ManuscriptTitle title="新增文稿" />
        <view class="manuscript-form__actions">
          <view class="manuscript-form__public">
            <text>公开</text>
            <wd-switch v-model="isPublic" size="20px" active-color="#ff6680" inactive-color="#d8d8d8" />
          </view>
          <wd-button
            custom-class="manuscript-form__save"
            custom-style="background:#ff6680;border-color:#ff6680;color:#ffffff;"
            round
            size="small"
            @click="handleSave"
          >
            保存
          </wd-button>
        </view>
      </view>

      <view class="manuscript-form__field">
        <input
          class="manuscript-form__input"
          :value="title"
          maxlength="12"
          placeholder="请输入文稿名称..."
          placeholder-class="manuscript-form__placeholder"
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
import ManuscriptTitle from '@/components/manuscript/ManuscriptTitle.vue'

const title = ref('')
const isPublic = ref(true)

function handleTitleInput(event: Event) {
  title.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function handleSave() {
  uni.navigateTo({ url: '/pages/manuscript-detail/index' })
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
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.manuscript-form__body {
  height: 100%;
  padding: calc(var(--status-bar-height) + 22rpx) 28rpx calc(128rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.manuscript-form__status,
.manuscript-form__top,
.manuscript-form__actions,
.manuscript-form__public,
.manuscript-form__field {
  display: flex;
  align-items: center;
}

.manuscript-form__status {
  height: 44rpx;
  justify-content: space-between;
  padding: 0 8rpx;
  color: #222222;
  font-size: 28rpx;
  font-weight: 600;
}

.manuscript-form__icons {
  display: flex;
  gap: 12rpx;
  color: #333333;
  font-size: 20rpx;
}

.manuscript-form__top {
  justify-content: space-between;
  margin-top: 34rpx;
}

.manuscript-form__actions {
  gap: 34rpx;
}

.manuscript-form__public {
  gap: 14rpx;
  color: #a7a7a7;
  font-size: 30rpx;
}

:deep(.manuscript-form__save) {
  width: 119rpx !important;
  height: 67rpx !important;
  padding: 0;
  font-size: 27rpx;
  font-weight: 700;
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
  height: 112rpx;
}

@media screen and (min-width: 1200rpx) {
  .manuscript-form {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>

