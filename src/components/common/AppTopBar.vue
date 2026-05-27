<template>
  <view
    class="app-top-bar"
    :class="[`app-top-bar--${variant}`, `app-top-bar--${surface}`, { 'app-top-bar--no-title': !title && !$slots.leading }]"
    :style="{ '--app-top-bar-padding': inlinePadding }"
  >
    <view class="app-top-bar__row">
      <view v-if="title || $slots.leading" class="app-top-bar__leading">
        <slot name="leading">
          <view class="app-top-bar__brand">
            <image class="app-top-bar__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
            <text class="app-top-bar__title" :data-title="title">{{ title }}</text>
            <image
              v-if="editable"
              class="app-top-bar__edit-icon"
              src="/static/manuscript/icon-writing-fluently.png"
              mode="aspectFit"
            />
          </view>
        </slot>
      </view>

      <view v-if="variant === 'search'" class="app-top-bar__search">
        <input
          class="app-top-bar__search-input"
          :value="modelValue"
          :placeholder="placeholder"
          placeholder-class="app-top-bar__search-placeholder"
          confirm-type="search"
          :adjust-position="true"
          :cursor-spacing="24"
          @input="handleInput"
          @confirm="emit('search', modelValue)"
        />
        <image class="app-top-bar__search-icon" src="/static/common/search.png" mode="aspectFit" />
      </view>

      <view v-if="$slots.content" class="app-top-bar__content">
        <slot name="content" />
      </view>

      <view v-if="showPublic" class="app-top-bar__public">
        <text>公开</text>
        <wd-switch v-model="publicProxy" size="20px" active-color="#ff6680" inactive-color="#d8d8d8" />
      </view>

      <slot name="trailing">
        <button
          v-if="actionText"
          class="app-top-bar__action"
          :class="`app-top-bar__action--${actionTone}`"
          hover-class="button-hover"
          :disabled="actionDisabled"
          @click="emit('action')"
        >
          {{ actionText }}
        </button>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type TopBarVariant = 'search' | 'title-action' | 'editor' | 'desktop' | 'plain'
type TopBarSurface = 'transparent' | 'fade'
type ActionTone = 'primary' | 'soft'

const props = withDefaults(
  defineProps<{
    variant?: TopBarVariant
    surface?: TopBarSurface
    title?: string
    modelValue?: string
    placeholder?: string
    actionText?: string
    actionTone?: ActionTone
    actionDisabled?: boolean
    inlinePadding?: string
    showPublic?: boolean
    publicValue?: boolean
    editable?: boolean
  }>(),
  {
    variant: 'plain',
    surface: 'transparent',
    title: '',
    modelValue: '',
    placeholder: '请输入',
    actionText: '',
    actionTone: 'primary',
    actionDisabled: false,
    inlinePadding: '26rpx',
    showPublic: false,
    publicValue: false,
    editable: false
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'update:publicValue', value: boolean): void
  (event: 'search', value: string): void
  (event: 'action'): void
}>()

const publicProxy = computed({
  get: () => props.publicValue,
  set: (value: boolean) => emit('update:publicValue', value)
})

function handleInput(event: Event) {
  const value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.app-top-bar {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  height: calc(var(--status-bar-height) + 20rpx + 88rpx);
  padding-top: calc(var(--status-bar-height) + 20rpx);
  box-sizing: border-box;
  overflow: visible;
}

.app-top-bar--fade {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.62) 76%, rgba(255, 255, 255, 0) 100%);
}

.app-top-bar__row {
  height: 88rpx;
  padding: 0 var(--app-top-bar-padding);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 0;
  overflow: visible;
}

.app-top-bar__leading {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: visible;
}

.app-top-bar--search .app-top-bar__leading {
  flex: 0 0 auto;
  max-width: 188rpx;
}

.app-top-bar__brand {
  position: relative;
  min-width: 0;
  height: 72rpx;
  padding-right: 44rpx;
  display: inline-flex;
  align-items: center;
  overflow: visible;
}

.app-top-bar__lingbao {
  position: absolute;
  z-index: 0;
  left: -28rpx;
  top: -14rpx;
  width: 74rpx;
  height: 104rpx;
  opacity: 0.92;
  pointer-events: none;
}

.app-top-bar__title {
  position: relative;
  z-index: 1;
  min-width: 0;
  color: rgba(255, 86, 116, 1);
  font-size: 40rpx;
  line-height: 44rpx;
  font-weight: 500;
  white-space: nowrap;
}

.app-top-bar__title::before {
  content: attr(data-title);
  position: absolute;
  z-index: -1;
  left: 6rpx;
  top: 5rpx;
  width: 220rpx;
  color: rgba(255, 86, 116, 0.12);
  font: inherit;
  line-height: inherit;
  white-space: nowrap;
  pointer-events: none;
}

.app-top-bar__title::after {
  content: "";
  position: absolute;
  left: calc(100% + 2rpx);
  top: 60%;
  width: 30rpx;
  height: 30rpx;
  background-image: url('/static/home/avatar-title-stars.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-40%);
}

.app-top-bar__edit-icon {
  position: relative;
  z-index: 1;
  flex: 0 0 30rpx;
  width: 30rpx;
  height: 30rpx;
  margin-left: 8rpx;
}

.app-top-bar__search {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  padding: 0 28rpx 0 36rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 2rpx 12rpx rgba(190, 190, 190, 0.12);
  box-sizing: border-box;
}

.app-top-bar__search-input {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  border: 0;
  outline: none;
  background: transparent;
  color: #333333;
  font-size: 26rpx;
  line-height: 72rpx;
}

.app-top-bar__search-placeholder {
  color: rgba(204, 204, 204, 1);
  font-size: 26rpx;
}

.app-top-bar__search-icon {
  flex: 0 0 36rpx;
  width: 36rpx;
  height: 36rpx;
}

.app-top-bar__content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.app-top-bar__public {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #a7a7a7;
  font-size: 30rpx;
  line-height: 42rpx;
  white-space: nowrap;
}

.app-top-bar__action {
  // width: 119rpx;
  padding: 0 24rpx !important;
  height: 65rpx;
  margin: 0;
  padding: 0;
  border-radius: 38rpx;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 67rpx;
  font-weight: 500;
}

.app-top-bar__action::after {
  border: 0;
}

.app-top-bar__action--primary {
  background: #ff667a;
}

.app-top-bar__action--soft {
  background: #ffaec0;
}

.app-top-bar__action[disabled] {
  opacity: 0.55;
}

.app-top-bar--no-title .app-top-bar__content {
  flex: 1;
}

.button-hover {
  opacity: 0.82;
}
</style>
