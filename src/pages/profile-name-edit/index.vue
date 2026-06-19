<template>
  <view class="profile-name-edit">
    <AppTopBar
      title="名字"
      action-text="保存"
      inline-padding="30rpx"
      title-stars-src="/static/home/avatar-title-stars.png"
      @action="handleSave"
    />

    <view class="profile-name-edit__body">
      <view class="profile-name-edit__field">
        <input
          class="profile-name-edit__input"
          :value="name"
          placeholder="请输入"
          placeholder-class="profile-name-edit__placeholder"
          :maxlength="MAX_NAME_LENGTH"
          :adjust-position="true"
          :cursor-spacing="24"
          @input="handleInput"
        />
        <text class="profile-name-edit__count">{{ name.length }}/{{ MAX_NAME_LENGTH }}</text>
      </view>
    </view>

    <view class="profile-name-edit__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'

interface EventChannelLike {
  emit(event: 'submit', payload: { name: string }): void
}

type PageQuery = Record<string, string | string[] | undefined>

const MAX_NAME_LENGTH = 8
const name = ref('')
let eventChannel: EventChannelLike | null = null

function getEventChannel() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as unknown as {
    getOpenerEventChannel?: () => EventChannelLike
  }

  return currentPage.getOpenerEventChannel?.() ?? null
}

function getQueryValue(query: PageQuery | undefined, key: string) {
  const value = query?.[key]
  const rawValue = Array.isArray(value) ? value[0] : value
  if (!rawValue) return ''

  try {
    return decodeURIComponent(rawValue)
  } catch {
    return rawValue
  }
}

onLoad((query) => {
  name.value = getQueryValue(query as PageQuery, 'name').slice(0, MAX_NAME_LENGTH)
  eventChannel = getEventChannel()
})

function handleInput(event: Event) {
  name.value = ((event as unknown as { detail?: { value?: string } }).detail?.value ?? '').slice(0, MAX_NAME_LENGTH)
}

function handleSave() {
  eventChannel?.emit('submit', {
    name: name.value
  })
  uni.navigateBack()
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.profile-name-edit {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.profile-name-edit__body {
  flex: 1;
  min-height: 0;
  padding: 34rpx 30rpx calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.profile-name-edit__field {
  height: 70rpx;
  border-bottom: 1rpx solid rgba(51, 51, 51, 0.42);
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.profile-name-edit__input {
  flex: 1;
  min-width: 0;
  height: 70rpx;
  color: #333333;
  font-size: 30rpx;
  line-height: 70rpx;
}

.profile-name-edit__placeholder {
  color: #8d969d;
  font-size: 30rpx;
}

.profile-name-edit__count {
  flex: 0 0 auto;
  color: #999999;
  font-size: 24rpx;
  line-height: 34rpx;
}

.profile-name-edit__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}
</style>
