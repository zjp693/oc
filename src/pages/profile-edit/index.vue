<template>
  <view class="profile-edit-page">
    <AppTopBar title="编辑资料" inline-padding="30rpx" title-stars-src="/static/home/avatar-title-stars.png" />

    <view class="profile-edit-page__body">
      <view class="profile-edit-page__avatar-wrap">
        <ProfileAvatar outer-size="190rpx" inner-size="162rpx" @click="handleAvatarClick" />
      </view>

      <ProfileSettingRow label="名字" :value="profileName" @click="handleNameClick" />
    </view>

    <view class="profile-edit-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import ProfileAvatar from '@/components/profile/ProfileAvatar.vue'
import ProfileSettingRow from '@/components/profile/ProfileSettingRow.vue'

interface NameEditSubmitPayload {
  name: string
}

const profileName = ref('名字名字名字名字名')

function handleAvatarClick() {
  uni.navigateTo({ url: '/pages/avatar/index' })
}

function handleNameClick() {
  uni.navigateTo({
    url: `/pages/profile-name-edit/index?name=${encodeURIComponent(profileName.value)}`,
    success(res) {
      res.eventChannel?.on('submit', (payload: NameEditSubmitPayload) => {
        profileName.value = payload.name
      })
    }
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.profile-edit-page {
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

.profile-edit-page__body {
  flex: 1;
  min-height: 0;
  padding: 20rpx 28rpx calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.profile-edit-page__avatar-wrap {
  margin-top: 24rpx;
  margin-bottom: 58rpx;
  display: flex;
  justify-content: center;
}

.profile-edit-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}
</style>
