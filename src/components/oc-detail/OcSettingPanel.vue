<template>
  <view class="oc-setting-panel">
    <view class="oc-setting-card oc-setting-card--basic">
      <text class="oc-setting-card__heading">基本信息</text>
      <view class="oc-setting-row">
        <text class="oc-setting-row__label">名字</text>
        <text class="oc-setting-row__value">名字</text>
      </view>
      <view class="oc-setting-row">
        <text class="oc-setting-row__label">职业</text>
        <text class="oc-setting-row__value">职业内容内容内容</text>
      </view>
      <view class="oc-setting-row oc-setting-row--intro">
        <text class="oc-setting-row__label">简介</text>
        <text class="oc-setting-row__value">内容内容内容内容内容内容内容内容内容内容内容内容</text>
      </view>
    </view>

    <view class="oc-setting-group">
      <text class="oc-setting-group__title">自定义组标题名称</text>
      <view class="oc-setting-card">
        <view class="oc-setting-custom">
          <text class="oc-setting-custom__title">自定义标题名称</text>
          <text class="oc-setting-custom__content">内容内容内容内容内容内容内容内容内容</text>
        </view>
        <view class="oc-setting-custom">
          <text class="oc-setting-custom__title">自定义标题名称</text>
          <text class="oc-setting-custom__content">内容内容内容内容内容内容内容内容内容内容内容内容</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.oc-setting-panel {
  padding: 7rpx 27rpx 190rpx;
  box-sizing: border-box;
}

.oc-setting-card {
  border-radius: 24rpx;
  padding: 22rpx 26rpx 24rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.72);
}

.oc-setting-card--basic {
  min-height: 291rpx;
}

.oc-setting-card__heading,
.oc-setting-group__title,
.oc-setting-custom__title,
.oc-setting-row__label {
  color: #aaa;
  font-size: 30rpx;
  line-height: 40rpx;
}

.oc-setting-row {
  margin-top: 7rpx;
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.oc-setting-row--intro {
  margin-top: 8rpx;
}

.oc-setting-row__label {
  flex: 0 0 auto;
}

.oc-setting-row__value {
  flex: 1;
  min-width: 0;
  color: #333;
  font-size: 30rpx;
  line-height: 40rpx;
}

.oc-setting-group {
  margin-top: 28rpx;
}

.oc-setting-group__title {
  display: block;
  margin-left: 26rpx;
  margin-bottom: 16rpx;
}

.oc-setting-custom + .oc-setting-custom {
  margin-top: 18rpx;
}

.oc-setting-custom__title,
.oc-setting-custom__content {
  display: block;
}

.oc-setting-custom__content {
  margin-top: 4rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 42rpx;
}
</style>
