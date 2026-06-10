<template>
  <view class="phone-contact-page" @click="handlePageTap">
    <AppTopBar title="通讯录">
      <template #trailing>
        <view class="phone-contact-page__add-entry">
          <image
            class="phone-contact-page__add-icon"
            src="/static/phone/icon-help-outline.png"
            mode="aspectFit"
            @click.stop="handleHelpTap"
          />
          <button class="phone-contact-page__add-link" hover-class="button-hover" @click.stop="handleAddContact">
            <text class="phone-contact-page__add-text">添加联系</text>
          </button>
        </view>
      </template>
    </AppTopBar>

    <scroll-view class="phone-contact-page__scroll" scroll-y>
      <view class="phone-contact-page__list">
        <view v-for="group in groupedContacts" :key="group.letter" class="phone-contact-group">
          <text class="phone-contact-group__letter">{{ group.letter }}</text>

          <view
            v-for="item in group.items"
            :key="item.id"
            class="phone-contact-row"
            @longpress="handleContactLongPress(item.id)"
            @touchstart="handleTouchStart($event, item.id)"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd(item.id)"
            @touchcancel="handleTouchCancel"
          >
            <view class="phone-contact-row__content" @click.stop="handleContactClick(item.id)">
              <view class="phone-contact-row__avatar">
                <text class="phone-contact-row__avatar-mark">▧</text>
              </view>
              <text class="phone-contact-row__name">{{ item.name }}</text>
            </view>
            <button v-if="activeDeleteId === item.id" class="phone-contact-row__delete" hover-class="button-hover" @click.stop="handleDelete(item.id)">
              删除
            </button>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="phone-contact-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
    </view>

    <view v-if="showHelp" class="phone-contact-help" @click.stop="handleHelpClose">
      <view class="phone-contact-help__dialog" @click.stop>
        <text class="phone-contact-help__title">通讯录</text>
        <view class="phone-contact-help__body">
          <text>可以为TA添加其他的OC，即添加联系人：</text>
          <text>1、只能添加你所创建的OC；</text>
          <text>2、为TA添加联系人后，TA会“认识”联系人的设定及背景，在对话与朋友圈中，他们会相互提及对方；</text>
          <text>3、为一方添加联系人后，可同时在他们的通讯录中查看到对方，即双向添加联系人。</text>
        </view>
        <button class="phone-contact-help__confirm" hover-class="button-hover" @click.stop="handleHelpClose">我已知晓</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import { usePhoneContacts } from '@/composables/usePhoneContacts'

const { contacts, removeContact } = usePhoneContacts()
const activeDeleteId = ref<string | null>(null)
const showHelp = ref(false)
const touchState = ref({
  id: '',
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0
})

const groupedContacts = computed(() => {
  const groups = new Map<string, typeof contacts.value>()
  contacts.value.forEach((item) => {
    const items = groups.get(item.group) ?? []
    groups.set(item.group, [...items, item])
  })
  return Array.from(groups.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([letter, items]) => ({ letter, items }))
})

function handlePageTap() {
  activeDeleteId.value = null
}

function handleHelpTap() {
  activeDeleteId.value = null
  showHelp.value = true
}

function handleHelpClose() {
  showHelp.value = false
}

function handleContactClick(id: string) {
  if (activeDeleteId.value) {
    activeDeleteId.value = null
    return
  }
  uni.navigateTo({
    url: `/pages/oc-detail/index?id=${id}`
  })
}

function handleContactLongPress(id: string) {
  activeDeleteId.value = id
}

function getTouchPoint(event: TouchEvent) {
  return event.touches?.[0] ?? event.changedTouches?.[0]
}

function handleTouchStart(event: TouchEvent, id: string) {
  const touch = getTouchPoint(event)
  if (!touch) return
  touchState.value = {
    id,
    startX: touch.clientX,
    startY: touch.clientY,
    deltaX: 0,
    deltaY: 0
  }
}

