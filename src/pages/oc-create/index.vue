<template>
  <view class="oc-create-page">
    <view class="oc-create-page__header">
      <view class="oc-create-page__top">
        <view class="oc-create-page__brand">
          <image class="oc-create-page__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
          <text class="oc-create-page__title">创建OC</text>
        </view>

        <button class="oc-create-page__publish" hover-class="button-hover" @click="handlePublish">
          发布
        </button>
      </view>
    </view>

    <scroll-view class="oc-create-page__scroll" scroll-y>
      <view class="oc-create-page__content">
        <view class="oc-create-page__avatar" @click="handlePickAvatar">
          <wd-icon name="picture" size="28rpx" color="#8ca0aa" />
        </view>

        <view class="oc-create-section oc-create-section--basic">
          <view class="oc-create-section__head">
            <text class="oc-create-section__title">基础资料</text>
            <view class="oc-create-public" @click="isPublic = !isPublic">
              <image class="oc-create-public__icon" src="/static/oc/icon-help-outline.png" mode="aspectFit" />
              <text class="oc-create-public__text">公开</text>
              <view class="oc-create-switch" :class="{ 'oc-create-switch--active': isPublic }">
                <view class="oc-create-switch__dot"></view>
              </view>
            </view>
          </view>

          <view class="oc-create-card oc-create-card--basic">
            <view
              v-for="field in basicFields"
              :key="field.key"
              class="oc-create-row"
              :class="{ 'oc-create-row--muted': field.muted }"
              @click="handleFieldClick(field.label)"
            >
              <text class="oc-create-row__label">
                {{ field.label }}<text v-if="field.required" class="oc-create-row__required">*</text>
              </text>

              <view class="oc-create-row__main">
                <text class="oc-create-row__value">{{ field.value }}</text>
                <view v-if="field.key === 'background'" class="oc-create-row__image">
                  <wd-icon name="picture" size="24rpx" color="#8ca0aa" />
                </view>
                <wd-icon name="arrow-right" size="32rpx" color="#9a9a9a" />
              </view>
            </view>
          </view>
        </view>

        <view v-for="group in customGroups" :key="group.id" class="oc-create-custom">
          <view class="oc-create-custom__head">
            <view class="oc-create-custom__title-wrap" @click="handleEditGroup(group.id)">
              <text class="oc-create-custom__title">自定义属性</text>
              <wd-icon name="edit-1" size="29rpx" color="#8a8a8a" />
            </view>
            <view class="oc-create-custom__more" @click="handleGroupMore(group.id)">
              <wd-icon name="more" size="34rpx" color="#777777" />
            </view>
          </view>

          <view class="oc-create-card oc-create-card--custom">
            <view class="oc-create-custom-field oc-create-custom-field--placeholder">
              <text class="oc-create-custom-field__title">标题名称...</text>
              <text class="oc-create-custom-field__content">编辑内容...</text>
            </view>

            <view v-for="attr in group.attrs" :key="attr.id" class="oc-create-custom-field">
              <text class="oc-create-custom-field__title">{{ attr.title }}</text>
              <text class="oc-create-custom-field__content">{{ attr.content }}</text>
            </view>

            <button class="oc-create-card__add-attr" hover-class="button-hover" @click="handleAddAttr(group.id)">
              添加属性
            </button>
          </view>
        </view>

        <button class="oc-create-page__add-group" hover-class="button-hover" @click="handleAddGroup">
          新增自定义属性组
        </button>
      </view>
    </scroll-view>

    <view class="oc-create-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <view class="oc-create-page__bottom-more" @click="showMoreMenu = !showMoreMenu">
        <image class="oc-create-page__more-icon" src="/static/oc/icon-more-menu.png" mode="aspectFit" />
      </view>

      <view v-if="showMoreMenu" class="oc-create-more">
        <view class="oc-create-more__item" @click="handleSaveDraft">
          <wd-icon name="save" size="31rpx" color="#2694ff" />
          <text class="oc-create-more__text">保存至草稿箱</text>
        </view>
        <view class="oc-create-more__item oc-create-more__item--danger" @click="handleFreeOc">
          <wd-icon name="delete" size="31rpx" color="#ff667a" />
          <text class="oc-create-more__text">放生OC</text>
        </view>
      </view>
    </view>

    <view v-if="showPublicNotice" class="oc-create-notice">
      <view class="oc-create-notice__box">
        <text class="oc-create-notice__title">公开角色</text>
        <text class="oc-create-notice__body">
          角色被公开后，即视为你同意以下共识：
          1、其他用户可查看角色信息；
          2、其他用户可对角色进行对话；
          3、为保障其他用户权益，当角色被你放生后，已存在的对话不会被关闭，直至对话方主动关闭对话。
        </text>
        <view class="oc-create-notice__line"></view>
        <text class="oc-create-notice__note">
          注：其他用户仅能查看OC信息或与OC进行对话，无法对你的OC进行编辑和任何修改。
        </text>
        <button class="oc-create-notice__confirm" hover-class="button-hover" @click="handleAgreePublic">
          我已知晓
        </button>
      </view>
    </view>

    <OcConfirmDialog
      v-model="showFreeConfirm"
      content="确定放生当前OC吗？"
      @confirm="handleConfirmFree"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'

