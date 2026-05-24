<template>
  <view class="custom-attrs">
    <view v-for="group in modelValue" :key="group.id" class="custom-attrs__group">
      <view class="custom-attrs__head">
        <view class="custom-attrs__title-wrap">
          <text class="custom-attrs__title-measure">{{ group.title || DEFAULT_GROUP_TITLE }}</text>
          <input
            class="custom-attrs__title"
            :value="group.title"
            maxlength="15"
            :focus="focusedGroupTitleId === group.id"
            :adjust-position="true"
            :cursor-spacing="24"
            @input="handleInlineGroupTitleInput(group.id, $event)"
            @blur="handleInlineGroupTitleBlur(group.id)"
          />
          <image
            class="custom-attrs__edit-icon"
            src="/static/oc/icon-edit-outline.png"
            mode="aspectFit"
            @click.stop="focusInlineGroupTitle(group.id)"
          />
        </view>
        <view class="custom-attrs__more" @click="handleGroupMore(group.id)">
          <wd-icon name="more" size="34rpx" color="#777777" />
        </view>
      </view>

      <view class="custom-attrs__card">
        <view
          v-for="attr in group.attrs"
          :key="attr.id"
          class="custom-attrs__field"
          :class="{ 'custom-attrs__field--placeholder': attr.placeholder }"
        >
          <text
            class="custom-attrs__field-title"
            :class="{ 'custom-attrs__placeholder-text': !attr.title }"
            @click.stop="handleEditAttr(group.id, attr.id)"
          >
            {{ getAttrTitleText(attr) }}
          </text>
          <text
            class="custom-attrs__field-content"
            :class="{ 'custom-attrs__placeholder-text': !attr.content }"
            @click.stop="handleEditAttr(group.id, attr.id)"
          >
            {{ getAttrContentText(attr) }}
          </text>
        </view>

        <button class="custom-attrs__add-attr" hover-class="button-hover" @click="handleAddAttr(group.id)">
          添加属性
        </button>
      </view>
    </view>

    <button class="custom-attrs__add-group" hover-class="button-hover" @click="handleAddGroup">
      新增自定义属性组
    </button>

    <OcActionSheet
      v-model="showGroupActionSheet"
      title="编辑属性组"
      :actions="groupActions"
      @select="handleGroupAction"
    />

    <view v-if="showGroupAttrPanel" class="custom-attrs-panel" @tap="closeGroupAttrPanel" @click="closeGroupAttrPanel">
      <view
        class="custom-attrs-panel__sheet"
        @tap.stop
        @click.stop
        @touchstart.stop
        @touchmove.stop
        @touchend.stop
      >
        <text class="custom-attrs-panel__title">{{ currentGroupTitle }}</text>
        <view class="custom-attrs-panel__line"></view>

        <scroll-view
          class="custom-attrs-panel__list"
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
            class="custom-attrs-panel__item"
            :class="{
              'custom-attrs-panel__item--dragging': draggingAttrId === item.id,
              'custom-attrs-panel__item--delete-active': isManagedAttrDeleteVisible(item.id)
            }"
            :style="getManagedAttrItemStyle(item.id, index)"
            @tap.stop
            @click.stop
          >
            <button
              class="custom-attrs-panel__delete"
              :class="{ 'custom-attrs-panel__delete--active': isManagedAttrDeleteVisible(item.id) }"
              hover-class="button-hover"
              @tap.stop
              @click.stop="handleDeleteManagedAttr(item.id)"
            >
              删除
            </button>
            <view
              class="custom-attrs-panel__item-main"
              :style="getManagedAttrMainStyle(item.id)"
              @tap.stop
              @click.stop
              @touchstart="handleManagedAttrTouchStart(item.id, index, $event)"
              @touchmove="handleManagedAttrTouchMove(item.id, $event)"
              @touchend="handleManagedAttrTouchEnd(item.id, $event)"
              @touchcancel="handleManagedAttrTouchEnd(item.id, $event)"
            >
              <text
                class="custom-attrs-panel__text"
                :class="{ 'custom-attrs-panel__text--placeholder': !item.title }"
              >
                {{ getManagedAttrTitleText(item) }}
              </text>
              <image
                class="custom-attrs-panel__icon"
                :class="{ 'custom-attrs-panel__icon--hidden': isManagedAttrDeleteVisible(item.id) }"
                src="/static/oc/icon-application-two.png"
                mode="aspectFit"
              />
            </view>
          </view>
          <view class="custom-attrs-panel__blank" @tap.stop="resetManagedAttrSwipe" @click.stop="resetManagedAttrSwipe"></view>
        </scroll-view>
      </view>
    </view>

    <OcConfirmDialog
      v-model="showDeleteConfirm"
      :content="deleteConfirmContent"
      @confirm="handleConfirmDelete"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import OcActionSheet, { type OcSheetAction } from '@/components/oc-detail/OcActionSheet.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'
