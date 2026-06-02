<template>
  <view
    v-if="props.modelValue"
    class="oc-action-sheet"
    :class="[`oc-action-sheet--${props.variant}`, `oc-action-sheet--${props.presentation}`]"
    @click="handleRootClick"
  >
    <view class="oc-action-sheet__panel" @click.stop>
      <text v-if="props.title" class="oc-action-sheet__title">{{ props.title }}</text>
      <view v-if="props.title" class="oc-action-sheet__line"></view>

      <view class="oc-action-sheet__actions">
        <view
          v-for="item in props.actions"
          :key="item.key"
          class="oc-action-sheet__action"
          :class="{ 'oc-action-sheet__action--danger': item.tone === 'danger' }"
          :style="{ '--oc-action-icon-size': item.iconSize || '41rpx' }"
          @click="handleAction(item.key)"
        >
          <view v-if="item.iconUrl" class="oc-action-sheet__icon-box">
            <image
              class="oc-action-sheet__action-icon"
              :src="item.iconUrl"
              mode="aspectFit"
            />
          </view>
          <view v-else-if="item.icon === 'adjust'" class="oc-action-sheet__adjust-icon">
            <view class="oc-action-sheet__adjust-line oc-action-sheet__adjust-line--top"></view>
            <view class="oc-action-sheet__adjust-line oc-action-sheet__adjust-line--middle"></view>
            <view class="oc-action-sheet__adjust-line oc-action-sheet__adjust-line--bottom"></view>
          </view>
          <view v-else-if="item.icon === 'reset'" class="oc-action-sheet__reset-icon">
            <view class="oc-action-sheet__reset-arrow"></view>
          </view>
          <view v-else-if="item.icon === 'phone'" class="oc-action-sheet__phone-icon">
            <view class="oc-action-sheet__phone-back"></view>
            <view class="oc-action-sheet__phone-front"></view>
          </view>
          <wd-icon
            v-else
            :name="item.icon"
            :size="item.iconSize || '44rpx'"
            :color="item.tone === 'danger' ? '#ff667a' : '#333333'"
          />
          <text class="oc-action-sheet__action-text">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface OcSheetAction {
  key: string
  label: string
  icon: string
  iconUrl?: string
  iconSize?: string
  tone?: 'default' | 'danger'
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    actions: OcSheetAction[]
    variant?: 'list' | 'grid'
    presentation?: 'overlay' | 'inline'
  }>(),
  {
    title: '',
    variant: 'list',
    presentation: 'overlay'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'select', key: string): void
}>()

function handleAction(key: string) {
  emit('select', key)
  emit('update:modelValue', false)
}

