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

      <view class="oc-create-editor__field" :class="{ 'oc-create-editor__field--textarea': editingField.multiline }">
        <textarea
          v-if="editingField.multiline"
          class="oc-create-editor__input oc-create-editor__input--textarea"
          v-model="editingValue"
          :maxlength="editingField.maxLength"
          placeholder="请输入"
          placeholder-class="oc-create-editor__placeholder"
          :adjust-position="true"
          :cursor-spacing="24"
        />
        <input
          v-else
          class="oc-create-editor__input"
          v-model="editingValue"
          :maxlength="editingField.maxLength"
          placeholder="请输入"
          placeholder-class="oc-create-editor__placeholder"
          :adjust-position="true"
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
      action-text="发布"
      inline-padding="19rpx"
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
              <view
                class="oc-create-switch"
                :class="{ 'oc-create-switch--active': isPublic }"
                @click.stop="togglePublic"
              >
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

        <view v-for="group in customGroups" :key="group.id" class="oc-create-custom">
          <view class="oc-create-custom__head">
            <view class="oc-create-custom__title-wrap">
              <text class="oc-create-custom__title-measure">{{ group.title || DEFAULT_GROUP_TITLE }}</text>
              <input
                class="oc-create-custom__title"
                :value="group.title"
                maxlength="15"
                :adjust-position="true"
                :cursor-spacing="24"
                @input="handleInlineGroupTitleInput(group, $event)"
                @blur="normalizeInlineGroupTitle(group)"
              />
              <image class="oc-create-custom__edit-icon" src="/static/oc/icon-edit-outline.png" mode="aspectFit" />
            </view>
            <view class="oc-create-custom__more" @click="handleGroupMore(group.id)">
              <wd-icon name="more" size="34rpx" color="#777777" />
            </view>
          </view>

          <view class="oc-create-card oc-create-card--custom">
            <view
              v-for="attr in group.attrs"
              :key="attr.id"
              class="oc-create-custom-field"
              :class="{ 'oc-create-custom-field--placeholder': attr.placeholder }"
            >
              <text
                class="oc-create-custom-field__title"
                :class="{ 'oc-create-custom-field__placeholder-text': !attr.title }"
                @click.stop="handleEditAttrTitle(group.id, attr.id)"
              >
                {{ getAttrTitleText(attr) }}
              </text>
              <text
                class="oc-create-custom-field__content"
                :class="{ 'oc-create-custom-field__placeholder-text': !attr.content }"
                @click.stop="handleEditAttrContent(group.id, attr.id)"
              >
                {{ getAttrContentText(attr) }}
              </text>
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

    <OcActionSheet
      v-model="showGroupActionSheet"
      title="编辑属性组"
      :actions="groupActions"
      @select="handleGroupAction"
    />

    <view v-if="showGroupAttrPanel" class="oc-create-attr-panel" @tap="closeGroupAttrPanel" @click="closeGroupAttrPanel">
      <view
        class="oc-create-attr-panel__sheet"
        @tap.stop
        @click.stop
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
      >
        <text class="oc-create-attr-panel__title">{{ currentGroupTitle }}</text>
        <view class="oc-create-attr-panel__line"></view>

        <scroll-view
          class="oc-create-attr-panel__list"
          :scroll-y="draggingAttrId === null"
          @tap.stop="resetManagedAttrSwipe"
          @click.stop="resetManagedAttrSwipe"
          @touchstart.stop
          @touchmove.stop
          @touchend.stop
        >
          <view
            v-for="(item, index) in groupManageAttrs"
            :key="item.id"
            class="oc-create-attr-panel__item"
            :class="{
              'oc-create-attr-panel__item--dragging': draggingAttrId === item.id,
              'oc-create-attr-panel__item--delete-active': isManagedAttrDeleteVisible(item.id)
            }"
            :style="getManagedAttrItemStyle(item.id, index)"
            @tap.stop
            @click.stop
          >
            <button
              class="oc-create-attr-panel__delete"
              :class="{ 'oc-create-attr-panel__delete--active': isManagedAttrDeleteVisible(item.id) }"
              hover-class="button-hover"
              @tap.stop
              @click.stop="handleDeleteManagedAttr(item.id)"
            >
              删除
            </button>
            <view
              class="oc-create-attr-panel__item-main"
              :style="getManagedAttrMainStyle(item.id)"
              @tap.stop
              @click.stop
              @touchstart="handleManagedAttrTouchStart(item.id, index, $event)"
              @touchmove="handleManagedAttrTouchMove(item.id, $event)"
              @touchend="handleManagedAttrTouchEnd(item.id, $event)"
              @touchcancel="handleManagedAttrTouchEnd(item.id, $event)"
            >
              <text
                class="oc-create-attr-panel__text"
                :class="{ 'oc-create-attr-panel__text--placeholder': !item.title }"
              >
                {{ getManagedAttrTitleText(item) }}
              </text>
              <image
                class="oc-create-attr-panel__icon"
                :class="{ 'oc-create-attr-panel__icon--hidden': isManagedAttrDeleteVisible(item.id) }"
                src="/static/oc/icon-application-two.png"
                mode="aspectFit"
              />
            </view>
          </view>
          <view class="oc-create-attr-panel__blank" @tap.stop="resetManagedAttrSwipe" @click.stop="resetManagedAttrSwipe"></view>
        </scroll-view>
      </view>
    </view>

    <OcConfirmDialog
      v-model="showFreeConfirm"
      content="确定放生当前OC吗？"
      @confirm="handleConfirmFree"
    />

    <OcConfirmDialog
      v-model="showDeleteConfirm"
      :content="deleteConfirmContent"
      @confirm="handleConfirmDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import OcActionSheet, { type OcSheetAction } from '@/components/oc-detail/OcActionSheet.vue'
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
  placeholder?: boolean
}

