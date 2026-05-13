<template>
  <view class="app-tab-bar">
    <image class="app-tab-bar__bg" src="/static/tabbar/tabbar-bg.png" mode="scaleToFill" />
    <view class="app-tab-bar__items">
      <view
        v-for="item in items"
        :key="item.key"
        class="app-tab-bar__item"
        :class="{ 'app-tab-bar__item--active': item.key === modelValue }"
        @click="handleSelect(item.key)"
      >
        <image class="app-tab-bar__icon" :src="item.icon" mode="aspectFit" />
        <text class="app-tab-bar__label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
type TabKey = 'desktop' | 'chat' | 'message' | 'profile'

const props = withDefaults(
  defineProps<{
    modelValue?: TabKey
  }>(),
  {
    modelValue: 'desktop'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: TabKey): void
  (event: 'change', value: TabKey): void
}>()

const items: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: 'desktop', label: '桌面', icon: '/static/tabbar/home.png' },
  { key: 'chat', label: '对话', icon: '/static/tabbar/chat.png' },
  { key: 'message', label: '消息', icon: '/static/tabbar/message.png' },
  { key: 'profile', label: '主页', icon: '/static/tabbar/profile.png' }
]

function handleSelect(key: TabKey) {
  if (key === props.modelValue) return
  emit('update:modelValue', key)
  emit('change', key)
}
</script>

<style scoped lang="scss">
.app-tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: calc(112rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

.app-tab-bar__bg {
  position: absolute;
  inset: 0 0 env(safe-area-inset-bottom) 0;
  width: 100%;
  height: 112rpx;
}

.app-tab-bar__items {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 112rpx;
}

.app-tab-bar__item {
  flex: 1;
  min-width: 0;
  height: 112rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 18rpx;
  box-sizing: border-box;
  color: rgba(51, 51, 51, 1);
  opacity: 0.62;
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.app-tab-bar__icon {
  width: 48rpx;
  height: 48rpx;
}

.app-tab-bar__label {
  margin-top: 1rpx;
  color: rgba(51, 51, 51, 1);
  font-size: 22rpx;
  line-height: 32rpx;
  text-align: center;
}

.app-tab-bar__item--active {
  opacity: 1;
  transform: translateY(-2rpx);
}

.app-tab-bar__item--active .app-tab-bar__label {
  font-weight: 400;
}

@media screen and (min-width: 600px) {
  .app-tab-bar {
    left: 50%;
    right: auto;
    width: 402px;
    transform: translateX(-50%);
  }
}
</style>
