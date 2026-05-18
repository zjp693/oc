<template>
  <view class="report-page">
    <AppTopBar
      variant="title-action"
      surface="fade"
      title="举报"
      action-text="提交"
      inline-padding="27rpx"
      @action="handleSubmit"
    />

    <scroll-view class="report-page__scroll" scroll-y>
      <view class="report-page__content">
        <view class="report-section">
          <text class="report-section__title">
            选择举报类型<text class="report-section__required">*</text>
          </text>

          <wd-radio-group
            v-model="reportType"
            custom-class="report-type-group"
            checked-color="#ff667a"
            unchecked-color="#d4d4d4"
          >
            <view class="report-type-grid">
              <wd-radio
                v-for="item in reportTypes"
                :key="item.value"
                :value="item.value"
                custom-class="report-type-radio"
                custom-label-class="report-type-radio__label"
              >
                {{ item.label }}
              </wd-radio>
            </view>
          </wd-radio-group>
        </view>

        <view class="report-section report-section--content">
          <text class="report-section__title">
            具体内容<text class="report-section__required">*</text>
          </text>

          <wd-textarea
            v-model="content"
            custom-class="report-textarea"
            custom-textarea-class="report-textarea__inner"
            placeholder=""
            :maxlength="100"
            show-word-limit
            :show-confirm-bar="false"
            :adjust-position="false"
          />
        </view>

        <view class="report-section report-section--upload">
          <text class="report-section__title">上传图片</text>

          <wd-upload
            v-model:file-list="fileList"
            custom-class="report-upload"
            custom-evoke-class="report-upload__evoke"
            custom-preview-class="report-upload__preview"
            :limit="2"
            :auto-upload="false"
            :show-limit-num="false"
            image-mode="aspectFill"
          >
            <view class="report-upload__add">
              <view class="report-upload__plus"></view>
            </view>
          </wd-upload>
        </view>
      </view>
    </scroll-view>

    <view class="report-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'

interface ReportTypeOption {
  label: string
  value: string
}

interface UploadFile {
  url: string
  [key: string]: unknown
}

const reportType = ref('')
const content = ref('')
const fileList = ref<UploadFile[]>([])

const reportTypes: ReportTypeOption[] = [
  { label: '侮辱内容', value: 'insult' },
  { label: '涉及敏感', value: 'sensitive' },
  { label: '宣传广告', value: 'advertising' },
  { label: '色情暴力', value: 'violence' },
  { label: '其他', value: 'other' }
]

function handleSubmit() {
  uni.showToast({
    title: '提交成功',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.report-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.report-page__scroll {
  flex: 1;
  min-height: 0;
}

.report-page__content {
  padding: 12rpx 30rpx calc(154rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.report-section + .report-section {
  margin-top: 31rpx;
}

.report-section__title {
  display: block;
  color: #333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 400;
}

.report-section__required {
  color: #ff667a;
  font-weight: 400;
}

.report-type-grid {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20rpx;
  column-gap: 58rpx;
}

:deep(.report-type-radio) {
  height: 34rpx;
  justify-content: flex-end;
  overflow: visible;
}

:deep(.report-type-radio .wd-radio__shape) {
  width: 27rpx;
  height: 27rpx;
}

:deep(.report-type-radio .wd-radio__icon) {
  font-size: 27rpx;
  width: 27rpx;
  height: 27rpx;
  line-height: 27rpx;
}

:deep(.report-type-radio__label) {
  margin-left: 13rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 34rpx;
  text-align: left;
}

.report-section--content {
  margin-top: 34rpx;
}

:deep(.report-textarea) {
  position: relative;
  width: 740rpx;
  max-width: 100%;
  height: 660rpx;
  margin-top: 20rpx;
  padding: 18rpx 20rpx 35rpx;
  border: 1rpx solid #bfbfbf;
  border-radius: 10rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.28);
}

:deep(.report-textarea .wd-textarea__body) {
  height: 100%;
}

:deep(.report-textarea__inner) {
  min-height: 587rpx;
  height: 587rpx;
  color: #333;
  font-size: 28rpx;
  line-height: 40rpx;
}

:deep(.report-textarea .wd-textarea__count) {
  position: absolute;
  right: 20rpx;
  bottom: 8rpx;
  color: #999;
  font-size: 24rpx;
  line-height: 34rpx;
}

.report-section--upload {
  margin-top: 33rpx;
}

:deep(.report-upload) {
  margin-top: 18rpx;
  gap: 20rpx;
}

:deep(.report-upload__preview),
:deep(.report-upload__evoke),
.report-upload__add {
  width: 188rpx;
  height: 188rpx;
  border-radius: 10rpx;
  box-sizing: border-box;
}

:deep(.report-upload__preview) {
  margin: 0 0 0 0;
  border: 1rpx solid #bfbfbf;
  background: #e6e6e6;
}

:deep(.report-upload__evoke) {
  padding: 0;
  border: 1rpx solid #bfbfbf;
  background: rgba(255, 255, 255, 0.34);
}

.report-upload__add {
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-upload__plus {
  position: relative;
  width: 42rpx;
  height: 42rpx;
}

.report-upload__plus::before,
.report-upload__plus::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background: #b7b7b7;
  transform: translate(-50%, -50%);
}

.report-upload__plus::before {
  width: 38rpx;
  height: 2rpx;
}

.report-upload__plus::after {
  width: 2rpx;
  height: 38rpx;
}

:deep(.report-upload .wd-upload__close) {
  border-radius: 0 10rpx 0 10rpx;
}

.report-page__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 112rpx;
  overflow: hidden;
}

.button-hover {
  opacity: 0.82;
}

@media screen and (min-width: 1200rpx) {
  .report-page {
    max-width: 804rpx;
    margin: 0 auto;
  }
}
</style>