function handleRootClick() {
  if (props.presentation === 'overlay') {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped lang="scss">
.oc-action-sheet {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.5);
}

.oc-action-sheet--inline {
  position: relative;
  inset: auto;
  z-index: auto;
  display: block;
  background: transparent;
}

.oc-action-sheet__panel {
  width: 100%;
  min-height: 624rpx;
  padding: 54rpx 36rpx calc(66rpx + env(safe-area-inset-bottom));
  border-radius: 44rpx 44rpx 0 0;
  box-sizing: border-box;
  background: #f8f8f8;
}

.oc-action-sheet--grid .oc-action-sheet__panel {
  min-height: 232rpx;
  padding: 40rpx 48rpx calc(30rpx + env(safe-area-inset-bottom));
  border-radius: 44rpx 44rpx 0 0;
  background: #ffffff;
}

.oc-action-sheet--inline.oc-action-sheet--grid .oc-action-sheet__panel {
  min-height: 194rpx;
  padding: 20rpx 78rpx calc(28rpx + env(safe-area-inset-bottom));
  border-radius: 0;
  background: #f8f8f8;
}

.oc-action-sheet__title {
  display: block;
  color: #333;
  font-size: 34rpx;
  line-height: 44rpx;
  font-weight: 400;
  text-align: center;
}

.oc-action-sheet__line {
  width: 28rpx;
  height: 4rpx;
  margin: 8rpx auto 38rpx;
  background: #ff667a;
}

.oc-action-sheet__actions {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.oc-action-sheet--grid .oc-action-sheet__actions {
  flex-direction: row;
  align-items: flex-start;
  gap: 52rpx;
}

.oc-action-sheet__action {
  position: relative;
  height: 94rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 30rpx;
  line-height: 44rpx;
  font-weight: 500;
  background: #fff;
}

.oc-action-sheet--grid .oc-action-sheet__action {
  width: 112rpx;
  height: auto;
  border-radius: 0;
  flex-direction: column;
  justify-content: flex-start;
  gap: 14rpx;
  font-size: 24rpx;
  line-height: 34rpx;
  font-weight: 400;
  background: transparent;
}

.oc-action-sheet__icon-box,
.oc-action-sheet__action-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  transform: translateY(-50%);
}

.oc-action-sheet__icon-box {
  width: var(--oc-action-icon-size);
  height: var(--oc-action-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
}

.oc-action-sheet__action-icon {
  width: var(--oc-action-icon-size);
  height: var(--oc-action-icon-size);
}

.oc-action-sheet--grid .oc-action-sheet__icon-box,
.oc-action-sheet--grid .oc-action-sheet__action-icon,
.oc-action-sheet--grid .oc-action-sheet__adjust-icon,
.oc-action-sheet--grid .oc-action-sheet__reset-icon,
.oc-action-sheet--grid .oc-action-sheet__phone-icon {
  position: relative;
  left: auto;
  top: auto;
  width: 72rpx;
  height: 72rpx;
  border-radius:19rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  transform: none;
}

.oc-action-sheet--grid .oc-action-sheet__icon-box {
  width: 101rpx;
  height: 101rpx;
}

.oc-action-sheet--grid .oc-action-sheet__action-icon {
  width: var(--oc-action-icon-size);
  height: var(--oc-action-icon-size);
  border-radius: 0;
  background: transparent;
}

.oc-action-sheet__adjust-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  width: 42rpx;
  height: 42rpx;
  transform: translateY(-50%);
}

.oc-action-sheet__adjust-line {
  position: absolute;
  left: 6rpx;
  width: 30rpx;
  height: 3rpx;
  border-radius: 2rpx;
  background: #333;
}

.oc-action-sheet__adjust-line::after {
  content: '';
  position: absolute;
  top: -5rpx;
  width: 8rpx;
  height: 8rpx;
  border: 3rpx solid #333;
  border-radius: 50%;
  background: #fff;
}

.oc-action-sheet__adjust-line--top {
  top: 9rpx;
}

.oc-action-sheet__adjust-line--top::after {
  left: 4rpx;
}

.oc-action-sheet__adjust-line--middle {
  top: 20rpx;
}

.oc-action-sheet__adjust-line--middle::after {
  right: 4rpx;
}

.oc-action-sheet__adjust-line--bottom {
  top: 31rpx;
}

.oc-action-sheet__adjust-line--bottom::after {
  left: 12rpx;
}

.oc-action-sheet__reset-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  width: 42rpx;
  height: 42rpx;
  transform: translateY(-50%);
}

.oc-action-sheet__reset-arrow {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid #111111;
  border-left-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  transform: rotate(-28deg);
}

.oc-action-sheet__reset-arrow::before {
  content: '';
  position: absolute;
  left: -2rpx;
  top: -7rpx;
  width: 14rpx;
  height: 14rpx;
  border-left: 4rpx solid #111111;
  border-bottom: 4rpx solid #111111;
  box-sizing: border-box;
  transform: rotate(12deg);
}

.oc-action-sheet__phone-icon {
  position: absolute;
  left: 40rpx;
  top: 50%;
  width: 42rpx;
  height: 42rpx;
  transform: translateY(-50%);
}

.oc-action-sheet__phone-back,
.oc-action-sheet__phone-front {
  position: absolute;
  border: 4rpx solid #111111;
  border-radius: 3rpx;
  box-sizing: border-box;
  background: #ffffff;
}

.oc-action-sheet__phone-back {
  left: 13rpx;
  top: 6rpx;
  width: 20rpx;
  height: 29rpx;
}

.oc-action-sheet__phone-front {
  left: 6rpx;
  top: 13rpx;
  width: 20rpx;
  height: 29rpx;
}

.oc-action-sheet__action-text {
  display: block;
  width: 100%;
  text-align: center;
}

.oc-action-sheet--grid .oc-action-sheet__action-text {
  color: #333333;
}

.oc-action-sheet__action--danger .oc-action-sheet__action-text {
  color: #ff667a;
}
</style>
