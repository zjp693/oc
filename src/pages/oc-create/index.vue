<template>
  <view class="oc-create-page">
    <view v-if="editingField" class="oc-create-editor">
      <AppTopBar
        variant="editor"
        :title="editingField.label"
        action-text="保存"
        inline-padding="30rpx"
        @action="handleSubmitField"
      />

      <view class="oc-create-editor__field" :class="{ 'oc-create-editor__field--textarea': editingField.multiline }">
        <textarea
          v-if="editingField.multiline"
          class="oc-create-editor__input oc-create-editor__input--textarea"
          v-model="editingValue"
          :maxlength="editingField.maxLength"
          placeholder="请输入"
          placeholder-class="oc-create-editor__placeholder"
          :adjust-position="false"
          :cursor-spacing="24"
        />
        <input
          v-else
          class="oc-create-editor__input"
          v-model="editingValue"
          :maxlength="editingField.maxLength"
          placeholder="请输入"
          placeholder-class="oc-create-editor__placeholder"
          :adjust-position="false"
          :cursor-spacing="24"
        />
        <text class="oc-create-editor__count">{{ editingValue.length }}/{{ editingField.maxLength }}</text>
      </view>
    </view>

    <AppTopBar
      v-if="!editingField"
      variant="title-action"
      surface="fade"
      :title="pageTitle"
      :action-text="primaryActionText"
      inline-padding="30rpx"
      @action="handlePublish"
    />

    <scroll-view
      v-if="!editingField"
      class="oc-create-page__scroll"
      scroll-y
      :scroll-top="pageScrollTop"
      @scroll="handlePageScroll"
    >
      <view class="oc-create-page__content">
        <view class="oc-create-page__avatar" @click="handleAvatarPreview">
          <image
            v-if="avatarImageUrl"
            class="oc-create-page__avatar-image"
            :src="avatarImageUrl"
            mode="aspectFill"
          />
          <wd-icon v-else name="picture" size="28rpx" color="#8ca0aa" />
        </view>

        <view class="oc-create-section oc-create-section--basic">
          <view class="oc-create-section__head">
            <text class="oc-create-section__title">基础资料</text>
            <view class="oc-create-public">
              <image
                class="oc-create-public__icon"
                src="/static/oc/icon-help-outline.png"
                mode="aspectFit"
                @click.stop="handlePublicHelp"
              />
              <text class="oc-create-public__text">公开</text>
              <view class="oc-create-public__switch" @click.stop>
                <wd-switch
                  v-model="isPublic"
                  size="18px"
                  active-color="#ff6c7b"
                  inactive-color="#d8d8d8"
                />
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
                <view
                  v-if="field.key === 'background'"
                  class="oc-create-row__image"
                  @click.stop="handleBackgroundPreview"
                >
                  <image
                    v-if="backgroundImageUrl"
                    class="oc-create-row__preview"
                    :src="backgroundImageUrl"
                    mode="aspectFill"
                  />
                  <wd-icon v-else name="picture" size="24rpx" color="#8ca0aa" />
                </view>
                <view class="oc-create-row__chevron" />
              </view>
            </view>
          </view>
        </view>

        <CustomAttrGroupsEditor v-model="customGroups" @toast="showToast" />
      </view>
    </scroll-view>

    <view
      v-if="showInteractionMask"
      class="oc-create-page__interaction-mask"
      @tap.stop="handleInteractionMaskClick"
      @click.stop="handleInteractionMaskClick"
    ></view>

    <view class="oc-create-page__bottom" :class="{ 'oc-create-page__bottom--menu-open': showMoreMenu }">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <view v-if="showMoreMenu" class="oc-create-page__menu-mask" @click.stop="closeMoreMenu"></view>
      <view v-if="!editingField" class="oc-create-page__bottom-more" @click="showMoreMenu = !showMoreMenu">
        <image class="oc-create-page__more-icon" src="/static/oc/icon-more-menu.png" mode="aspectFit" />
      </view>

      <view v-if="!editingField && showMoreMenu" class="oc-create-more">
        <view v-if="!isEditMode" class="oc-create-more__item oc-create-more__item--draft" @click="handleSaveDraft">
          <image class="oc-create-more__icon" src="/static/oc/icon-save-blue.png" mode="aspectFit" />
          <text class="oc-create-more__text">保存至草稿箱</text>
        </view>
        <view class="oc-create-more__item oc-create-more__item--danger" @click="handleFreeOc">
          <image class="oc-create-more__icon" src="/static/oc/icon-delete-pink.png" mode="aspectFit" />
          <text class="oc-create-more__text">放生OC</text>
        </view>
      </view>
    </view>

    <view v-if="showPublicNotice" class="oc-create-notice">
      <view class="oc-create-notice__box">
        <text class="oc-create-notice__title">公开角色</text>
        <text class="oc-create-notice__body">{{ publicNoticeBody }}</text>
        <view class="oc-create-notice__line"></view>
        <text class="oc-create-notice__note">{{ publicNoticeNote }}</text>
        <button class="oc-create-notice__confirm" hover-class="button-hover" @click="handleAgreePublic">
          我已知晓
        </button>
      </view>
    </view>

    <view v-if="showDraftToast" class="oc-create-draft-toast">
      <text class="oc-create-draft-toast__text">{{ toastText }}</text>
    </view>

    <OcConfirmDialog
      v-model="showFreeConfirm"
      content="确定放生当前OC吗？"
      @confirm="handleConfirmFree"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import CustomAttrGroupsEditor from '@/components/common/CustomAttrGroupsEditor.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import { createInteractionGate, provideInteractionGate } from '@/composables/useInteractionGate'
