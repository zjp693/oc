<template>
  <view class="phone-text-page">
    <AppTopBar :title="title" :inline-padding="inlinePadding" />

    <scroll-view class="phone-text-page__scroll" scroll-y>
      <view class="phone-text-list" :style="listStyle">
        <view v-for="item in list" :key="item.id" class="phone-text-card" :style="cardStyle" @click="handleOpen(item.id)">
          <text class="phone-text-card__title">{{ item.title }}</text>
          <text class="phone-text-card__content" :style="contentStyle">{{ item.content }}</text>
          <text class="phone-text-card__time">{{ item.timeLabel }}</text>
        </view>
      </view>
    </scroll-view>

    <view class="phone-text-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import { usePhoneTextRecords } from '@/composables/usePhoneTextRecords'
import type { PhoneTextKind } from '@/composables/usePhoneTextRecords'

const props = withDefaults(
  defineProps<{
    kind: PhoneTextKind
    title: string
    detailUrl: string
    inlinePadding?: string
    cardBackground?: string
    contentLineHeight?: string
  }>(),
  {
    inlinePadding: '30rpx',
    cardBackground: 'rgba(255, 255, 255, 0.82)',
    contentLineHeight: '38rpx'
  }
)

const { list } = usePhoneTextRecords(props.kind)

const listStyle = computed(() => ({
  paddingLeft: props.inlinePadding,
  paddingRight: props.inlinePadding
}))

const cardStyle = computed(() => ({
  background: props.cardBackground
}))

const contentStyle = computed(() => ({
  lineHeight: props.contentLineHeight
}))

function handleOpen(id: string) {
  uni.navigateTo({
    url: `${props.detailUrl}?id=${id}`
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.phone-text-page {
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

.phone-text-page__scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.phone-text-list {
  padding-top: 0;
  padding-bottom: 32rpx;
  box-sizing: border-box;
}

.phone-text-card {
  margin-bottom: 20rpx;
  padding: 22rpx 22rpx 18rpx;
  border-radius: 18rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.phone-text-card__title {
  color: #000000;
  font-size: 28rpx;
  line-height: 38rpx;
  font-weight: 500;
}

.phone-text-card__content {
  display: -webkit-box;
  margin-top: 4rpx;
  color: #000000;
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.phone-text-card__time {
  align-self: flex-end;
  margin-top: 2rpx;
  color: #000000;
  font-size: 24rpx;
  line-height: 32rpx;
}

.phone-text-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
}
</style>