interface CustomGroup {
  id: number
  title: string
  attrs: CustomAttr[]
}

type EditingTarget =
  | { type: 'basic'; label: string; maxLength: number; value: string; field: BasicField; multiline?: boolean }
  | { type: 'group'; label: string; maxLength: number; value: string; group: CustomGroup; multiline?: boolean }
  | { type: 'attr-title'; label: string; maxLength: number; value: string; attr: CustomAttr; multiline?: boolean }
  | { type: 'attr-content'; label: string; maxLength: number; value: string; attr: CustomAttr; multiline: boolean }

type TouchLikeEvent = TouchEvent | {
  touches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>
  changedTouches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>
}

type ScrollViewScrollEvent = Event & {
  detail?: {
    scrollTop?: number
  }
}

type InputLikeEvent = Event & {
  detail?: {
    value?: string
  }
}

interface AttrEditSubmitPayload {
  title: string
  content: string
}

type DeleteConfirmTarget =
  | { type: 'group'; groupId: number }
  | { type: 'attr'; attrId: number }

const DEFAULT_GROUP_TITLE = '自定义属性'
const DEFAULT_ATTR_TITLE = ''
const DEFAULT_ATTR_CONTENT = ''
const ATTR_TITLE_PLACEHOLDER = '请输入名称'
const ATTR_CONTENT_PLACEHOLDER = '请输入内容'

const isPublic = ref(true)
const pageTitle = '创建OC'
const showMoreMenu = ref(false)
const showFreeConfirm = ref(false)
const showPublicNotice = ref(false)
const showDraftToast = ref(false)
const toastText = ref('已保存至草稿箱')
const showGroupActionSheet = ref(false)
const showGroupAttrPanel = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmTarget = ref<DeleteConfirmTarget | null>(null)
const publicNoticeBody =
  '角色被公开后，即视为你同意以下共识：\n' +
  '1、其他用户可查看角色信息；\n' +
  '2、其他用户可对角色进行对话；\n' +
  '3、为保障其他用户权益，当角色被你放生后，已存在的对话不会被关闭，直至对话方主动关闭对话。'
const publicNoticeNote =
  '注：其他用户仅能查看OC信息或与OC进行对话，无法对你的OC进行编辑和任何修改，角色的最终归属权永远是你。用户在平台上无法对他人OC的图片进行保存或截图。'