import type { CustomGroup } from '@/types/custom-attrs'

interface BasicField {
  key: string
  label: string
  value: string
  required?: boolean
  muted?: boolean
}

type EditingTarget = { type: 'basic'; label: string; maxLength: number; value: string; field: BasicField; multiline?: boolean }

interface BasicTextEditSubmitPayload {
  content: string
}

type ScrollViewScrollEvent = Event & {
  detail?: {
    scrollTop?: number
  }
}

type PageOptions = {
  mode?: string
  id?: string
  draftId?: string
}

const mode = ref<'create' | 'edit'>('create')
const isPublic = ref(true)
const showMoreMenu = ref(false)
const showFreeConfirm = ref(false)
const showPublicNotice = ref(false)
const showDraftToast = ref(false)
const toastText = ref('已保存至草稿箱')
const publicNoticeBody =
  '角色被公开后，即视为你同意以下共识：\n' +
  '1、其他用户可查看角色信息；\n' +
  '2、其他用户可对角色进行对话；\n' +
  '3、为保障其他用户权益，当角色被你放生后，已存在的对话不会被关闭，直至对话方主动关闭对话。'
const publicNoticeNote =
  '注：其他用户仅能查看OC信息或与OC进行对话，无法对你的OC进行编辑和任何修改，角色的最终归属权永远是你。用户在平台上无法对他人OC的图片进行保存或截图。'
const customGroups = ref<CustomGroup[]>([])
const editingField = ref<EditingTarget | null>(null)
const editingValue = ref('')
const pageScrollTop = ref(0)
const savedPageScrollTop = ref(0)
const avatarImageUrl = ref('')
const backgroundImageUrl = ref('')
let draftToastTimer: ReturnType<typeof setTimeout> | undefined

const interactionGate = createInteractionGate()
provideInteractionGate(interactionGate)

interactionGate.register({
  key: 'oc-create-more-menu',
  priority: 100,
  active: () => showMoreMenu.value,
  consume: () => {
    showMoreMenu.value = false
  }
})

const showInteractionMask = computed(() => interactionGate.hasActiveBlocker.value)
const isEditMode = computed(() => mode.value === 'edit')
const pageTitle = computed(() => (isEditMode.value ? '编辑OC' : '创建OC'))
const primaryActionText = computed(() => (isEditMode.value ? '保存' : '发布'))

const basicFields = ref<BasicField[]>([
  { key: 'name', label: '名字', value: '海绵宝宝去抓水母啦', required: true },
  { key: 'gender', label: '性别', value: '海绵宝宝去抓水母啦' },
  { key: 'birthday', label: '生日', value: '海绵宝宝去抓水母啦' },
  { key: 'age', label: '年龄', value: '海绵宝宝去抓水母啦' },
  { key: 'race', label: '种族', value: '海绵宝宝去抓水母啦' },
  { key: 'job', label: '职业', value: '海绵宝宝去抓水母啦海绵宝宝去抓水母啦' },
  { key: 'intro', label: '概述', value: 'OC的简介或者OC爱说的一句话', muted: true },
  { key: 'secret', label: '秘密', value: 'OC的小秘密，不对外公示', muted: true },
  { key: 'background', label: '背景图', value: '' }
])

