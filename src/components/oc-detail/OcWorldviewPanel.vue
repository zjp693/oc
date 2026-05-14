<template>
  <view class="oc-worldview-panel">
    <view class="oc-worldview-card">
      <view class="oc-worldview-card__top">
        <text class="oc-worldview-card__label">当前世界观</text>
        <button
          v-if="showSetting"
          class="oc-worldview-card__more"
          hover-class="button-hover"
          @click="emit('setting')"
        >
          世界观设置
        </button>
      </view>
      <text class="oc-worldview-card__title">世界观名称名称</text>
      <text class="oc-worldview-card__content">
        世界观简介内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。
      </text>
    </view>

    <view class="oc-worldview-card">
      <text class="oc-worldview-card__label">角色关联说明</text>
      <text class="oc-worldview-card__content">
        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showSetting?: boolean
  }>(),
  {
    showSetting: false
  }
)

const emit = defineEmits<{
  (event: 'setting'): void
}>()
</script>

<style scoped lang="scss">
.oc-worldview-panel {
  padding: 20rpx 27rpx 190rpx;
  box-sizing: border-box;
}

.oc-worldview-card {
  border-radius: 24rpx;
  padding: 26rpx 26rpx 28rpx;
  box-sizing: border-box;
  background: #fff;
}

.oc-worldview-card + .oc-worldview-card {
  margin-top: 24rpx;
}

.oc-worldview-card__top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oc-worldview-card__label {
  color: #aaa;
  font-size: 30rpx;
  line-height: 40rpx;
}

.oc-worldview-card__title {
  display: block;
  margin-top: 14rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 700;
}

.oc-worldview-card__content {
  display: block;
  margin-top: 12rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 44rpx;
}

.oc-worldview-card__more {
  position: absolute;
  top: -6rpx;
  right: 0;
  width: 176rpx;
  height: 52rpx;
  margin: 0;
  padding: 0;
  border-radius: 28rpx;
  color: #333;
  font-size: 24rpx;
  line-height: 52rpx;
  background: #fff;
}

.oc-worldview-card__more::after {
  border: 0;
}

.button-hover {
  opacity: 0.82;
}
</style>
