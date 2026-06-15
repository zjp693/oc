import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

/**
 * 全屏文本编辑页的「键盘感知滚动」逻辑。
 *
 * 适用结构：外层 scroll-view 包 textarea（auto-height），
 *   adjust-position=false + 页面 softinputMode:adjustNothing（防顶飞）。
 *
 * 原理：键盘弹起时只加大 scroll-view 的 padding-bottom 腾出键盘高度（不动 height），
 *   再按「点击位置 + 键盘高度 + 当前滚动位置」精确把光标行滚到键盘正上方，
 *   不再瞎滚到底，长文本/短文本都正确。
 *
 * 用法：
 *   const kb = useKeyboardAwareScroll()
 *   <scroll-view :scroll-top="kb.scrollTop.value" :scroll-with-animation="kb.isScrollAnimating.value"
 *     :style="kb.bodyStyle.value" @scroll="kb.handleScroll" >
 *     <textarea @tap="kb.handleTap" @focus="kb.handleFocus" @blur="kb.handleBlur"
 *       @keyboardheightchange="kb.handleKeyboardHeightChange" />
 *   </scroll-view>
 */
export interface KeyboardAwareScrollOptions {
  /** 光标行距键盘的额外余量(px)，默认 30 */
  margin?: number
  /** 键盘弹起后执行滚动前的等待(ms)，给布局留出结算时间，默认 130 */
  revealDelay?: number
  /** scroll-view 底部为键盘额外预留的间距，默认 '24rpx' */
  bottomGap?: string
  /** 无键盘时 scroll-view 的 padding-bottom（给底部栏留位），默认 'calc(100rpx + env(safe-area-inset-bottom))' */
  restingPaddingBottom?: string
  /** blur 后延迟清零键盘高度(ms)，避免同页切换输入框时闪烁，默认 150 */
  blurResetDelay?: number
}

type KeyboardHeightEvent = {
  height?: number
  detail?: {
    height?: number
    duration?: number
  }
}
type TapLikeEvent = Event & {
  changedTouches?: Array<{
    pageY?: number
  }>
}
type ScrollEvent = Event & {
  detail?: {
    scrollTop?: number
  }
}

export function useKeyboardAwareScroll(options: KeyboardAwareScrollOptions = {}) {
  const margin = options.margin ?? 30
  const revealDelay = options.revealDelay ?? 130
  const bottomGap = options.bottomGap ?? '24rpx'
  const restingPaddingBottom =
    options.restingPaddingBottom ?? 'calc(100rpx + env(safe-area-inset-bottom))'
  const blurResetDelay = options.blurResetDelay ?? 150

  const keyboardHeight = ref(0)
  const scrollTop = ref(0)
  // scroll-view 当前真实滚动位置（@scroll 持续更新），用来在它基础上做相对滚动
  let currentScroll = 0
  // 最近一次点击的屏幕 Y 坐标，用来算「这一行该上滚多少才露在键盘上方」
  let lastTapY = 0
  let blurTimer: ReturnType<typeof setTimeout> | null = null

  // 键盘弹起时只加大 padding-bottom 给键盘腾位置（不动高度），光标可见交给手动 scrollTop。
  const bodyStyle = computed(() => ({
    paddingBottom:
      keyboardHeight.value > 0
        ? `calc(${bottomGap} + ${keyboardHeight.value}px)`
        : restingPaddingBottom
  }))
  const isScrollAnimating = computed(() => keyboardHeight.value > 0)

  function handleScroll(event: ScrollEvent) {
    // 持续记录 scroll-view 的真实滚动位置，作为后续相对滚动的基准
    currentScroll = event.detail?.scrollTop ?? currentScroll
  }

  function handleTap(event: TapLikeEvent) {
    // 记录这次点击的屏幕 Y 坐标，键盘弹起后据此精确滚动
    lastTapY = event.changedTouches?.[0]?.pageY ?? 0
  }

  // 把「点击所在那一行」精确滚到键盘正上方：不再瞎滚到底。
  // 该上滚量 = 点击 Y 坐标 - 键盘顶部 Y 坐标 + 余量；在当前滚动位置上叠加。
  function revealCaretAboveKeyboard() {
    const kbHeight = keyboardHeight.value
    if (kbHeight <= 0 || lastTapY <= 0) return

    const windowHeight = uni.getSystemInfoSync().windowHeight || 0
    if (!windowHeight) return

    const keyboardTopY = windowHeight - kbHeight
    const overlap = lastTapY + margin - keyboardTopY

    // 点击位置没被键盘挡住，不用滚
    if (overlap <= 0) return

    nextTick(() => {
      setTimeout(() => {
        scrollTop.value = Math.max(0, Math.round(currentScroll + overlap))
      }, revealDelay)
    })
  }

  function handleKeyboardHeightChange(event: KeyboardHeightEvent) {
    // textarea 的 @keyboardheightchange 事件比全局 API 更可靠；detail.height 为 0 表示键盘收起
    const newHeight = Math.max(0, Math.round(event.detail?.height ?? event.height ?? 0))
    if (blurTimer) {
      clearTimeout(blurTimer)
      blurTimer = null
    }
    keyboardHeight.value = newHeight
    if (newHeight > 0) revealCaretAboveKeyboard()
  }

  function handleFocus() {
    // focus 时清除可能存在的收键盘延迟
    if (blurTimer) {
      clearTimeout(blurTimer)
      blurTimer = null
    }
    if (keyboardHeight.value > 0) revealCaretAboveKeyboard()
  }

  function handleBlur() {
    // blur 后延迟清零，避免在同页面内切换输入框时闪烁
    if (blurTimer) clearTimeout(blurTimer)
    blurTimer = setTimeout(() => {
      keyboardHeight.value = 0
      blurTimer = null
    }, blurResetDelay)
  }

  onBeforeUnmount(() => {
    if (blurTimer) clearTimeout(blurTimer)
  })

  return {
    keyboardHeight,
    scrollTop,
    bodyStyle,
    isScrollAnimating,
    handleScroll,
    handleTap,
    handleFocus,
    handleBlur,
    handleKeyboardHeightChange,
    revealCaretAboveKeyboard
  }
}
