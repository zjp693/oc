<template>
  <view class="follow-friend-page">
    <AppTopBar
      v-model="keyword"
      variant="search"
      title="关注Ta"
      placeholder="对方昵称或ID"
      inline-padding="30rpx"
      @search="handleSearch"
    />

    <view class="follow-friend-page__body">
      <scroll-view class="follow-friend-page__scroll" scroll-y>
        <view class="follow-friend-page__list">
          <view v-for="item in filteredUsers" :key="item.id" class="follow-friend-item">
            <view class="follow-friend-item__avatar">
              <text class="follow-friend-item__avatar-mark">▧</text>
            </view>

            <view class="follow-friend-item__content">
              <text class="follow-friend-item__name">{{ item.nickname }}</text>
              <text class="follow-friend-item__intro">{{ item.intro }}</text>
            </view>

            <button class="follow-friend-item__button" hover-class="button-hover" @click="handleFollow(item.id)">
              关注
            </button>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="follow-friend-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'

interface FollowFriendItem {
  id: number
  nickname: string
  intro: string
}

const keyword = ref('')

const users: FollowFriendItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  nickname: '用户昵称昵称',
  intro: '个人简介简介简介简介简介简介...'
}))

const filteredUsers = computed(() => {
  const text = keyword.value.trim()
  if (!text) return users
  return users.filter((item) => item.nickname.includes(text))
})

function handleSearch() {
  // 当前先做本地筛选，后续接接口时在这里发起搜索。
}

function handleFollow(id: number) {
  console.log('follow friend', id)
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.follow-friend-page {
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

.follow-friend-page__body {
  flex: 1;
  min-height: 0;
  padding: 0 30rpx calc(118rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.follow-friend-page__scroll {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.follow-friend-page__list {
  display: flex;
  flex-direction: column;
  padding: 4rpx 0 18rpx;
  box-sizing: border-box;
}

.follow-friend-item {
  min-height: 134rpx;
  padding: 18rpx 0;
  display: flex;
  align-items: center;
  gap: 18rpx;
  box-sizing: border-box;
}

.follow-friend-item__avatar {
  flex: 0 0 104rpx;
  width: 105rpx;
  height: 105rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
}

.follow-friend-item__avatar-mark {
  color: rgba(115, 138, 150, 0.82);
  font-size: 24rpx;
  line-height: 32rpx;
}

.follow-friend-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.follow-friend-item__name {
  color: #3b3b3b;
  font-size: 34rpx;
  line-height: 44rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-friend-item__intro {
  margin-top: 6rpx;
  color: #969696;
  font-size: 30rpx;
  line-height: 38rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-friend-item__button {
  flex: 0 0 auto;
  height: 60rpx;
  margin: 0;
  padding: 0 34rpx;
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

.follow-friend-item__button::after {
  border: 0;
}

.follow-friend-page__bottom {
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