import type { CustomAttr, CustomGroup } from '@/types/custom-attrs'

interface AttrEditSubmitPayload {
  title: string
  content: string
}

type DeleteConfirmTarget =
  | { type: 'group'; groupId: number }
  | { type: 'attr'; attrId: number }

type InputLikeEvent = Event & {
  detail?: {
    value?: string
  }
}

type TouchLikeEvent = TouchEvent | {
  touches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>
  changedTouches?: Array<{ clientX?: number; clientY?: number; pageX?: number; pageY?: number }>
}

const props = withDefaults(
  defineProps<{
    modelValue?: CustomGroup[]
  }>(),
  {
    modelValue: () => []
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: CustomGroup[]): void
  (event: 'toast', text: string): void
}>()

const DEFAULT_GROUP_TITLE = '自定义属性'
const DEFAULT_ATTR_TITLE = ''
const DEFAULT_ATTR_CONTENT = ''
const ATTR_TITLE_PLACEHOLDER = '标题名称...'
const ATTR_CONTENT_PLACEHOLDER = '编辑内容...'

const focusedGroupTitleId = ref<number | null>(null)
const showGroupActionSheet = ref(false)
const showGroupAttrPanel = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmTarget = ref<DeleteConfirmTarget | null>(null)
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
  const currentGroup = props.modelValue.find((item) => item.id === currentGroupId.value)
  if (!currentGroup) return []
  return currentGroup.attrs
})

const currentGroupTitle = computed(() => {
  const currentGroup = props.modelValue.find((item) => item.id === currentGroupId.value)
  return currentGroup?.title || DEFAULT_GROUP_TITLE
})

const deleteConfirmContent = computed(() => {
  if (deleteConfirmTarget.value?.type === 'group') return '确定删除当前整个属性组吗？'
  if (deleteConfirmTarget.value?.type === 'attr') return '确定删除当前属性吗？'
  return ''
})

function cloneGroups() {
  return props.modelValue.map((group) => ({
    ...group,
    attrs: group.attrs.map((attr) => ({ ...attr }))
  }))
}

function updateGroups(updater: (groups: CustomGroup[]) => void) {
  const nextGroups = cloneGroups()
  updater(nextGroups)
  emit('update:modelValue', nextGroups)
}

function getNextGroupId() {
  return props.modelValue.reduce((maxId, group) => Math.max(maxId, group.id), 0) + 1
}

function getNextAttrId() {
  return props.modelValue.reduce((maxId, group) => {
    const groupMaxId = group.attrs.reduce((attrMaxId, attr) => Math.max(attrMaxId, attr.id), 0)
    return Math.max(maxId, groupMaxId)
  }, 0) + 1
}

function getInputValue(event: InputLikeEvent) {
  return event.detail?.value ?? ''
}

function handleAddGroup() {
  updateGroups((groups) => {
    groups.push({
      id: getNextGroupId(),
      title: DEFAULT_GROUP_TITLE,
      attrs: [
        {
          id: getNextAttrId(),
          title: DEFAULT_ATTR_TITLE,
          content: DEFAULT_ATTR_CONTENT,
          placeholder: true
        }
      ]
    })
  })
}