const nextGroupId = ref(1)
const nextAttrId = ref(1)
const customGroups = ref<CustomGroup[]>([])
const editingField = ref<EditingTarget | null>(null)
const editingValue = ref('')
const pageScrollTop = ref(0)
const savedPageScrollTop = ref(0)
const avatarImageUrl = ref('')
const backgroundImageUrl = ref('')
const currentGroupId = ref<number | null>(null)
const swipingAttrId = ref<number | null>(null)
const openedAttrId = ref<number | null>(null)
const draggingAttrId = ref<number | null>(null)
const attrDropAnimating = ref(false)
const attrSilentReorder = ref(false)
const attrSwipeOffset = ref(0)
const attrTouchStartX = ref(0)
const attrTouchStartY = ref(0)
const attrDragOffsetY = ref(0)
const attrDragStartIndex = ref(-1)
const attrDragTargetIndex = ref(-1)
let attrLongPressTimer: ReturnType<typeof setTimeout> | undefined
let attrDropTimer: ReturnType<typeof setTimeout> | undefined
let attrSilentReorderTimer: ReturnType<typeof setTimeout> | undefined
let draftToastTimer: ReturnType<typeof setTimeout> | undefined

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

const groupActions: OcSheetAction[] = [
  {
    key: 'adjust',
    label: '调整/删除属性',
    icon: 'adjust',
    iconUrl: '/static/oc/icon-setting-config.png',
    iconSize: '48rpx'
  },
  {
    key: 'delete',
    label: '删除整个属性组',
    icon: 'delete',
    iconUrl: '/static/oc/icon-delete-pink.png',
    iconSize: '48rpx',
    tone: 'danger'
  }
]

const groupManageAttrs = computed(() => {
  const currentGroup = customGroups.value.find((item) => item.id === currentGroupId.value)
  if (!currentGroup) return []
  return currentGroup.attrs
})

const currentGroupTitle = computed(() => {
  const currentGroup = customGroups.value.find((item) => item.id === currentGroupId.value)
  return currentGroup?.title || DEFAULT_GROUP_TITLE
})

const deleteConfirmContent = computed(() => {
  if (deleteConfirmTarget.value?.type === 'group') return '确定删除当前整个属性组吗？'
  if (deleteConfirmTarget.value?.type === 'attr') return '确定删除当前属性吗？'
  return ''
})

function handlePageScroll(event: ScrollViewScrollEvent) {
  savedPageScrollTop.value = event.detail?.scrollTop ?? 0
}

function getInputValue(event: InputLikeEvent) {
  return event.detail?.value ?? ''
}

function handleFieldClick(field: BasicField) {
  if (field.key === 'background') {
    handleChooseBackground()
    return
  }

  showMoreMenu.value = false
  editingField.value = {
    type: 'basic',
    label: field.label,
    maxLength: 15,
    value: field.muted ? '' : field.value,
    field
  }
  editingValue.value = field.muted ? '' : field.value
}

function togglePublic() {
  isPublic.value = !isPublic.value
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
  const nextValue = editingValue.value.trim()

  if (target.type === 'basic') {
    target.field.value = editingValue.value
    target.field.muted = editingValue.value.length === 0
  } else if (target.type === 'group') {
    target.group.title = nextValue || DEFAULT_GROUP_TITLE
  } else if (target.type === 'attr-title') {
    target.attr.title = nextValue || DEFAULT_ATTR_TITLE
    updateAttrPlaceholder(target.attr)
  } else if (target.type === 'attr-content') {
    target.attr.content = nextValue || DEFAULT_ATTR_CONTENT
    updateAttrPlaceholder(target.attr)
  }

  closeEditor()
}

function handleAddGroup() {
  customGroups.value.push({
    id: nextGroupId.value++,
    title: DEFAULT_GROUP_TITLE,
    attrs: [
      {
        id: nextAttrId.value++,
        title: DEFAULT_ATTR_TITLE,
        content: DEFAULT_ATTR_CONTENT,
        placeholder: true
      }
    ]
  })
}

function handleAddAttr(groupId: number) {
  const group = customGroups.value.find((item) => item.id === groupId)
  if (!group) return

  group.attrs.push({
    id: nextAttrId.value++,
    title: DEFAULT_ATTR_TITLE,
    content: DEFAULT_ATTR_CONTENT,
    placeholder: true
  })
}

