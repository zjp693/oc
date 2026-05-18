<template>
  <view class="oc-create-page">
    <view v-if="editingField" class="oc-create-editor">
      <AppTopBar
        variant="editor"
        :title="editingField.label"
        action-text="提交"
        inline-padding="30rpx"
        @action="handleSubmitField"
      />

      <view class="oc-create-editor__field">
        <input
          class="oc-create-editor__input"
          v-model="editingValue"
          maxlength="15"
          placeholder="请输入"
          placeholder-class="oc-create-editor__placeholder"
        />
        <text class="oc-create-editor__count">{{ editingValue.length }}/15</text>
      </view>
    </view>

    <AppTopBar
      v-if="!editingField"
      variant="title-action"
      surface="fade"
      :title="pageTitle"
      action-text="发布"
      inline-padding="19rpx"
      @action="handlePublish"
    />

    <scroll-view v-if="!editingField" class="oc-create-page__scroll" scroll-y>
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
              :class="{
                'oc-create-row--muted': field.muted,
                'oc-create-row--background': field.key === 'background'
              }"
              @click="handleFieldClick(field)"
            >
              <text class="oc-create-row__label">
                {{ field.label }}<text v-if="field.required" class="oc-create-row__required">*</text>
              </text>

              <view class="oc-create-row__main">
                <text class="oc-create-row__value">{{ field.value }}</text>
                <view v-if="field.key === 'background'" class="oc-create-row__image">
                  <wd-icon name="picture" size="24rpx" color="#8ca0aa" />
                </view>
                <view class="oc-create-row__chevron" />
              </view>
            </view>
          </view>
        </view>

        <view v-for="group in customGroups" :key="group.id" class="oc-create-custom">
          <view class="oc-create-custom__head">
            <view class="oc-create-custom__title-wrap" @click="handleEditGroup(group.id)">
              <text class="oc-create-custom__title">自定义属性</text>
              <image class="oc-create-custom__edit-icon" src="/static/oc/icon-edit-outline.png" mode="aspectFit" />
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
      <view v-if="!editingField" class="oc-create-page__bottom-more" @click="showMoreMenu = !showMoreMenu">
        <image class="oc-create-page__more-icon" src="/static/oc/icon-more-menu.png" mode="aspectFit" />
      </view>

      <view v-if="!editingField && showMoreMenu" class="oc-create-more">
        <view class="oc-create-more__item" @click="handleSaveDraft">
          <wd-icon name="save" size="42rpx" color="#2694ff" />
          <text class="oc-create-more__text">保存至草稿箱</text>
        </view>
        <view class="oc-create-more__item oc-create-more__item--danger" @click="handleFreeOc">
          <wd-icon name="delete" size="42rpx" color="#ff667a" />
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
import AppTopBar from '@/components/common/AppTopBar.vue'
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
const pageTitle = '创建OC'
const showMoreMenu = ref(false)
const showFreeConfirm = ref(false)
const showPublicNotice = ref(false)
const nextGroupId = ref(1)
const nextAttrId = ref(1)
const customGroups = ref<CustomGroup[]>([])
const editingField = ref<BasicField | null>(null)
const editingValue = ref('')

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

function handleFieldClick(field: BasicField) {
  if (field.key === 'background') {
    uni.showToast({
      title: '背景图上传待接入',
      icon: 'none'
    })
    return
  }

  showMoreMenu.value = false
  editingField.value = field
  editingValue.value = field.muted ? '' : field.value
}

function handleSubmitField() {
  if (!editingField.value) return

  editingField.value.value = editingValue.value
  editingField.value.muted = editingValue.value.length === 0
  editingField.value = null
  editingValue.value = ''
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
  if (editingField.value) {
    editingField.value = null
    editingValue.value = ''
    return
  }

  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.oc-create-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.oc-create-page__scroll {
  flex: 1;
  min-height: 0;
}

.oc-create-page__content {
  // min-height: 100%;
  padding: 12rpx 19rpx calc(150rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.oc-create-page__add-group::after,
.oc-create-card__add-attr::after,
.oc-create-notice__confirm::after {
  border: 0;
}

.oc-create-editor {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(138rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.oc-create-editor__field {
  position: relative;
  height: 82rpx;
  margin: 16rpx 30rpx 0;
  border-bottom: 1rpx solid rgba(51, 51, 51, 0.2);
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.oc-create-editor__input {
  flex: 1;
  min-width: 0;
  height: 62rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 62rpx;
}

.oc-create-editor__placeholder {
  color: #9f9f9f;
  font-size: 30rpx;
}

.oc-create-editor__count {
  flex: 0 0 72rpx;
  color: #858585;
  font-size: 23rpx;
  line-height: 32rpx;
  text-align: right;
}

.oc-create-page__avatar {
  width: 188rpx;
  height: 188rpx;
  margin: 35rpx auto 51rpx;
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
  width: 34rpx;
  height: 34rpx;
}

.oc-create-public__text {
  color: #999;
  font-size: 30rpx;
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
  padding: 15rpx 17rpx 21rpx 34rpx;
}

.oc-create-row {
  min-height: 68rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.oc-create-row--background {
  margin-top: 36rpx;
}

.oc-create-row__label {
  flex: 0 0 96rpx;
  color: #9f9f9f;
  font-size: 34rpx;
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
  font-size: 34rpx;
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

.oc-create-row__chevron {
  flex: 0 0 34rpx;
  width: 34rpx;
  height: 34rpx;
  margin-left: 6rpx;
  position: relative;
  box-sizing: border-box;
}

.oc-create-row__chevron::before {
  content: '';
  position: absolute;
  top: 7rpx;
  left: 5rpx;
  width: 16rpx;
  height: 16rpx;
  border-top: 5rpx solid #979797;
  border-right: 5rpx solid #979797;
  transform: rotate(45deg);
  box-sizing: border-box;
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
  gap: 11rpx;
}

.oc-create-custom__edit-icon {
  flex: 0 0 34rpx;
  width: 34rpx;
  height: 34rpx;
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
  font-weight: 500;
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
  line-height: 119rpx;
  font-weight: 500;
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
  right: 0;
  bottom: 100rpx;
  z-index: 5;
  width: 396rpx;
  padding: 18rpx 0;
  border-radius: 26rpx;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.16);
}

.oc-create-more__item {
  position: relative;
  height: 100rpx;
  padding: 0 42rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 22rpx;
}

.oc-create-more__item:first-child::after {
  content: '';
  position: absolute;
  left: 101rpx;
  right: 38rpx;
  bottom: 0;
  height: 1rpx;
  background: #eeeeee;
}

.oc-create-more__text {
  color: #333;
  font-size: 34rpx;
  line-height: 48rpx;
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