function handleTouchMove(event: TouchEvent) {
  const touch = getTouchPoint(event)
  if (!touch || !touchState.value.id) return
  touchState.value = {
    ...touchState.value,
    deltaX: touch.clientX - touchState.value.startX,
    deltaY: touch.clientY - touchState.value.startY
  }
}

function handleTouchEnd(id: string) {
  const { deltaX, deltaY } = touchState.value
  const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 28
  if (isHorizontalSwipe) {
    activeDeleteId.value = deltaX < 0 ? id : null
  }
  touchState.value = {
    id: '',
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0
  }
}

function handleTouchCancel() {
  touchState.value = {
    id: '',
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0
  }
}

function handleDelete(id: string) {
  removeContact(id)
  activeDeleteId.value = null
  uni.showToast({
    title: '已删除',
    icon: 'none'
  })
}

function handleAddContact() {
  activeDeleteId.value = null
  uni.navigateTo({
    url: '/pages/phone-contact-add/index'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.phone-contact-page {
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

.phone-contact-page__add-entry {
  height: 58rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11rpx;
}

.phone-contact-page__add-link {
  height: 58rpx;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a9a9a;
  font-size: 28rpx;
  line-height: 34rpx;
  font-weight: 600;
  background: transparent;
}

.phone-contact-page__add-link::after {
  border: 0;
}

.phone-contact-page__add-icon {
  flex: 0 0 34rpx;
  width: 34rpx;
  height: 34rpx;
}

.phone-contact-page__add-text {
  display: inline-flex;
  align-items: center;
  height: 34rpx;
  line-height: 34rpx;
}

.phone-contact-page__scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.phone-contact-page__list {
  padding: 0 30rpx 34rpx;
  box-sizing: border-box;
}

.phone-contact-group {
  margin-bottom: 20rpx;
}

.phone-contact-group__letter {
  display: block;
  margin-bottom: 12rpx;
  color: #ff667a;
  font-size: 34rpx;
  line-height: 36rpx;
  font-weight: 600;
}

.phone-contact-row {
  position: relative;
  min-height: 112rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.phone-contact-row + .phone-contact-row {
  margin-top: 30rpx;
}

.phone-contact-row__content {
  position: relative;
  z-index: 1;
  min-height: 112rpx;
  display: flex;
  align-items: center;
  gap: 28rpx;
  box-sizing: border-box;
}

.phone-contact-row__avatar {
  width: 103rpx;
  height: 103rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e5e5;
}

.phone-contact-row__avatar-mark {
  color: rgba(115, 138, 150, 0.82);
  font-size: 24rpx;
  line-height: 32rpx;
}

.phone-contact-row__name {
  flex: 1;
  min-width: 0;
  color: #333333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phone-contact-row__delete {
  position: absolute;
  z-index: 2;
  right: 0;
  top: 50%;
  width: 127rpx;
  height: 60rpx;
  margin: 0;
  padding: 0;
  border-radius: 10rpx;
  color: #333333;
  font-size: 30rpx;
  line-height: 60rpx;
  background: rgba(255, 255, 255, 0.82);
  transform: translateY(-50%);
}

.phone-contact-row__delete::after {
  border: 0;
}

.phone-contact-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
}

.phone-contact-help {
  position: fixed;
  z-index: 30;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.phone-contact-help__dialog {
  width: 572rpx;
  min-height: 610rpx;
  padding: 54rpx 58rpx 52rpx;
  border-radius: 26rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
}

.phone-contact-help__title {
  color: #ff667a;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 600;
}

.phone-contact-help__body {
  width: 100%;
  margin-top: 34rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  color: #000000;
  font-size: 24rpx;
  line-height: 34rpx;
}

.phone-contact-help__confirm {
  width: 180rpx;
  height: 60rpx;
  margin: auto 0 0;
  padding: 0;
  border-radius: 30rpx;
  color: #ffffff;
  font-size: 24rpx;
  line-height: 60rpx;
  font-weight: 600;
  background: #ff667a;
}

.phone-contact-help__confirm::after {
  border: 0;
}

.button-hover {
  opacity: 0.82;
}
</style>