function getAttrTitleText(attr: CustomAttr) {
  return attr.title || ATTR_TITLE_PLACEHOLDER
}

function getAttrContentText(attr: CustomAttr) {
  return attr.content || ATTR_CONTENT_PLACEHOLDER
}

function getManagedAttrTitleText(attr: CustomAttr) {
  return attr.title || ATTR_TITLE_PLACEHOLDER
}

function handleInlineGroupTitleInput(group: CustomGroup, event: InputLikeEvent) {
  group.title = getInputValue(event)
}

function normalizeInlineGroupTitle(group: CustomGroup) {
  group.title = group.title.trim() || DEFAULT_GROUP_TITLE
}

function startEdit(target: EditingTarget) {
  pageScrollTop.value = savedPageScrollTop.value
  showMoreMenu.value = false
  showGroupActionSheet.value = false
  showGroupAttrPanel.value = false
  resetManagedAttrSwipe()
  editingField.value = target
  editingValue.value = target.value
}

function closeEditor() {
  pageScrollTop.value = savedPageScrollTop.value
  editingField.value = null
  editingValue.value = ''
}

function openAttrDetailEdit(group: CustomGroup, attr: CustomAttr) {
  pageScrollTop.value = savedPageScrollTop.value
  showMoreMenu.value = false
  showGroupActionSheet.value = false
  showGroupAttrPanel.value = false
  resetManagedAttrSwipe()

  uni.navigateTo({
    url: '/pages/oc-custom-attr-edit/index',
    success: (result) => {
      const eventChannel = result.eventChannel

      eventChannel.on('submit', (payload: AttrEditSubmitPayload) => {
        attr.title = payload.title.trim() || DEFAULT_ATTR_TITLE
        attr.content = payload.content.trim() || DEFAULT_ATTR_CONTENT
        updateAttrPlaceholder(attr)
      })

      eventChannel.emit('init', {
        groupTitle: group.title || DEFAULT_GROUP_TITLE,
        title: attr.title,
        content: attr.content
      })
    }
  })
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
    const backgroundField = basicFields.find((item) => item.key === 'background')
    if (backgroundField) {
      backgroundField.value = '已上传'
      backgroundField.muted = false
    }
  })
}

function findCustomAttr(groupId: number, attrId: number) {
  const group = customGroups.value.find((item) => item.id === groupId)
  return group?.attrs.find((item) => item.id === attrId) ?? null
}

function findCustomGroup(groupId: number) {
  return customGroups.value.find((item) => item.id === groupId) ?? null
}

function findCustomAttrById(attrId: number) {
  const group = customGroups.value.find((item) => item.id === currentGroupId.value)
  return group?.attrs.find((item) => item.id === attrId) ?? null
}

function handleEditAttrTitle(groupId: number, attrId: number) {
  const group = findCustomGroup(groupId)
  const attr = findCustomAttr(groupId, attrId)
  if (!group || !attr) return

  openAttrDetailEdit(group, attr)
}

function handleEditAttrContent(groupId: number, attrId: number) {
  const group = findCustomGroup(groupId)
  const attr = findCustomAttr(groupId, attrId)
  if (!group || !attr) return

  openAttrDetailEdit(group, attr)
}

function handleEditAttrTitleById(attrId: number) {
  const group = currentGroupId.value ? findCustomGroup(currentGroupId.value) : null
  const attr = findCustomAttrById(attrId)
  if (!group || !attr) return

  openAttrDetailEdit(group, attr)
}

function handleEditCurrentGroup() {
  if (!currentGroupId.value) return
  handleEditGroup(currentGroupId.value)
}

function updateAttrPlaceholder(attr: CustomAttr) {
  attr.placeholder = !attr.title && !attr.content
}

function handleEditGroup(groupId: number) {
  const group = customGroups.value.find((item) => item.id === groupId)
  if (!group) return

  startEdit({
    type: 'group',
    label: '编辑属性组',
    maxLength: 15,
    value: group.title,
    group
  })
}

function handleGroupMore(groupId: number) {
  currentGroupId.value = groupId
  showGroupActionSheet.value = true
}

