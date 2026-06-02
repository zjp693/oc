<template>
  <view class="follow-page">
    <AppTopBar title="新的关注" inline-padding="30rpx" />

    <view class="follow-page__body">
      <scroll-view class="follow-page__scroll" scroll-y>
        <view class="follow-page__list">
          <view v-for="item in followItems" :key="item.id" class="follow-item">
            <view class="follow-item__avatar">
              <text class="follow-item__avatar-mark">▧</text>
            </view>

            <view class="follow-item__content">
              <text class="follow-item__name">{{ item.nickname }}</text>
              <text class="follow-item__date">{{ item.date }} 关注了你</text>
            </view>

            <button class="follow-item__button" hover-class="button-hover" @click="handleFollowBack(item.id)">
              回关
            </button>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="follow-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'

interface FollowItem {
  id: number
  nickname: string
  date: string
}

const followItems: FollowItem[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  nickname: '用户昵称昵称',
  date: '2024/12/12'
}))

function handleFollowBack(id: number) {
  // 回关状态后续接接口时再同步更新。
  console.log('follow back', id)
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.follow-page {
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

.follow-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 16rpx calc(118rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.follow-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.follow-page__list {
  display: flex;
  flex-direction: column;
  padding: 4rpx 0 18rpx;
  box-sizing: border-box;
}

.follow-item {
  min-height: 134rpx;
  padding: 18rpx 0;
  display: flex;
  align-items: center;
  gap: 18rpx;
  box-sizing: border-box;
}

.follow-item__avatar {
  flex: 0 0 104rpx;
  width: 105rpx;
  height: 105rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
}

.follow-item__avatar-mark {
  color: rgba(115, 138, 150, 0.82);
  font-size: 24rpx;
  line-height: 32rpx;
}

.follow-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.follow-item__name {
  color: #3b3b3b;
  font-size: 34rpx;
  line-height: 44rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-item__date {
  margin-top: 6rpx;
  color: #969696;
  font-size: 30rpx;
  line-height: 38rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-item__button {
  flex: 0 0 auto;
  margin: 0;
  padding: 0 34rpx;
  height: 60rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 26rpx;
  line-height: 60rpx;
  font-weight: 500;
  background: #ff667a;
}

.follow-item__button::after {
  border: 0;
}

.follow-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

.button-hover {
  opacity: 0.82;
}

</style>
