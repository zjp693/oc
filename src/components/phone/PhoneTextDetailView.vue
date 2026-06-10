<template>
  <view class="phone-detail-page">
    <AppTopBar :title="record.title" :inline-padding="inlinePadding" />

    <scroll-view class="phone-detail-page__scroll" scroll-y>
      <view class="phone-detail-page__content" :style="contentWrapStyle">
        <view v-if="showMeta" class="phone-detail-page__meta">
          <image class="phone-detail-page__calendar" src="/static/phone/icon-calendar.png" mode="aspectFit" />
          <text>{{ record.dateLabel }}</text>
          <text>{{ record.weekday }}</text>
        </view>
        <text class="phone-detail-page__body">{{ record.content }}</text>
      </view>
    </scroll-view>

    <view class="phone-detail-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import { usePhoneTextRecords } from '@/composables/usePhoneTextRecords'
import type { PhoneTextKind } from '@/composables/usePhoneTextRecords'

const props = withDefaults(
  defineProps<{
    kind: PhoneTextKind
    fallbackId: string
    inlinePadding?: string
    showMeta?: boolean
  }>(),
  {
    inlinePadding: '30rpx',
    showMeta: false
  }
)

const activeId = ref(props.fallbackId)
const { getById } = usePhoneTextRecords(props.kind)
const record = computed(() => getById(activeId.value))

const contentWrapStyle = computed(() => ({
  paddingLeft: props.inlinePadding,
  paddingRight: props.inlinePadding
}))

onLoad((query) => {
  activeId.value = String(query?.id ?? props.fallbackId)
})

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.phone-detail-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.phone-detail-page__scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.phone-detail-page__content {
  padding-top: 0;
  padding-bottom: 36rpx;
  box-sizing: border-box;
}

.phone-detail-page__meta {
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #000000;
  font-size: 26rpx;
  line-height: 32rpx;
}

.phone-detail-page__calendar {
  width: 30rpx;
  height: 30rpx;
  flex: 0 0 30rpx;
}

.phone-detail-page__body {
  display: block;
  color: #000000;
  font-size: 30rpx;
  line-height: 42rpx;
}

.phone-detail-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
}
</style>