function handleGroupAction(key: string) {
  if (!currentGroupId.value) return

  if (key === 'adjust') {
    resetManagedAttrSwipe()
    showGroupAttrPanel.value = true
    return
  }

  if (key === 'delete') {
    deleteConfirmTarget.value = { type: 'group', groupId: currentGroupId.value }
    showDeleteConfirm.value = true
  }
}

function getTouchX(event: TouchLikeEvent) {
  const touch = event.touches?.[0] || event.changedTouches?.[0]
  return touch?.clientX ?? touch?.pageX ?? 0
}

function getTouchY(event: TouchLikeEvent) {
  const touch = event.touches?.[0] || event.changedTouches?.[0]
  return touch?.clientY ?? touch?.pageY ?? 0
}

function getManagedAttrItemStyle(attrId: number, index: number) {
  if (draggingAttrId.value === attrId) {
    const transition = attrDropAnimating.value ? 'transform 0.18s ease' : 'none'
    return `transform: translate3d(0, ${attrDragOffsetY.value}px, 0); transition: ${transition}; z-index: 4;`
  }

  let dragOffset = 0
  if (draggingAttrId.value !== null && attrDragStartIndex.value >= 0 && attrDragTargetIndex.value >= 0) {
    const rowStep = uni.upx2px(120)
    if (attrDragStartIndex.value < attrDragTargetIndex.value && index > attrDragStartIndex.value && index <= attrDragTargetIndex.value) {
      dragOffset = -rowStep
    } else if (attrDragTargetIndex.value < attrDragStartIndex.value && index >= attrDragTargetIndex.value && index < attrDragStartIndex.value) {
      dragOffset = rowStep
    }
  }

  const transition = swipingAttrId.value === attrId || attrSilentReorder.value ? 'none' : 'transform 0.18s ease'

  return `transform: translate3d(0, ${dragOffset}px, 0); transition: ${transition};`
}

function getManagedAttrMainStyle(attrId: number) {
  const transition = swipingAttrId.value === attrId ? 'none' : 'padding-right 0.18s ease'
  const paddingRight = isManagedAttrDeleteVisible(attrId) ? '168rpx' : '31rpx'

  return `padding-right: ${paddingRight}; transition: ${transition};`
}

function isManagedAttrDeleteVisible(attrId: number) {
  return openedAttrId.value === attrId || (swipingAttrId.value === attrId && attrSwipeOffset.value < -2)
}

function handleManagedAttrTouchStart(attrId: number, index: number, event: TouchLikeEvent) {
  if (attrDropAnimating.value) return

  clearAttrLongPressTimer()
  swipingAttrId.value = attrId
  attrTouchStartX.value = getTouchX(event)
  attrTouchStartY.value = getTouchY(event)
  attrDragStartIndex.value = index
  attrDragTargetIndex.value = index
  attrDragOffsetY.value = 0
  attrSwipeOffset.value = openedAttrId.value === attrId ? -uni.upx2px(144) : 0

  if (openedAttrId.value !== attrId) openedAttrId.value = null

  attrLongPressTimer = setTimeout(() => {
    draggingAttrId.value = attrId
    swipingAttrId.value = null
    openedAttrId.value = null
    attrSwipeOffset.value = 0
  }, 450)
}

function handleManagedAttrTouchMove(attrId: number, event: TouchLikeEvent) {
  if (attrDropAnimating.value) return

  const deltaX = getTouchX(event) - attrTouchStartX.value
  const deltaY = getTouchY(event) - attrTouchStartY.value

  if (draggingAttrId.value === attrId) {
    const rowStep = uni.upx2px(120)
    const maxIndex = groupManageAttrs.value.length - 1
    const targetIndex = Math.max(0, Math.min(maxIndex, attrDragStartIndex.value + Math.round(deltaY / rowStep)))

    attrDragOffsetY.value = deltaY
    attrDragTargetIndex.value = targetIndex
    return
  }

  if (Math.abs(deltaY) > uni.upx2px(14) || Math.abs(deltaX) > uni.upx2px(14)) clearAttrLongPressTimer()
  if (swipingAttrId.value !== attrId || Math.abs(deltaY) > Math.abs(deltaX)) return

  const deleteWidth = uni.upx2px(144)
  attrSwipeOffset.value = Math.max(-deleteWidth, Math.min(0, deltaX))
}