interface BasicField {
  key: string
  label: string
  value: string
  required?: boolean
  muted?: boolean
}

interface CustomAttr {
  id: number
  title: string
  content: string
}

interface CustomGroup {
  id: number
  attrs: CustomAttr[]
}

const isPublic = ref(true)
const showMoreMenu = ref(false)
const showFreeConfirm = ref(false)
const showPublicNotice = ref(false)
const nextGroupId = ref(1)
const nextAttrId = ref(1)
const customGroups = ref<CustomGroup[]>([])

const basicFields: BasicField[] = [
  { key: 'name', label: '名字', value: '海绵宝宝去抓水母啦', required: true },
  { key: 'gender', label: '性别', value: '海绵宝宝去抓水母啦' },
  { key: 'birthday', label: '生日', value: '海绵宝宝去抓水母啦' },
  { key: 'age', label: '年龄', value: '海绵宝宝去抓水母啦' },
  { key: 'race', label: '种族', value: '海绵宝宝去抓水母啦' },
  { key: 'job', label: '职业', value: '海绵宝宝去抓水母啦海绵宝宝去抓水母啦' },
  { key: 'intro', label: '概述', value: 'OC的简介或者OC爱说的一句话', muted: true },
  { key: 'secret', label: '秘密', value: 'OC的小秘密，不对外公示', muted: true },
  { key: 'background', label: '背景图', value: '' }
]

function handlePickAvatar() {
  uni.showToast({
    title: '头像上传待接入',
    icon: 'none'
  })
}

function handleFieldClick(label: string) {
  uni.showToast({
    title: `${label}编辑待接入`,
    icon: 'none'
  })
}

function handleAddGroup() {
  customGroups.value.push({
    id: nextGroupId.value++,
    attrs: []
  })
}

function handleAddAttr(groupId: number) {
  const group = customGroups.value.find((item) => item.id === groupId)
  if (!group) return

  group.attrs.push({
    id: nextAttrId.value++,
    title: '名称名称',
    content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
  })
}

function handleEditGroup(groupId: number) {
  uni.showToast({
    title: `编辑属性组${groupId}`,
    icon: 'none'
  })
}

function handleGroupMore(groupId: number) {
  uni.showToast({
    title: `属性组${groupId}更多操作`,
    icon: 'none'
  })
}

function handlePublish() {
  if (isPublic.value) {
    showPublicNotice.value = true
    return
  }

  uni.showToast({
    title: '已发布',
    icon: 'none'
  })
}

function handleAgreePublic() {
  showPublicNotice.value = false
  uni.showToast({
    title: '已发布',
    icon: 'none'
  })
}

function handleSaveDraft() {
  showMoreMenu.value = false
  uni.showToast({
    title: '已保存至草稿箱',
    icon: 'none'
  })
}

function handleFreeOc() {
  showMoreMenu.value = false
  showFreeConfirm.value = true
}

function handleConfirmFree() {
  uni.showToast({
    title: '已放生OC',
    icon: 'none'
  })
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.oc-create-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.oc-create-page__scroll {
  height: 100%;
}

.oc-create-page__header {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: 6;
  height: calc(var(--status-bar-height) + 187rpx);
  padding: calc(var(--status-bar-height) + 70rpx) 42rpx 0;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 93%, rgba(255, 255, 255, 0) 100%);
}

