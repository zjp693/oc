<template>
  <view class="report-page">
    <AppTopBar
      variant="title-action"
      surface="fade"
      title="举报"
      action-text="提交"
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
                type="dot"
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
            :adjust-position="true"
            :cursor-spacing="24"
          />
        </view>

        <view class="report-section report-section--upload">
          <text class="report-section__title">上传图片</text>

          <view class="report-upload">
            <view
              v-for="(item, index) in fileList"
              :key="index"
              class="report-upload__preview"
            >
              <image v-if="item.url" class="report-upload__image" :src="item.url" mode="aspectFill" />
              <wd-icon v-else name="image" size="26rpx" color="#8aa1ac" />
            </view>

            <view v-if="fileList.length < 2" class="report-upload__evoke" @click="handleChooseImage">
              <view class="report-upload__plus"></view>
            </view>
          </view>
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
const fileList = ref<UploadFile[]>([{ url: '' }])

const reportTypes: ReportTypeOption[] = [
  { label: '侮辱内容', value: 'insult' },
  { label: '涉及敏感', value: 'sensitive' },
  { label: '宣传广告', value: 'advertising' },
  { label: '色情暴力', value: 'violence' },
  { label: '其他', value: 'other' }
]

function handleSubmit() {
  if (!reportType.value) {
    uni.showToast({
      title: '请选择举报类型',
      icon: 'none'
    })
    return
  }

  if (!content.value.trim()) {
    uni.showToast({
      title: '请填写具体内容',
      icon: 'none'
    })
    return
  }

  uni.showToast({
    title: '提交成功',
    icon: 'none'
  })
}

function handleChooseImage() {
  uni.chooseImage({
    count: 2 - fileList.value.length,
    success: (result) => {
      const tempFilePaths = Array.isArray(result.tempFilePaths) ? result.tempFilePaths : [result.tempFilePaths]
      const paths = tempFilePaths.map((url: string) => ({ url }))
      fileList.value = [...fileList.value.filter((item) => item.url), ...paths].slice(0, 2)
    }
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
  padding: 28rpx 30rpx calc(154rpx + env(safe-area-inset-bottom));
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
  font-weight: 600;
}

.report-section__required {
  color: #ff667a;
  font-weight: 400;
}

.report-type-grid {
  margin-top: 18rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 40rpx;
  column-gap: 58rpx;
}

:deep(.report-type-radio) {
  height: 34rpx;
  justify-content: flex-end;
  overflow: visible;
}

:deep(.report-type-radio .wd-radio__shape) {
  width: 34rpx;
  height: 34rpx;
}

:deep(.report-type-radio .wd-radio__icon) {
  font-size: 34rpx;
  width: 34rpx;
  height: 34rpx;
  line-height: 34rpx;
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
  padding: 10rpx 10rpx 10rpx;
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

.report-upload {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;

  &__preview,
  &__evoke {
    width: 188rpx;
    height: 188rpx;
    border-radius: 10rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__preview {
    border: 1rpx solid #ffffff;
    background: #e6e6e6;
  }

  &__evoke {
    border: 1rpx solid #bfbfbf;
    background: rgba(255, 255, 255, 0.34);
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__plus {
    position: relative;
    width: 42rpx;
    height: 42rpx;

    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      background: #b7b7b7;
      transform: translate(-50%, -50%);
    }

    &::before {
      width: 38rpx;
      height: 2rpx;
    }

    &::after {
      width: 2rpx;
      height: 38rpx;
    }
  }
}

.report-page__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
  overflow: hidden;
}

.button-hover {
  opacity: 0.82;
}

</style>