function handleManagedAttrTouchEnd(attrId: number, event: TouchLikeEvent) {
  clearAttrLongPressTimer()

  if (draggingAttrId.value === attrId) {
    finishManagedAttrDrag()
    return
  }

  if (swipingAttrId.value !== attrId) return

  const deleteWidth = uni.upx2px(144)
  const deltaX = getTouchX(event) - attrTouchStartX.value
  openedAttrId.value = attrSwipeOffset.value <= -deleteWidth / 2 || deltaX <= -uni.upx2px(60) ? attrId : null
  swipingAttrId.value = null
  attrSwipeOffset.value = 0
}

function resetManagedAttrSwipe() {
  clearAttrLongPressTimer()
  swipingAttrId.value = null
  openedAttrId.value = null
  attrSwipeOffset.value = 0
  resetManagedAttrDrag()
}

function closeGroupAttrPanel() {
  showGroupAttrPanel.value = false
  resetManagedAttrSwipe()
}

function clearAttrLongPressTimer() {
  if (!attrLongPressTimer) return

  clearTimeout(attrLongPressTimer)
  attrLongPressTimer = undefined
}

function clearAttrDropTimer() {
  if (!attrDropTimer) return

  clearTimeout(attrDropTimer)
  attrDropTimer = undefined
}

function clearAttrSilentReorderTimer() {
  if (!attrSilentReorderTimer) return

  clearTimeout(attrSilentReorderTimer)
  attrSilentReorderTimer = undefined
}

function resetManagedAttrDrag() {
  clearAttrDropTimer()
  attrDropAnimating.value = false
  draggingAttrId.value = null
  attrDragOffsetY.value = 0
  attrDragStartIndex.value = -1
  attrDragTargetIndex.value = -1
}

function stopSilentReorderSoon() {
  clearAttrSilentReorderTimer()
  attrSilentReorderTimer = setTimeout(() => {
    attrSilentReorder.value = false
    attrSilentReorderTimer = undefined
  }, 50)
}

function finishManagedAttrDrag() {
  const rowStep = uni.upx2px(120)
  const startIndex = attrDragStartIndex.value
  const targetIndex = attrDragTargetIndex.value

  attrDropAnimating.value = true
  attrDragOffsetY.value = startIndex >= 0 && targetIndex >= 0 ? (targetIndex - startIndex) * rowStep : 0

  clearAttrDropTimer()
  attrDropTimer = setTimeout(() => {
    attrSilentReorder.value = true
    reorderManagedAttr()
    resetManagedAttrDrag()
    stopSilentReorderSoon()
  }, 180)
}

function reorderManagedAttr() {
  const currentGroup = customGroups.value.find((item) => item.id === currentGroupId.value)
  if (!currentGroup || attrDragStartIndex.value < 0 || attrDragTargetIndex.value < 0) return
  if (attrDragStartIndex.value === attrDragTargetIndex.value) return

  const attrs = [...currentGroup.attrs]
  const [draggedAttr] = attrs.splice(attrDragStartIndex.value, 1)
  if (!draggedAttr) return

  attrs.splice(attrDragTargetIndex.value, 0, draggedAttr)
  currentGroup.attrs = attrs
}

function handleDeleteManagedAttr(attrId: number) {
  const currentGroup = customGroups.value.find((item) => item.id === currentGroupId.value)
  if (!currentGroup) return

  if (groupManageAttrs.value.length <= 1) {
    resetManagedAttrSwipe()
    showToast('至少保留一个属性')
    return
  }

  deleteConfirmTarget.value = { type: 'attr', attrId }
  showDeleteConfirm.value = true
}

function handleConfirmDelete() {
  const target = deleteConfirmTarget.value
  if (!target) return

  if (target.type === 'group') {
    customGroups.value = customGroups.value.filter((item) => item.id !== target.groupId)
    if (currentGroupId.value === target.groupId) {
      currentGroupId.value = null
      showGroupAttrPanel.value = false
    }
  } else {
    const currentGroup = customGroups.value.find((item) => item.id === currentGroupId.value)
    if (currentGroup && currentGroup.attrs.length > 1) {
      currentGroup.attrs = currentGroup.attrs.filter((item) => item.id !== target.attrId)
    }
  }

  deleteConfirmTarget.value = null
  resetManagedAttrSwipe()
}