onLoad((options?: PageOptions) => {
  mode.value = options?.mode === 'edit' ? 'edit' : 'create'
})

function handlePageScroll(event: ScrollViewScrollEvent) {
  savedPageScrollTop.value = event.detail?.scrollTop ?? 0
}

function handleFieldClick(field: BasicField) {
  if (field.key === 'background') {
    handleChooseBackground()
    return
  }

  showMoreMenu.value = false

  if (field.key === 'intro' || field.key === 'secret') {
    openLongTextFieldEditor(field)
    return
  }

  editingField.value = {
    type: 'basic',
    label: field.label,
    maxLength: 15,
    value: field.muted ? '' : field.value,
    field
  }
  editingValue.value = field.muted ? '' : field.value
}

function openLongTextFieldEditor(field: BasicField) {
  const content = field.muted ? '' : field.value
  const query = [
    `title=${encodeURIComponent(field.label)}`,
    `content=${encodeURIComponent(content)}`,
    `placeholder=${encodeURIComponent(getLongTextFieldPlaceholder(field.key))}`
  ].join('&')

  uni.navigateTo({
    url: `/pages/oc-basic-text-edit/index?${query}`,
    success: (result) => {
      const eventChannel = result.eventChannel

      eventChannel.on('submit', (payload: BasicTextEditSubmitPayload) => {
        const nextContent = payload.content.trim()
        updateBasicField(field.key, {
          value: nextContent || getLongTextFieldPlaceholder(field.key),
          muted: nextContent.length === 0
        })
      })

      eventChannel.emit('init', {
        title: field.label,
        content,
        placeholder: getLongTextFieldPlaceholder(field.key)
      })
    }
  })
}

function getLongTextFieldPlaceholder(key: string) {
  if (key === 'intro') return 'OC的简介或者OC爱说的一句话'
  if (key === 'secret') return 'OC的小秘密，不对外公示'
  return ''
}

function updateBasicField(key: string, patch: Partial<BasicField>) {
  basicFields.value = basicFields.value.map((item) => (item.key === key ? { ...item, ...patch } : item))
}

function handlePublicHelp() {
  showPublicNotice.value = true
}

function chooseImage(onChoose: (imageUrl: string) => void) {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed', 'original'],
    sourceType: ['album', 'camera'],
    success: (result) => {
      const imageUrl = result.tempFilePaths?.[0]
      if (!imageUrl) return

      onChoose(imageUrl)
    },
    fail: (error) => {
      if ((error as { errMsg?: string }).errMsg?.includes('cancel')) return

      uni.showToast({
        title: '图片选择失败',
        icon: 'none'
      })
    }
  })
}

function handleBackgroundPreview() {
  if (!backgroundImageUrl.value) {
    handleChooseBackground()
    return
  }

  uni.previewImage({
    current: backgroundImageUrl.value,
    urls: [backgroundImageUrl.value]
  })
}

function handleSubmitField() {
  if (!editingField.value) return

  const target = editingField.value
  updateBasicField(target.field.key, {
    value: editingValue.value,
    muted: editingValue.value.length === 0
  })

  closeEditor()
}

function closeEditor() {
  pageScrollTop.value = savedPageScrollTop.value
  editingField.value = null
  editingValue.value = ''
}

function handleChooseAvatar() {
  chooseImage((imageUrl) => {
    avatarImageUrl.value = imageUrl
  })
}

function handleAvatarPreview() {
  if (!avatarImageUrl.value) {
    handleChooseAvatar()
    return
  }

  uni.previewImage({
    current: avatarImageUrl.value,
    urls: [avatarImageUrl.value]
  })
}

function handleChooseBackground() {
  chooseImage((imageUrl) => {
    backgroundImageUrl.value = imageUrl
    updateBasicField('background', {
      value: '已上传',
      muted: false
    })
  })
}

function handlePublish() {
  uni.showToast({
    title: isEditMode.value ? '已保存' : '已发布',
    icon: 'none'
  })

  if (isEditMode.value) {
    uni.navigateBack()
  }
}

function handleAgreePublic() {
  showPublicNotice.value = false
}

function handleSaveDraft() {
  if (isEditMode.value) return

  showMoreMenu.value = false
  showToast('已保存至草稿箱')
}