.oc-create-page__content {
  min-height: 100%;
  padding: calc(var(--status-bar-height) + 187rpx) 19rpx calc(150rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.oc-create-page__top {
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oc-create-page__brand {
  position: relative;
  min-width: 180rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
}

.oc-create-page__lingbao {
  position: absolute;
  left: -42rpx;
  top: -54rpx;
  z-index: 0;
  width: 104rpx;
  height: 142rpx;
  opacity: 0.9;
  pointer-events: none;
}

.oc-create-page__title {
  position: relative;
  z-index: 1;
  color: #ff667a;
  font-size: 34rpx;
  line-height: 48rpx;
  font-weight: 700;
}

.oc-create-page__title::after {
  content: "";
  position: absolute;
  left: calc(100% + 4rpx);
  top: 50%;
  width: 30rpx;
  height: 30rpx;
  transform: translateY(-42%);
  background-image: url('/static/home/avatar-title-stars.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.oc-create-page__publish {
  width: 119rpx;
  height: 67rpx;
  margin: 0;
  padding: 0;
  border-radius: 38rpx;
  color: #fff;
  font-size: 28rpx;
  line-height: 67rpx;
  font-weight: 700;
  background: #ff667a;
}

.oc-create-page__publish::after,
.oc-create-page__add-group::after,
.oc-create-card__add-attr::after,
.oc-create-notice__confirm::after {
  border: 0;
}

.oc-create-page__avatar {
  width: 188rpx;
  height: 188rpx;
  margin: 40rpx auto 51rpx;
  border: 5rpx solid rgba(255, 255, 255, 0.96);
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(217, 217, 217, 0.9);
}

.oc-create-section {
  margin-top: 0;
}

.oc-create-section--basic {
  margin-top: 0;
}

.oc-create-section__head,
.oc-create-custom__head {
  height: 82rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oc-create-section__title,
.oc-create-custom__title {
  color: #333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 500;
}

.oc-create-public {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.oc-create-public__icon {
  width: 27rpx;
  height: 27rpx;
}

.oc-create-public__text {
  color: #999;
  font-size: 26rpx;
  line-height: 36rpx;
}

.oc-create-switch {
  position: relative;
  width: 67rpx;
  height: 38rpx;
  border-radius: 20rpx;
  background: #d7d7d7;
}

.oc-create-switch__dot {
  position: absolute;
  left: 4rpx;
  top: 4rpx;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.18s ease;
}

.oc-create-switch--active {
  background: #ff667a;
}

.oc-create-switch--active .oc-create-switch__dot {
  transform: translateX(29rpx);
}

.oc-create-card {
  border-radius: 24rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.72);
}

.oc-create-card--basic {
  padding: 22rpx 17rpx 21rpx 34rpx;
}

.oc-create-row {
  min-height: 68rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.oc-create-row__label {
  flex: 0 0 96rpx;
  color: #9f9f9f;
  font-size: 30rpx;
  line-height: 42rpx;
}

.oc-create-row__required {
  color: #ff667a;
}

.oc-create-row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.oc-create-row__value {
  flex: 1;
  min-width: 0;
  color: #333;
  font-size: 30rpx;
  line-height: 42rpx;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.oc-create-row--muted .oc-create-row__value {
  color: #9f9f9f;
}

.oc-create-row__image {
  flex: 0 0 67rpx;
  width: 67rpx;
  height: 67rpx;
  margin-left: 12rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ececec;
}

.oc-create-custom {
  margin-top: 17rpx;
}

.oc-create-custom__head {
  padding: 0 10rpx 0 22rpx;
  box-sizing: border-box;
}

.oc-create-custom__title-wrap {
  display: flex;
  align-items: center;
  gap: 9rpx;
}

.oc-create-custom__more {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.oc-create-card--custom {
  min-height: 246rpx;
  padding: 31rpx 34rpx 0;
  overflow: hidden;
}

.oc-create-custom-field + .oc-create-custom-field {
  margin-top: 19rpx;
}

.oc-create-custom-field--placeholder .oc-create-custom-field__title {
  color: #aaa;
}

.oc-create-custom-field__title,
.oc-create-custom-field__content {
  display: block;
  font-size: 30rpx;
  line-height: 42rpx;
}

.oc-create-custom-field__title {
  color: #aaa;
}

.oc-create-custom-field__content {
  margin-top: 2rpx;
  color: #333;
}

.oc-create-card__add-attr {
  width: 220rpx;
  height: 76rpx;
  margin: 38rpx auto 0;
  padding: 0;
  color: #ff667a;
  font-size: 28rpx;
  line-height: 76rpx;
  font-weight: 700;
  background: transparent;
}

.oc-create-page__add-group {
  width: 100%;
  height: 112rpx;
  margin: 37rpx 0 0;
  padding: 0;
  border-radius: 24rpx;
  color: #ff667a;
  font-size: 28rpx;
  line-height: 112rpx;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.72);
}

.oc-create-page__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 112rpx;
}

.oc-create-page__bottom-more {
  position: absolute;
  right: 32rpx;
  bottom: 19rpx;
  z-index: 2;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.oc-create-page__more-icon {
  width: 41rpx;
  height: 41rpx;
}

.oc-create-more {
  position: absolute;
  right: 19rpx;
  bottom: 110rpx;
  z-index: 5;
  width: 244rpx;
  padding: 11rpx 0;
  border-radius: 14rpx;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.16);
}

.oc-create-more__item {
  height: 75rpx;
  padding: 0 27rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.oc-create-more__text {
  color: #333;
  font-size: 26rpx;
  line-height: 36rpx;
  font-weight: 700;
}

.oc-create-more__item--danger .oc-create-more__text {
  color: #ff667a;
}

.oc-create-notice {
  position: fixed;
  inset: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.oc-create-notice__box {
  width: 470rpx;
  min-height: 586rpx;
  padding: 38rpx 54rpx 48rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.oc-create-notice__title {
  color: #ff667a;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: 700;
}

.oc-create-notice__body,
.oc-create-notice__note {
  display: block;
  width: 100%;
  color: #333;
  font-size: 20rpx;
  line-height: 32rpx;
  white-space: pre-line;
}

.oc-create-notice__body {
  margin-top: 28rpx;
}

.oc-create-notice__line {
  width: 278rpx;
  height: 1rpx;
  margin: 20rpx 0;
  border-top: 1rpx dashed #cfcfcf;
}

.oc-create-notice__note {
  color: #777;
}

.oc-create-notice__confirm {
  width: 145rpx;
  height: 54rpx;
  margin: 33rpx 0 0;
  padding: 0;
  border-radius: 29rpx;
  color: #fff;
  font-size: 23rpx;
  line-height: 54rpx;
  font-weight: 700;
  background: #ff667a;
}

.button-hover {
  opacity: 0.82;
}
</style>
