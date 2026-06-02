<template>
  <view class="worldview-create">
    <view v-if="editingField" class="worldview-create-editor">
      <AppTopBar
        variant="editor"
        :title="editingField.label"
        :action-tone="fieldActionTone"
        action-text="提交"
        inline-padding="30rpx"
        @action="handleSubmitField"
      />

      <view class="worldview-create-editor__field" :class="{ 'worldview-create-editor__field--textarea': editingField.multiline }">
        <textarea
          v-if="editingField.multiline"
          class="worldview-create-editor__input worldview-create-editor__input--textarea"
          v-model="editingValue"
          :maxlength="editingField.maxLength"
          placeholder="请输入"
          placeholder-class="worldview-create-editor__placeholder"
          :adjust-position="true"
          :cursor-spacing="24"
        />
        <input
          v-else
          class="worldview-create-editor__input"
          v-model="editingValue"
          :maxlength="editingField.maxLength"
          placeholder="请输入"
          placeholder-class="worldview-create-editor__placeholder"
          :adjust-position="true"
          :cursor-spacing="24"
        />
        <text class="worldview-create-editor__count">{{ editingValue.length }}/{{ editingField.maxLength }}</text>
      </view>
    </view>

    <AppTopBar
      v-if="!editingField"
      variant="title-action"
      surface="fade"
      :action-tone="actionTone"
      :title="pageTitle"
      :action-text="primaryActionText"
      @action="handlePrimaryAction"
    />

    <scroll-view
      v-if="!editingField"
      class="worldview-create__scroll"
      scroll-y
      :scroll-top="pageScrollTop"
      @scroll="handlePageScroll"
    >
      <view class="worldview-create__content">
        <view class="worldview-create__cover" @click="handleCoverPreview">
          <image
            v-if="displayCoverImage"
            class="worldview-create__cover-image"
            :src="displayCoverImage"
            mode="aspectFill"
          />
          <wd-icon v-else name="picture" size="30rpx" color="#8ca0aa" />

          <view class="worldview-create__cover-gradient">
            <image
              class="worldview-create__cover-gradient-image"
              src="/static/worldview/edit-worldview-gradient.png"
              mode="scaleToFill"
            />
            <view class="worldview-create-link__head">
              <view class="worldview-create-link__left">
                <text class="worldview-create-link__title">关联OC</text>
                <text class="worldview-create-link__hint">允许他人OC关联</text>
                <view
                  class="worldview-create-switch worldview-create-switch--soft"
                  :class="{ 'worldview-create-switch--active': allowOtherOc }"
                  @click.stop="toggleAllowOtherOc"
                >
                  <view class="worldview-create-switch__dot"></view>
                </view>
              </view>

              <view class="worldview-create-link__right">
                <image
                  class="worldview-create-link__help"
                  src="/static/oc/icon-help-outline.png"
                  mode="aspectFit"
                  @click.stop="handlePublicHelp"
                />
                <text class="worldview-create-link__public-text">公开</text>
                <view
                  class="worldview-create-switch"
                  :class="{ 'worldview-create-switch--active': isPublic }"
                  @click.stop="togglePublic"
                >
                  <view class="worldview-create-switch__dot"></view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="worldview-create-link">
          <WorldviewRoleRail :roles="linkedOcs" show-add @add="handleAddLinkedOc" />
        </view>

        <view class="worldview-create-section">
          <view class="worldview-create-section__head">
            <text class="worldview-create-section__title">基础资料</text>
          </view>

          <view class="worldview-create-card worldview-create-card--basic">
            <view
              v-for="field in basicFields"
              :key="field.key"
              class="worldview-create-row"
              :class="{ 'worldview-create-row--muted': field.muted }"
              @click="handleFieldClick(field)"
            >
              <text class="worldview-create-row__label">
                {{ field.label }}<text v-if="field.required" class="worldview-create-row__required">*</text>
              </text>
              <view class="worldview-create-row__main">
                <text class="worldview-create-row__value">{{ field.value }}</text>
                <view class="worldview-create-row__chevron" />
              </view>
            </view>
          </view>
        </view>

        <CustomAttrGroupsEditor v-model="customGroups" @toast="showToast" />
      </view>
    </scroll-view>

    <view
      v-if="showInteractionMask"
      class="worldview-create__interaction-mask"
      @tap.stop="handleInteractionMaskClick"
      @click.stop="handleInteractionMaskClick"
    ></view>

    <view class="worldview-create__bottom" :class="{ 'worldview-create__bottom--menu-open': showMoreMenu }">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <view v-if="showMoreMenu" class="worldview-create__menu-mask" @click.stop="closeMoreMenu"></view>
      <view v-if="!editingField" class="worldview-create__bottom-more" @click="showMoreMenu = !showMoreMenu">
        <image class="worldview-create__more-icon" src="/static/oc/icon-more-menu.png" mode="aspectFit" />
      </view>

      <view v-if="!editingField && showMoreMenu" class="worldview-create-more">
        <view v-if="!isEditMode" class="worldview-create-more__item" @click="handleSaveDraft">
          <image class="worldview-create-more__icon" src="/static/oc/icon-save-blue.png" mode="aspectFit" />
          <text class="worldview-create-more__text">保存至草稿箱</text>
        </view>
        <view class="worldview-create-more__item worldview-create-more__item--danger" @click="handleDeleteWorldview">
          <image class="worldview-create-more__icon" src="/static/oc/icon-delete-pink.png" mode="aspectFit" />
          <text class="worldview-create-more__text">删除世界观</text>
        </view>
      </view>
    </view>

    <view v-if="showPublicNotice" class="worldview-create-notice">
      <view class="worldview-create-notice__box">
        <text class="worldview-create-notice__title">公开世界观</text>
        <text class="worldview-create-notice__body">{{ publicNoticeBody }}</text>
        <view class="worldview-create-notice__line"></view>
        <text class="worldview-create-notice__note">{{ publicNoticeNote }}</text>
        <button class="worldview-create-notice__confirm" hover-class="button-hover" @click="handleAgreePublic">
          我已知晓
        </button>
      </view>
    </view>

    <view v-if="showDraftToast" class="worldview-create-draft-toast">
      <text class="worldview-create-draft-toast__text">{{ toastText }}</text>
    </view>

    <OcConfirmDialog
      v-model="showDeleteConfirm"
      content="确定删除当前世界观吗？"
      @confirm="handleConfirmDelete"
    />

    <OcConfirmDialog
      v-model="showLeaveConfirm"
      content="当前内容未保存，确认退出吗？"
      @confirm="handleConfirmLeave"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { onBackPress, onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import CustomAttrGroupsEditor from '@/components/common/CustomAttrGroupsEditor.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import WorldviewRoleRail from '@/components/worldview/WorldviewRoleRail.vue'
import { createInteractionGate, provideInteractionGate } from '@/composables/useInteractionGate'
import { useDirtyState } from '@/composables/useDirtyState'
import type { CustomGroup } from '@/types/custom-attrs'

interface BasicField {
  key: string
  label: string
  value: string
  required?: boolean
  muted?: boolean
  multiline?: boolean
  maxLength: number
}

interface LinkedOc {
  id: number
  avatarUrl: string
}

interface WorldviewEditPayload {
  id?: number
  title?: string
  intro?: string
  coverImageUrl?: string
  linkedOcs?: LinkedOc[]
  customGroups?: CustomGroup[]
  isPublic?: boolean
  allowOtherOc?: boolean
}

type EditingTarget = {
  label: string
  maxLength: number
  value: string
  field: BasicField
  multiline?: boolean
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

const WORLDVIEW_EDIT_STORAGE_KEY = 'worldview-edit-data'
const DEFAULT_COVER_IMAGE_URL = '/static/oc/detail-landscape.jpg'

const mode = ref<'create' | 'edit'>('create')
const isPublic = ref(true)
const allowOtherOc = ref(true)
const showMoreMenu = ref(false)
const showPublicNotice = ref(false)
const showDraftToast = ref(false)
const showDeleteConfirm = ref(false)
const showLeaveConfirm = ref(false)
const toastText = ref('已保存至草稿箱')
const coverImageUrl = ref('')
const linkedOcs = ref<LinkedOc[]>([])
const customGroups = ref<CustomGroup[]>([])
const editingField = ref<EditingTarget | null>(null)
const editingValue = ref('')
const pageScrollTop = ref(0)
const savedPageScrollTop = ref(0)
const isLeavingConfirmed = ref(false)
let draftToastTimer: ReturnType<typeof setTimeout> | undefined

const interactionGate = createInteractionGate()
provideInteractionGate(interactionGate)

interactionGate.register({
  key: 'worldview-create-more-menu',
  priority: 100,
  active: () => showMoreMenu.value,
  consume: () => {
    showMoreMenu.value = false
  }
})

const isEditMode = computed(() => mode.value === 'edit')
const pageTitle = computed(() => (isEditMode.value ? '编辑世界观' : '创建世界观'))
const primaryActionText = computed(() => (isEditMode.value ? '保存' : '发布'))
const displayCoverImage = computed(() => coverImageUrl.value || DEFAULT_COVER_IMAGE_URL)
const showInteractionMask = computed(() => interactionGate.hasActiveBlocker.value)

const publicNoticeBody =
  '世界观被公开后，即视为你同意以下共识：\n' +
  '1、其他用户可查看世界观信息；\n' +
  '2、其他用户可为世界观关联OC；\n' +
  '3、为保障其他用户权益，当世界观被你删除后，已存在的对话不会被关闭，直至对话方主动关闭对话。'
const publicNoticeNote =
  '注：其他用户仅能查看OC信息或与OC进行对话，无法对你的OC进行编辑和任何修改，角色的最终归属权永远是你。用户在平台上无法对他人OC的图片进行保存或截图。'

const basicFields = ref<BasicField[]>([
  { key: 'name', label: '名称', value: '海绵宝宝去抓水母啦', required: true, maxLength: 15 },
  { key: 'intro', label: '简介', value: '海绵宝宝去抓水母啦海绵宝宝去抓水母啦', muted: false, multiline: true, maxLength: 80 }
])

const formState = computed(() => ({
  isPublic: isPublic.value,
  allowOtherOc: allowOtherOc.value,
  coverImageUrl: coverImageUrl.value,
  linkedOcs: linkedOcs.value,
  basicFields: basicFields.value.map((field) => ({
    key: field.key,
    value: field.value,
    muted: Boolean(field.muted)
  })),
  customGroups: customGroups.value
}))

const { isDirty, canSubmit, actionTone, markClean } = useDirtyState(() => formState.value)
const {
  isDirty: isFieldDirty,
  canSubmit: canSubmitField,
  actionTone: fieldActionTone,
  markClean: markFieldClean
} = useDirtyState(() => ({
  value: editingValue.value
}))

onLoad((options?: PageOptions) => {
  mode.value = options?.mode === 'edit' ? 'edit' : 'create'

  if (isEditMode.value) {
    initEditForm()
  }

  nextTick(() => {
    markClean()
    markFieldClean()
  })
})

onBackPress(() => {
  if (isLeavingConfirmed.value) return false

  if (editingField.value) {
    if (isFieldDirty.value) {
      showLeaveConfirm.value = true
      return true
    }

    closeEditor()
    return true
  }

  if (!isDirty.value) return false

  showLeaveConfirm.value = true
  return true
})

function handlePageScroll(event: ScrollViewScrollEvent) {
  savedPageScrollTop.value = event.detail?.scrollTop ?? 0
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

function handleChooseCover() {
  chooseImage((imageUrl) => {
    coverImageUrl.value = imageUrl
  })
}

function handleCoverPreview() {
  if (!coverImageUrl.value) {
    handleChooseCover()
    return
  }

  uni.previewImage({
    current: coverImageUrl.value,
    urls: [coverImageUrl.value]
  })
}

function handleFieldClick(field: BasicField) {
  showMoreMenu.value = false
  pageScrollTop.value = savedPageScrollTop.value
  editingField.value = {
    label: field.label,
    maxLength: field.maxLength,
    value: field.muted ? '' : field.value,
    field,
    multiline: field.multiline
  }
  editingValue.value = field.muted ? '' : field.value
  markFieldClean()
}

function handleSubmitField() {
  if (!editingField.value) return
  if (!canSubmitField.value) return

  const target = editingField.value
  target.field.value = editingValue.value
  target.field.muted = editingValue.value.length === 0
  markFieldClean()
  closeEditor()
}

function closeEditor() {
  pageScrollTop.value = savedPageScrollTop.value
  editingField.value = null
  editingValue.value = ''
}

function toggleAllowOtherOc() {
  allowOtherOc.value = !allowOtherOc.value
}

function togglePublic() {
  isPublic.value = !isPublic.value
}

function handlePublicHelp() {
  showPublicNotice.value = true
}

function handleAddLinkedOc() {
  if (linkedOcs.value.length >= 12) {
    showToast('关联OC数量已达上限')
    return
  }

  uni.navigateTo({
    url: '/pages/oc-linked/index'
  })
}

function handlePrimaryAction() {
  if (!canSubmit.value) return

  markClean()

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
  markClean()
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

function handleDeleteWorldview() {
  showMoreMenu.value = false
  showDeleteConfirm.value = true
}

function handleConfirmDelete() {
  uni.showToast({
    title: '已删除世界观',
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
    if (isFieldDirty.value) {
      showLeaveConfirm.value = true
      return
    }

    closeEditor()
    return
  }

  if (isDirty.value) {
    showLeaveConfirm.value = true
    return
  }

  uni.navigateBack()
}

function handleConfirmLeave() {
  if (editingField.value) {
    closeEditor()
    return
  }

  isLeavingConfirmed.value = true
  uni.navigateBack()
}

onBeforeUnmount(() => {
  if (draftToastTimer) clearTimeout(draftToastTimer)
})

function initEditForm() {
  const payload = uni.getStorageSync(WORLDVIEW_EDIT_STORAGE_KEY) as WorldviewEditPayload | ''
  if (!payload) return

  coverImageUrl.value = payload.coverImageUrl || ''
  linkedOcs.value = payload.linkedOcs ? payload.linkedOcs.map((item) => ({ ...item })) : []
  customGroups.value = payload.customGroups
    ? payload.customGroups.map((group) => ({
        ...group,
        attrs: group.attrs.map((attr) => ({ ...attr }))
      }))
    : []
  isPublic.value = payload.isPublic ?? true
  allowOtherOc.value = payload.allowOtherOc ?? true

  setBasicFieldValue('name', payload.title || '')
  setBasicFieldValue('intro', payload.intro || '')
}

function setBasicFieldValue(key: string, value: string) {
  const field = basicFields.value.find((item) => item.key === key)
  if (!field) return

  field.value = value
  field.muted = value.length === 0
}
</script>

<style scoped lang="scss">
.worldview-create {
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

.worldview-create__scroll {
  flex: 1;
  min-height: 0;
}

.worldview-create__content {
  padding: 0rpx 19rpx calc(150rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.worldview-create-editor {
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

.worldview-create-editor__field {
  position: relative;
  height: 82rpx;
  margin: 16rpx 30rpx 0;
  // border-bottom: 1rpx solid rgba(51, 51, 51, 0.2);
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.worldview-create-editor__field--textarea {
  height: 260rpx;
  align-items: flex-start;
}

.worldview-create-editor__input {
  flex: 1;
  min-width: 0;
  height: 62rpx;
  color: #333;
  font-size: 30rpx;
  line-height: 62rpx;
}

.worldview-create-editor__input--textarea {
  height: 220rpx;
  padding-top: 14rpx;
  box-sizing: border-box;
  line-height: 42rpx;
}

.worldview-create-editor__placeholder {
  color: #9f9f9f;
  font-size: 30rpx;
}

.worldview-create-editor__count {
  flex: 0 0 104rpx;
  color: #858585;
  font-size: 23rpx;
  line-height: 32rpx;
  text-align: right;
}

.worldview-create__cover {
  position: relative;
  z-index: 1;
  width: calc(100% + 38rpx);
  height: 604rpx;
  margin: 4rpx -19rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.worldview-create__cover-image {
  width: 100%;
  height: 100%;
  display: block;
}

.worldview-create__cover-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 604rpx;
  padding: 0 38rpx 34rpx;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  overflow: visible;
}

.worldview-create__cover-gradient-image {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -286rpx;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.worldview-create-link {
  position: relative;
  z-index: 2;
  margin-top: 0;
}

.worldview-create-link__head {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
}

.worldview-create-link__left,
.worldview-create-link__right {
  min-width: 0;
  display: flex;
  align-items: center;
}

.worldview-create-link__title {
  color: #333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 500;
  white-space: nowrap;
}

.worldview-create-link__hint,
.worldview-create-link__public-text {
  margin-left: 8rpx;
  color: #999;
  font-size: 28rpx;
  line-height: 36rpx;
  white-space: nowrap;
}

.worldview-create-link__help {
  width: 34rpx;
  height: 34rpx;
  margin-right: 2rpx;
}

.worldview-create-switch {
  position: relative;
  flex: 0 0 67rpx;
  width: 67rpx;
  height: 38rpx;
  margin-left: 8rpx;
  border-radius: 20rpx;
  background: #d7d7d7;
}

.worldview-create-switch--soft.worldview-create-switch--active {
  background: #bde9fb;
}

.worldview-create-switch--active {
  background: #ff9bab;
}

.worldview-create-switch__dot {
  position: absolute;
  left: 4rpx;
  top: 4rpx;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.18s ease;
}

.worldview-create-switch--active .worldview-create-switch__dot {
  transform: translateX(29rpx);
}

.worldview-create-section {
  position: relative;
  z-index: 2;
  margin-top: 25rpx;
}

.worldview-create-section__head {
  height: 62rpx;
  display: flex;
  align-items: center;
}

.worldview-create-section__title {
  color: #333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 500;
}

.worldview-create-card {
  border-radius: 24rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.72);
}

.worldview-create-card--basic {
  padding: 15rpx 17rpx 21rpx 34rpx;
}

.worldview-create-row {
  min-height: 68rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.worldview-create-row__label {
  color: #9f9f9f;
  font-size: 34rpx;
  line-height: 42rpx;
}

.worldview-create-row__required {
  color: #ff667a;
}

.worldview-create-row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.worldview-create-row__value {
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

.worldview-create-row--muted .worldview-create-row__value {
  color: #9f9f9f;
}

.worldview-create-row__chevron {
  flex: 0 0 34rpx;
  width: 34rpx;
  height: 34rpx;
  margin-left: 6rpx;
  position: relative;
  box-sizing: border-box;
}

.worldview-create-row__chevron::before {
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

.worldview-create__bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 8;
  height: 100rpx;
}

.worldview-create__interaction-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: transparent;
}

.worldview-create__bottom--menu-open {
  z-index: 30;
}

.worldview-create__menu-mask {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: transparent;
}

.worldview-create__bottom-more {
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

.worldview-create__more-icon {
  width: 41rpx;
  height: 41rpx;
}

.worldview-create-more {
  position: absolute;
  right: 20rpx;
  bottom: 130rpx;
  z-index: 5;
  width: 320rpx;
  // padding: 18rpx 0;
  border-radius: 26rpx;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.16);
}

.worldview-create-more__item {
  position: relative;
  height: 100rpx;
  padding: 0 26rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 22rpx;
}

.worldview-create-more__item:first-child::after {
  content: '';
  position: absolute;
  left: 101rpx;
  right: 38rpx;
  bottom: 0;
  height: 1rpx;
  background: #eeeeee;
}

.worldview-create-more__icon {
  flex: 0 0 34rpx;
  width: 34rpx;
  height: 34rpx;
}

.worldview-create-more__text {
  color: #333;
  font-size: 34rpx;
  line-height: 48rpx;
  font-weight: 500;
}

.worldview-create-more__item--danger .worldview-create-more__text {
  color: #ff667a;
}

.worldview-create-draft-toast {
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

.worldview-create-draft-toast__text {
  color: #fff;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: 400;
  text-align: center;
}

.worldview-create-notice {
  position: fixed;
  inset: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.worldview-create-notice__box {
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

.worldview-create-notice__title {
  color: #ff667a;
  font-size: 34rpx;
  line-height: 48rpx;
  font-weight: 700;
}

.worldview-create-notice__body,
.worldview-create-notice__note {
  display: block;
  width: 100%;
  color: #333;
  font-size: 28rpx;
  line-height: 40rpx;
  text-align: left;
  white-space: pre-line;
}

.worldview-create-notice__body {
  margin-top: 28rpx;
}

.worldview-create-notice__line {
  width: 360rpx;
  height: 1rpx;
  margin: 38rpx 0 34rpx;
  border-top: 1rpx dashed #cfcfcf;
}

.worldview-create-notice__note {
  color: #6c6c6c;
  font-size: 24rpx;
  line-height: 34rpx;
}

.worldview-create-notice__confirm {
  width: 199rpx;
  height: 68rpx;
  margin: 42rpx 0 0;
  padding: 0;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26rpx;
  line-height: 1;
  font-weight: 700;
  text-align: center;
  background: #ff667a;
}

.worldview-create-notice__confirm::after {
  border: 0;
}

.button-hover {
  opacity: 0.82;
}

</style>
