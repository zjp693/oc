<template>
  <view
    class="manuscript-editable-title"
    :class="[`manuscript-editable-title--${mode}`, `manuscript-editable-title--${titleTone}`]"
  >
    <image class="manuscript-editable-title__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />

    <view v-if="mode === 'chapter'" class="manuscript-editable-title__chapter-order" @tap.stop="focusOrderInput" @click.stop="focusOrderInput">
      <text class="manuscript-editable-title__order-prefix">第</text>
      <view class="manuscript-editable-title__order-field">
        <text class="manuscript-editable-title__order-measure">{{ orderText || '0' }}</text>
        <text class="manuscript-editable-title__order-text">{{ orderText }}</text>
        <input
          v-if="orderInputFocused"
          class="manuscript-editable-title__order-input"
          :value="orderText"
          type="text"
          maxlength="3"
          :focus="orderInputFocused"
          :adjust-position="true"
          :cursor-spacing="24"
          @input="handleOrderInput"
          @blur="orderInputFocused = false"
          @confirm="orderInputFocused = false"
        />
      </view>
      <text class="manuscript-editable-title__order-suffix">章</text>
      <text class="manuscript-editable-title__separator">·</text>
    </view>

    <view class="manuscript-editable-title__name" @tap.stop="focusTitleInput" @click.stop="focusTitleInput">
      <view class="manuscript-editable-title__title-field">
        <text class="manuscript-editable-title__title-measure">{{ titleMeasureText }}</text>
        <text
          class="manuscript-editable-title__title-text"
          :class="{ 'manuscript-editable-title__title-text--placeholder': titleIsPlaceholder }"
        >
          {{ titleDisplayText }}
        </text>
        <input
          v-if="titleInputFocused"
          class="manuscript-editable-title__title-input"
          :value="title"
          :maxlength="maxTitleLength"
          :focus="titleInputFocused"
          :adjust-position="true"
          :cursor-spacing="24"
          @input="handleTitleInput"
          @blur="titleInputFocused = false"
          @confirm="titleInputFocused = false"
        />
      </view>
      <image
        class="manuscript-editable-title__edit-icon"
        :src="editIconSrc"
        mode="aspectFit"
        @tap.stop="focusTitleInput"
        @click.stop="focusTitleInput"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

type EditableTitleMode = 'manuscript' | 'chapter'
type TitleTone = 'primary' | 'dark'
type IconTone = 'primary' | 'dark'

const props = withDefaults(
  defineProps<{
    mode?: EditableTitleMode
    title: string
    order?: number | string
    titleTone?: TitleTone
    iconTone?: IconTone
    maxTitleLength?: number
    placeholder?: string
  }>(),
  {
    mode: 'manuscript',
    order: 1,
    titleTone: 'dark',
    iconTone: 'dark',
    maxTitleLength: 15,
    placeholder: '请输入'
  }
)

const emit = defineEmits<{
  (event: 'update:title', value: string): void
  (event: 'update:order', value: number | string): void
}>()

const titleInputFocused = ref(false)
const orderInputFocused = ref(false)

const orderText = computed(() => String(props.order || ''))
const titleDisplayText = computed(() => props.title || (titleInputFocused.value ? '' : props.placeholder))
const titleMeasureText = computed(() => titleDisplayText.value || '　')
const titleIsPlaceholder = computed(() => !props.title && !titleInputFocused.value)
const editIconSrc = computed(() =>
  props.iconTone === 'dark'
    ? '/static/manuscript/icon-writing-fluently-dark.png'
    : '/static/manuscript/icon-writing-fluently.png'
)

function focusTitleInput() {
  if (titleInputFocused.value) return
  nextTick(() => {
    titleInputFocused.value = true
  })
}

function focusOrderInput() {
  if (orderInputFocused.value) return
  nextTick(() => {
    orderInputFocused.value = true
  })
}