function handleAddAttr(groupId: number) {
  updateGroups((groups) => {
    const group = groups.find((item) => item.id === groupId)
    if (!group) return

    group.attrs.push({
      id: getNextAttrId(),
      title: DEFAULT_ATTR_TITLE,
      content: DEFAULT_ATTR_CONTENT,
      placeholder: true
    })
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

function handleInlineGroupTitleInput(groupId: number, event: InputLikeEvent) {
  const value = getInputValue(event)
  updateGroups((groups) => {
    const group = groups.find((item) => item.id === groupId)
    if (group) group.title = value
  })
}

function normalizeInlineGroupTitle(groupId: number) {
  updateGroups((groups) => {
    const group = groups.find((item) => item.id === groupId)
    if (group) group.title = group.title.trim() || DEFAULT_GROUP_TITLE
  })
}

function handleInlineGroupTitleBlur(groupId: number) {
  normalizeInlineGroupTitle(groupId)
  focusedGroupTitleId.value = null
}

function focusInlineGroupTitle(groupId: number) {
  focusedGroupTitleId.value = null

  nextTick(() => {
    focusedGroupTitleId.value = groupId
  })
}

function findCustomGroup(groupId: number) {
  return props.modelValue.find((item) => item.id === groupId) ?? null
}

function findCustomAttr(groupId: number, attrId: number) {
  const group = findCustomGroup(groupId)
  return group?.attrs.find((item) => item.id === attrId) ?? null
}

function updateAttrPlaceholder(attr: CustomAttr) {
  attr.placeholder = !attr.title && !attr.content
}

function handleEditAttr(groupId: number, attrId: number) {
  const group = findCustomGroup(groupId)
  const attr = findCustomAttr(groupId, attrId)
  if (!group || !attr) return

  uni.navigateTo({
    url: '/pages/oc-custom-attr-edit/index',
    success: (result) => {
      const eventChannel = result.eventChannel

      eventChannel.on('submit', (payload: AttrEditSubmitPayload) => {
        updateGroups((groups) => {
          const currentGroup = groups.find((item) => item.id === groupId)
          const currentAttr = currentGroup?.attrs.find((item) => item.id === attrId)
          if (!currentAttr) return

          currentAttr.title = payload.title.trim() || DEFAULT_ATTR_TITLE
          currentAttr.content = payload.content.trim() || DEFAULT_ATTR_CONTENT
          updateAttrPlaceholder(currentAttr)
        })
      })

      eventChannel.emit('init', {
        groupTitle: group.title || DEFAULT_GROUP_TITLE,
        title: attr.title,
        content: attr.content
      })
    }
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
  const currentGroupIdValue = currentGroupId.value
  if (!currentGroupIdValue || attrDragStartIndex.value < 0 || attrDragTargetIndex.value < 0) return
  if (attrDragStartIndex.value === attrDragTargetIndex.value) return

  updateGroups((groups) => {
    const currentGroup = groups.find((item) => item.id === currentGroupIdValue)
    if (!currentGroup) return

    const [draggedAttr] = currentGroup.attrs.splice(attrDragStartIndex.value, 1)
    if (!draggedAttr) return

    currentGroup.attrs.splice(attrDragTargetIndex.value, 0, draggedAttr)
  })
}

function handleDeleteManagedAttr(attrId: number) {
  if (groupManageAttrs.value.length <= 1) {
    resetManagedAttrSwipe()
    emit('toast', '至少保留一个属性')
    return
  }

  deleteConfirmTarget.value = { type: 'attr', attrId }
  showDeleteConfirm.value = true
}

function handleConfirmDelete() {
  const target = deleteConfirmTarget.value
  if (!target) return

  updateGroups((groups) => {
    if (target.type === 'group') {
      const groupIndex = groups.findIndex((item) => item.id === target.groupId)
      if (groupIndex >= 0) groups.splice(groupIndex, 1)

      if (currentGroupId.value === target.groupId) {
        currentGroupId.value = null
        showGroupAttrPanel.value = false
      }
      return
    }

    const currentGroup = groups.find((item) => item.id === currentGroupId.value)
    if (currentGroup && currentGroup.attrs.length > 1) {
      currentGroup.attrs = currentGroup.attrs.filter((item) => item.id !== target.attrId)
    }
  })

  deleteConfirmTarget.value = null
  resetManagedAttrSwipe()
}

onBeforeUnmount(() => {
  clearAttrLongPressTimer()
  clearAttrDropTimer()
  clearAttrSilentReorderTimer()
})
</script>

<style scoped lang="scss">
.custom-attrs__group {
  margin-top: 17rpx;
}

.custom-attrs__head {
  height: 82rpx;
  padding: 0 10rpx 0 22rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-attrs__title-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: flex-end;
  gap: 11rpx;
  width: fit-content;
  max-width: calc(100% - 64rpx);
}

.custom-attrs__title-measure {
  min-width: 1em;
  max-width: 360rpx;
  color: transparent;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}

.custom-attrs__title {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  max-width: 360rpx;
  height: 42rpx;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  color: #333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 500;
  background: transparent;
}

.custom-attrs__edit-icon {
  width: 34rpx;
  height: 34rpx;
}

.custom-attrs__more {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-attrs__card {
  min-height: 246rpx;
  padding: 31rpx 34rpx 0;
  border-radius: 24rpx;
  box-sizing: border-box;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.72);
}

.custom-attrs__field + .custom-attrs__field {
  margin-top: 19rpx;
}

.custom-attrs__field-title,
.custom-attrs__field-content {
  display: block;
  font-size: 30rpx;
  line-height: 42rpx;
}

.custom-attrs__field-title {
  color: #aaa;
}

.custom-attrs__field-content {
  margin-top: 2rpx;
  color: #333;
}

.custom-attrs__placeholder-text {
  color: #aaa;
}

.custom-attrs__add-attr {
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

.custom-attrs__add-group {
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

.custom-attrs__add-group::after,
.custom-attrs__add-attr::after {
  border: 0;
}

.custom-attrs-panel {
  position: fixed;
  inset: 0;
  z-index: 32;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.5);
}

.custom-attrs-panel__sheet {
  width: 100%;
  height: 804rpx;
  padding: 36rpx 28rpx calc(24rpx + env(safe-area-inset-bottom));
  border-radius: 24rpx 24rpx 0 0;
  box-sizing: border-box;
  background: #f8f8f8;
}

.custom-attrs-panel__title {
  display: block;
  color: #333;
  font-size: 32rpx;
  line-height: 44rpx;
  font-weight: 700;
  text-align: center;
}

.custom-attrs-panel__line {
  width: 56rpx;
  height: 4rpx;
  margin: 8rpx auto 48rpx;
  background: #ff667a;
}

.custom-attrs-panel__list {
  height: 624rpx;
}

.custom-attrs-panel__item {
  position: relative;
  height: 88rpx;
  border-radius: 16rpx;
  background: transparent;
}

.custom-attrs-panel__item--delete-active {
  background: transparent;
}

.custom-attrs-panel__item:not(.custom-attrs-panel__item--dragging) {
  overflow: hidden;
}

.custom-attrs-panel__delete {
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

.custom-attrs-panel__delete--active {
  opacity: 1;
  pointer-events: auto;
}

.custom-attrs-panel__delete::after {
  border: 0;
}

.custom-attrs-panel__item-main {
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

.custom-attrs-panel__item--dragging .custom-attrs-panel__item-main {
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.12);
}

.custom-attrs-panel__item + .custom-attrs-panel__item {
  margin-top: 32rpx;
}

.custom-attrs-panel__text {
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

.custom-attrs-panel__text--placeholder {
  color: #aaa;
}

.custom-attrs-panel__icon {
  flex: 0 0 40rpx;
  width: 40rpx;
  height: 40rpx;
  margin-left: 24rpx;
}

.custom-attrs-panel__icon--hidden {
  opacity: 0;
}

.button-hover {
  opacity: 0.82;
}
</style>
