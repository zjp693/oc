<template>
  <view class="phone-contact-add-page">
    <AppTopBar
      v-model="keyword"
      variant="search"
      title="添加联系人"
      placeholder="请输入"
      inline-padding="30rpx"
    />

    <scroll-view class="phone-contact-add-page__scroll" scroll-y>
      <view class="phone-contact-add-page__content">
        <view class="phone-contact-add-page__toolbar">
          <OcTabs v-model="activeTab" class="phone-contact-add-page__tabs" :tabs="tabs" inline-padding="0rpx" />
          <button
            class="phone-contact-add-page__submit"
            hover-class="button-hover"
            :disabled="selectedIds.length === 0"
            @click="handleAddSelected"
          >
            添加
          </button>
        </view>

        <view class="phone-contact-add-page__list">
          <view v-for="item in candidates" :key="item.id" class="phone-contact-add-row">
            <view class="phone-contact-add-row__avatar">
              <text class="phone-contact-add-row__avatar-mark">▧</text>
            </view>
            <text class="phone-contact-add-row__name">{{ item.name }}</text>
            <button class="phone-contact-add-row__select" hover-class="button-hover" @click="handleToggle(item.id)">
              <image
                class="phone-contact-add-row__select-icon"
                :src="selectedIds.includes(item.id) ? '/static/phone/icon-contact-check.png' : '/static/phone/icon-contact-unchecked.png'"
                mode="aspectFit"
              />
            </button>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="phone-contact-add-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcTabs from '@/components/oc/OcTabs.vue'
import { usePhoneContacts } from '@/composables/usePhoneContacts'

const keyword = ref('')
const activeTab = ref('all')
const selectedIds = ref<string[]>([])
const tabs = [{ label: '全部', value: 'all' }]
const { candidates, addContacts } = usePhoneContacts()

function handleToggle(id: string) {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((item) => item !== id)
    : [...selectedIds.value, id]
}

function handleAddSelected() {
  if (!selectedIds.value.length) return
  addContacts(selectedIds.value)
  selectedIds.value = []
  uni.showToast({
    title: '已添加',
    icon: 'none'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 450)
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.phone-contact-add-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.phone-contact-add-page__scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.phone-contact-add-page__content {
  padding: 0 30rpx 34rpx;
  box-sizing: border-box;
}

.phone-contact-add-page__toolbar {
  margin-top: 22rpx;
  margin-bottom: 28rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.phone-contact-add-page__tabs {
  flex: 1;
  min-width: 0;
}

.phone-contact-add-page__submit {
  margin: 0;
  padding: 4rpx 30rpx;
  border-radius: 10rpx;
  line-height: 1.6;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #ff6c7b;
  box-sizing: border-box;
  border-radius: 50rpx;
}

.phone-contact-add-page__submit::after {
  border: 0;
}

.phone-contact-add-page__submit[disabled] {
  color: rgba(255, 255, 255, 0.72);
  background: #f9b1ba;
}

.phone-contact-add-page__list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.phone-contact-add-row {
  min-height: 112rpx;
  padding: 0 22rpx;
  border-radius: 16rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 26rpx;
  background: rgba(255, 255, 255, 0.68);
}

.phone-contact-add-row__avatar {
  flex: 0 0 82rpx;
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
}

.phone-contact-add-row__avatar-mark {
  color: rgba(115, 138, 150, 0.82);
  font-size: 24rpx;
  line-height: 32rpx;
}

.phone-contact-add-row__name {
  flex: 1;
  min-width: 0;
  color: #333333;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-contact-add-row__select {
  flex: 0 0 45rpx;
  width: 45rpx;
  height: 45rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.phone-contact-add-row__select::after {
  border: 0;
}

.phone-contact-add-row__select-icon {
  width: 45rpx;
  height: 45rpx;
}

.phone-contact-add-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
}

.button-hover {
  opacity: 0.82;
}
</style>