function handleTitleInput(event: Event) {
  emit('update:title', (event as unknown as { detail?: { value?: string } }).detail?.value ?? '')
}

function handleOrderInput(event: Event) {
  const value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
  const digits = value.replace(/\D/g, '')
  emit('update:order', digits ? Number(digits) : '')
}
</script>

<style scoped lang="scss">
.manuscript-editable-title {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 72rpx;
  display: flex;
  align-items: center;
  overflow: visible;
}

.manuscript-editable-title__lingbao {
  position: absolute;
  z-index: 0;
  left: -28rpx;
  top: -14rpx;
  width: 74rpx;
  height: 104rpx;
  opacity: 0.9;
  pointer-events: none;
}

.manuscript-editable-title__chapter-order,
.manuscript-editable-title__name {
  position: relative;
  z-index: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
}

.manuscript-editable-title__chapter-order {
  flex: 0 0 auto;
  height: 60rpx;
}

.manuscript-editable-title__name {
  flex: 0 1 auto;
  max-width: 100%;
  height: 60rpx;
  gap: 8rpx;
}

.manuscript-editable-title--chapter .manuscript-editable-title__name {
  flex: 1;
}

.manuscript-editable-title__order-prefix,
.manuscript-editable-title__order-suffix,
.manuscript-editable-title__separator,
.manuscript-editable-title__order-text,
.manuscript-editable-title__order-measure,
.manuscript-editable-title__order-input,
.manuscript-editable-title__title-text,
.manuscript-editable-title__title-measure,
.manuscript-editable-title__title-input {
  color: #ff5674;
  font-size: 38rpx;
  line-height: 48rpx;
  font-weight: 500;
  white-space: nowrap;
}

.manuscript-editable-title--manuscript .manuscript-editable-title__title-text,
.manuscript-editable-title--manuscript .manuscript-editable-title__title-measure,
.manuscript-editable-title--manuscript .manuscript-editable-title__title-input {
  font-size: 40rpx;
  line-height: 50rpx;
  font-weight: 500;
}

.manuscript-editable-title--dark .manuscript-editable-title__title-text,
.manuscript-editable-title--dark .manuscript-editable-title__title-measure,
.manuscript-editable-title--dark .manuscript-editable-title__title-input,
.manuscript-editable-title--chapter .manuscript-editable-title__title-text,
.manuscript-editable-title--chapter .manuscript-editable-title__title-measure,
.manuscript-editable-title--chapter .manuscript-editable-title__title-input,
.manuscript-editable-title--chapter .manuscript-editable-title__separator {
  color: #333333;
}

.manuscript-editable-title__order-field {
  position: relative;
  flex: 0 0 auto;
  height: 60rpx;
  min-width: 28rpx;
}

.manuscript-editable-title__title-field {
  position: relative;
  flex: 0 1 auto;
  min-width: 1em;
  max-width: 100%;
  height: 60rpx;
}

.manuscript-editable-title__title-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.manuscript-editable-title__title-text--placeholder {
  color: #999999 !important;
}

.manuscript-editable-title__order-text,
.manuscript-editable-title__title-text {
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}

.manuscript-editable-title__order-measure,
.manuscript-editable-title__title-measure {
  display: block;
  color: transparent !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

.manuscript-editable-title__order-input,
.manuscript-editable-title__title-input {
  position: absolute;
  left: 0;
  top: 50%;
  height: 48rpx;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  background: transparent;
  color: transparent !important;
  caret-color: currentColor;
  transform: translateY(-50%);
}

.manuscript-editable-title__order-input {
  width: 100%;
  min-width: 28rpx;
  caret-color: #ff5674;
}

.manuscript-editable-title__title-input {
  width: 100%;
  min-width: 0;
  caret-color: #333333;
}

.manuscript-editable-title__edit-icon {
  position: relative;
  z-index: 1;
  flex: 0 0 32rpx;
  width: 32rpx;
  height: 32rpx;
  margin-left: 2rpx;
}
</style>
