<template>
  <view
    class="oc-detail-tabs"
    @touchstart="handleSwipeStart"
    @touchmove="handleSwipeMove"
    @touchend="handleSwipeEnd"
    @touchcancel="handleSwipeCancel"
  >
    <view
      v-for="item in tabs"
      :key="item.value"
      class="oc-detail-tabs__item"
      :class="{ 'oc-detail-tabs__item--active': item.value === modelValue }"
      @click="handleClick(item.value)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

export type OcDetailTab = 'setting' | 'worldview'

const props = defineProps<{
  modelValue: OcDetailTab
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: OcDetailTab): void
  (event: 'change', value: OcDetailTab): void
}>()

const tabs: Array<{ label: string; value: OcDetailTab }> = [
  { label: '设定', value: 'setting' },
  { label: '世界观', value: 'worldview' }
]

const swipeStartX = ref(0)
const swipeStartY = ref(0)
const swipeCurrentX = ref(0)
const swipeCurrentY = ref(0)
const isSwiping = ref(false)
const ignoreNextClick = ref(false)
const swipeThreshold = uni.upx2px(96)
let ignoreClickTimer: ReturnType<typeof setTimeout> | undefined

function handleClick(value: OcDetailTab) {
  if (ignoreNextClick.value) {
    ignoreNextClick.value = false
    return
  }

  emitTabChange(value)
}

function emitTabChange(value: OcDetailTab) {
  if (value === props.modelValue) return
  emit('update:modelValue', value)
  emit('change', value)
}

function handleSwipeStart(event: SwipeTouchEvent) {
  const point = getTouchPoint(event)
  if (!point) return

  swipeStartX.value = point.x
  swipeStartY.value = point.y
  swipeCurrentX.value = point.x
  swipeCurrentY.value = point.y
  isSwiping.value = true
}

function handleSwipeMove(event: SwipeTouchEvent) {
  if (!isSwiping.value) return

  const point = getTouchPoint(event)
  if (!point) return

  swipeCurrentX.value = point.x
  swipeCurrentY.value = point.y
}

function handleSwipeEnd(event: SwipeTouchEvent) {
  if (!isSwiping.value) return

  const point = getTouchPoint(event)
  if (point) {
    swipeCurrentX.value = point.x
    swipeCurrentY.value = point.y
  }

  const deltaX = swipeCurrentX.value - swipeStartX.value
  const deltaY = swipeCurrentY.value - swipeStartY.value
  isSwiping.value = false

  // 只有明确的横向滑动才切换，避免和点击、上下滚动互相抢。
  if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return

  const nextTab = deltaX < 0 ? getNextTab(props.modelValue) : getPrevTab(props.modelValue)
  if (!nextTab) return

  ignoreNextClick.value = true
  clearIgnoreClickTimer()
  ignoreClickTimer = setTimeout(() => {
    ignoreNextClick.value = false
  }, 220)
  emitTabChange(nextTab)
}

function handleSwipeCancel() {
  isSwiping.value = false
}

function getNextTab(tab: OcDetailTab) {
  return tab === 'setting' ? 'worldview' : undefined
}

function getPrevTab(tab: OcDetailTab) {
  return tab === 'worldview' ? 'setting' : undefined
}

type SwipeTouchEvent = TouchEvent | TouchLikeEvent

interface TouchLikeEvent {
  touches?: Array<TouchPoint>
  changedTouches?: Array<TouchPoint>
}

interface TouchPoint {
  clientX?: number
  clientY?: number
  pageX?: number
  pageY?: number
}

function getTouchPoint(event: SwipeTouchEvent) {
  const touch = event.changedTouches?.[0] || event.touches?.[0]
  if (!touch) return undefined

  return {
    x: touch.clientX ?? touch.pageX ?? 0,
    y: touch.clientY ?? touch.pageY ?? 0
  }
}

function clearIgnoreClickTimer() {
  if (!ignoreClickTimer) return

  clearTimeout(ignoreClickTimer)
  ignoreClickTimer = undefined
}

onBeforeUnmount(() => {
  clearIgnoreClickTimer()
})
</script>

<style scoped lang="scss">
.oc-detail-tabs {
  height: 58rpx;
  padding: 0 40rpx;
  display: flex;
  align-items: center;
  gap: 37rpx;
  box-sizing: border-box;
}

.oc-detail-tabs__item {
  position: relative;
  color: #777;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 400;
}

.oc-detail-tabs__item--active {
  color: #333;
  font-weight: 500;
}

.oc-detail-tabs__item--active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -7rpx;
  width: 37rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: #ff667a;
  transform: translateX(-50%);
}
</style>