function handlePublish() {
  uni.showToast({
    title: '已发布',
    icon: 'none'
  })
}

function handleAgreePublic() {
  showPublicNotice.value = false
}

function handleSaveDraft() {
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

function handleBack() {
  if (editingField.value) {
    closeEditor()
    return
  }

  uni.navigateBack()
}

onBeforeUnmount(() => {
  if (draftToastTimer) clearTimeout(draftToastTimer)
  clearAttrLongPressTimer()
  clearAttrDropTimer()
  clearAttrSilentReorderTimer()
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

.oc-create-custom {
  margin-top: 17rpx;
}

.oc-create-custom__head {
  padding: 0 10rpx 0 22rpx;
  box-sizing: border-box;
}

.oc-create-custom__title-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: flex-end;
  gap: 11rpx;
  width: fit-content;
  max-width: calc(100% - 64rpx);
}

.oc-create-custom__title-measure {
  min-width: 1em;
  max-width: 360rpx;
  color: transparent;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

.oc-create-custom__title {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  max-width: 360rpx;
  height: 42rpx;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  background: transparent;
}

.oc-create-custom__edit-icon {
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

.oc-create-custom-field__content.oc-create-custom-field__placeholder-text {
  color: #aaa;
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

.oc-create-attr-panel {
  position: fixed;
  inset: 0;
  z-index: 32;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.5);
}

.oc-create-attr-panel__sheet {
  width: 100%;
  height: 804rpx;
  padding: 36rpx 28rpx calc(24rpx + env(safe-area-inset-bottom));
  border-radius: 24rpx 24rpx 0 0;
  box-sizing: border-box;
  background: #f8f8f8;
}

.oc-create-attr-panel__title {
  display: block;
  color: #333;
  font-size: 32rpx;
  line-height: 44rpx;
  font-weight: 700;
  text-align: center;
}

.oc-create-attr-panel__line {
  width: 56rpx;
  height: 4rpx;
  margin: 8rpx auto 48rpx;
  background: #ff667a;
}

.oc-create-attr-panel__list {
  height: 624rpx;
}

.oc-create-attr-panel__item {
  position: relative;
  height: 88rpx;
  border-radius: 16rpx;
  background: transparent;
}

.oc-create-attr-panel__item--delete-active {
  background: transparent;
}

.oc-create-attr-panel__item:not(.oc-create-attr-panel__item--dragging) {
  overflow: hidden;
}

.oc-create-attr-panel__delete {
  position: absolute;
  top: 14rpx;
  right: 14rpx;
  z-index: 3;
  width: 124rpx;
  height: 64rpx;
  margin: 0;
  padding: 0;
  border-radius: 14rpx;
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  text-align: center;
  background: #ff667a;
  opacity: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.oc-create-attr-panel__delete--active {
  opacity: 1;
  pointer-events: auto;
}

.oc-create-attr-panel__delete::after {
  border: 0;
}

.oc-create-attr-panel__item-main {
  position: relative;
  z-index: 1;
  height: 89rpx;
  padding: 0 31rpx;
  border-radius: 16rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  will-change: padding-right;
}

.oc-create-attr-panel__item--dragging .oc-create-attr-panel__item-main {
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.12);
}

.oc-create-attr-panel__item + .oc-create-attr-panel__item {
  margin-top: 32rpx;
}

// .oc-create-attr-panel__blank {
//   height: 100%;
//   min-height: 220rpx;
// }

.oc-create-attr-panel__text {
  flex: 1;
  min-width: 0;
  color: #333;
  font-size: 30rpx;
  line-height: 44rpx;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.oc-create-attr-panel__text--placeholder {
  color: #aaa;
}

.oc-create-attr-panel__icon {
  flex: 0 0 40rpx;
  width: 40rpx;
  height: 40rpx;
  margin-left: 24rpx;
}

.oc-create-attr-panel__icon--hidden {
  opacity: 0;
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