function showToast(text: string) {
  toastText.value = text
  showDraftToast.value = true

  if (draftToastTimer) clearTimeout(draftToastTimer)
  draftToastTimer = setTimeout(() => {
    showDraftToast.value = false
    draftToastTimer = undefined
  }, 1800)
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

function closeMoreMenu() {
  showMoreMenu.value = false
}

function handleInteractionMaskClick() {
  interactionGate.consume()
}

function handleBack() {
  if (editingField.value) {
    closeEditor()
    return
  }

  uni.navigateBack()
}

onBeforeUnmount(() => {
  if (draftToastTimer) clearTimeout(draftToastTimer)
})
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
  padding: 12rpx 30rpx calc(150rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

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

.oc-create-editor__field--textarea {
  height: 260rpx;
  align-items: flex-start;
}

.oc-create-editor__input {
  flex: 1;
  min-width: 0;
  height: 62rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 62rpx;
}

.oc-create-editor__input--textarea {
  height: 220rpx;
  padding-top: 14rpx;
  box-sizing: border-box;
  line-height: 42rpx;
}

.oc-create-editor__placeholder {
  color: #9f9f9f;
  font-size: 30rpx;
}

.oc-create-editor__count {
  flex: 0 0 104rpx;
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
  overflow: hidden;
}

.oc-create-page__avatar-image {
  width: 100%;
  height: 100%;
  display: block;
}

.oc-create-section {
  margin-top: 0;
}

.oc-create-section--basic {
  margin-top: 0;
}

.oc-create-section__head {
  height: 82rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.oc-create-section__title {
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

.oc-create-public__switch {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
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
  margin-top: 30rpx;
}

.oc-create-row--background .oc-create-row__image {
  transform: translateY(10rpx);
}

.oc-create-row--background .oc-create-row__chevron {
  transform: translateY(10rpx);
}

.oc-create-row__label {
  // flex: 0 0 96rpx;
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
  overflow: hidden;
}

.oc-create-row__preview {
  width: 100%;
  height: 100%;
  display: block;
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

.oc-create-page__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
}

.oc-create-page__interaction-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: transparent;
}

.oc-create-page__bottom--menu-open {
  z-index: 30;
}

.oc-create-page__menu-mask {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: transparent;
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
  right: 24rpx;
  bottom: 150rpx;
  z-index: 5;
  // width: 396rpx;
  padding: 18rpx 0;
  border-radius: 26rpx;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.16);
}

.oc-create-more__item {
  position: relative;
  // height: 100rpx;
  padding:  14rpx 34rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 22rpx;
}

.oc-create-more__item--draft::after {
  content: '';
  position: absolute;
  left: 101rpx;
  right: 38rpx;
  bottom: 0;
  height: 1rpx;
  background: #eeeeee;
}

.oc-create-more__icon {
  flex: 0 0 34rpx;
  width: 34rpx;
  height: 34rpx;
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

.oc-create-draft-toast {
  position: fixed;
  left: 50%;
  top: calc(var(--status-bar-height) + 104rpx);
  z-index: 40;
  width: 552rpx;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  transform: translateX(-50%);
  pointer-events: none;
}

.oc-create-draft-toast__text {
  color: #fff;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: 400;
  text-align: center;
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
  --notice-body-left: 72rpx;
  --notice-body-right: 60rpx;
  width: 660rpx;
  min-height: 656rpx;
  padding: 56rpx var(--notice-body-right) 48rpx var(--notice-body-left);
  border-radius: 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.oc-create-notice__title {
  color: #ff667a;
  font-size: 34rpx;
  line-height: 48rpx;
  font-weight: 700;
}

.oc-create-notice__body,
.oc-create-notice__note {
  display: block;
  width: 100%;
  color: #333;
  font-size: 28rpx;
  line-height: 40rpx;
  text-align: left;
  white-space: pre-line;
}

.oc-create-notice__body {
  margin-top: 28rpx;
}

.oc-create-notice__line {
  width: 360rpx;
  height: 1rpx;
  margin: 38rpx 0 34rpx;
  border-top: 1rpx dashed #cfcfcf;
}

.oc-create-notice__note {
  color: #6c6c6c;
  font-size: 24rpx;
  line-height: 34rpx;
}

.oc-create-notice__confirm {
  width: 199rpx;
  height: 68rpx;
  margin: 42rpx 0 0;
  padding: 0;
  border-radius: 30rpx;
  color: #fff;
  font-size: 26rpx;
  line-height: 60rpx;
  font-weight: 700;
  background: #ff667a;
}

.button-hover {
  opacity: 0.82;
}
</style>
