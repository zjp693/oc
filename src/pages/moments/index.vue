<template>
  <view class="moments-page">
    <view v-if="pageMenuOpen || activeMomentMenu" class="moments-page__menu-mask" @click="closeMenus"></view>

    <scroll-view class="moments-page__scroll" scroll-y>
      <view class="moments-cover">
        <AppTopBar inline-padding="30rpx">
          <template #content>
            <view class="moments-cover__top-space"></view>
          </template>
        </AppTopBar>

        <image class="moments-cover__image" src="/static/oc/detail-landscape.jpg" mode="aspectFill" />
        <view class="moments-cover__profile">
          <text class="moments-cover__name">{{ sceneProfile.name }}</text>
          <view class="moments-cover__avatar">
            <image class="moments-cover__avatar-image" :src="sceneProfile.avatar" mode="aspectFill" />
          </view>
        </view>
      </view>

      <view class="moments-list">
        <view v-for="item in moments" :key="item.id" class="moment-item">
          <view class="moment-item__avatar">
            <image class="moment-item__avatar-image" :src="item.avatar" mode="aspectFill" />
          </view>

          <view class="moment-item__body">
            <view class="moment-item__head">
              <text class="moment-item__name">{{ item.authorName }}</text>
              <view class="moment-item__tools">
                <text class="moment-item__time">{{ item.createdAt }}</text>
                <button
                  v-if="getMomentAction(item)"
                  class="moment-item__menu"
                  hover-class="button-hover"
                  @click.stop="toggleMomentMenu(item.id)"
                >
                  <image class="moment-item__menu-icon" src="/static/phone/icon-ellipsis.png" mode="aspectFit" />
                </button>
              </view>
            </view>

            <view class="moment-item__content-wrap">
              <text
                :class="[
                  'moment-item__content',
                  !isMomentContentExpanded(item.id) && 'moment-item__content--collapsed'
                ]"
              >
                {{ item.content }}
              </text>
              <text :id="`moment-content-measure-${item.id}`" class="moment-item__content-measure">{{ item.content }}</text>
              <text
                v-if="shouldShowMomentContentExpand(item)"
                class="moment-item__expand-text"
                @click.stop="expandMomentContent(item.id)"
              >
                全文
              </text>
            </view>

            <view v-if="getVisibleComments(item).length" class="moment-item__comments">
              <view v-for="comment in getVisibleComments(item)" :key="comment.id" class="moment-item__comment-wrap">
                <view
                  :class="[
                    'moment-item__comment',
                    !isCommentExpanded(comment.id) && 'moment-item__comment--collapsed'
                  ]"
                >
                  <text class="moment-item__comment-name">{{ comment.authorName }}：</text>
                  <text class="moment-item__comment-content">{{ comment.content }}</text>
                </view>
                <view class="moment-item__comment-measure" :id="`moment-comment-measure-${comment.id}`">
                  <text class="moment-item__comment-name">{{ comment.authorName }}：</text>
                  <text class="moment-item__comment-content">{{ comment.content }}</text>
                </view>
                <text
                  v-if="shouldShowCommentExpand(comment)"
                  class="moment-item__expand-text moment-item__expand-text--comment"
                  @click.stop="expandComment(comment.id)"
                >
                  全文
                </text>
              </view>
            </view>

            <view v-if="activeMomentMenu === item.id" class="moments-popover moments-popover--item" @click.stop>
              <button
                v-if="getMomentAction(item) === 'delete'"
                class="moments-popover__item"
                hover-class="button-hover"
                @click="handleDelete(item.id)"
              >
                <image class="moments-popover__icon" src="/static/phone/icon-moments-delete-format.png" mode="aspectFit" />
                <text>删除该朋友圈</text>
              </button>
              <button
                v-else-if="getMomentAction(item) === 'comment'"
                class="moments-popover__item moments-popover__item--primary"
                hover-class="button-hover"
                @click="openComment(item.id)"
              >
                <image
                  class="moments-popover__comment-icon"
                  src="/static/phone/icon-moments-comment.png"
                  mode="aspectFit"
                />
                <text>评论该朋友圈</text>
              </button>
            </view>

            <view v-if="activeCommentId === item.id" class="moment-comment" @click.stop>
              <view class="moment-comment__bar">
                <input
                  class="moment-comment__input"
                  :value="commentText"
                  placeholder="发表评论："
                  placeholder-class="moment-comment__placeholder"
                  confirm-type="send"
                  :adjust-position="true"
                  :cursor-spacing="24"
                  @input="handleCommentInput"
                  @confirm="submitComment"
                />
                <button class="moment-comment__send" hover-class="button-hover" @click="submitComment">
                  <view class="moment-comment__send-icon"></view>
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-if="pageMenuOpen" class="moments-popover moments-popover--page" @click.stop>
      <button class="moments-popover__item moments-popover__item--primary" hover-class="button-hover" @click="handlePublish">
        <image class="moments-popover__icon" src="/static/phone/icon-moments-publish-camera.png" mode="aspectFit" />
        <text>发布朋友圈</text>
      </button>
    </view>

    <view class="moments-page__bottom">
      <BottomSwitchBar :options="[]" @back="handleBack" />
      <button v-if="sceneConfig.canPublish" class="moments-page__publish-trigger" hover-class="button-hover" @click.stop="togglePageMenu">
        <image class="moments-page__publish-icon" src="/static/phone/icon-application-menu-dots.png" mode="aspectFit" />
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import AppTopBar from '@/components/common/AppTopBar.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'

type MomentsOwnerType = 'user' | 'oc'

interface MomentItem {
  id: string
  authorName: string
  avatar: string
  content: string
  createdAt: string
  owner: 'self' | 'other'
  canDelete?: boolean
  canComment?: boolean
  comments?: MomentComment[]
}

interface MomentComment {
  id: string
  authorName: string
  content: string
  ownerType: MomentsOwnerType
}

interface MomentsSceneConfig {
  ownerType: MomentsOwnerType
  canPublish: boolean
  canDelete: boolean
  canComment: boolean
  showOcComments: boolean
  showUserComments: boolean
}

interface MomentsProfile {
  name: string
  avatar: string
}

const pageMenuOpen = ref(false)
const activeMomentMenu = ref<string | null>(null)
const activeCommentId = ref<string | null>(null)
const commentText = ref('')
const scene = ref<MomentsOwnerType>('oc')
const expandedMomentContentIds = ref<string[]>([])
const expandedCommentIds = ref<string[]>([])
const overflowMomentContentIds = ref<string[]>([])
const overflowCommentIds = ref<string[]>([])

const MOMENT_CONTENT_LINE_HEIGHT = 45
const MOMENT_CONTENT_COLLAPSED_LINES = 5
const COMMENT_LINE_HEIGHT = 40
const COMMENT_COLLAPSED_LINES = 3

const sceneConfig = computed<MomentsSceneConfig>(() => {
  if (scene.value === 'user') {
    return {
      ownerType: 'user',
      // canPublish 决定右下角发布按钮是否显示。
      canPublish: true,
      // canDelete 决定每条动态右上角删除菜单是否可用。
      canDelete: true,
      // canComment 决定是否显示/启用评论入口。
      canComment: true,
      showOcComments: true,
      showUserComments: true
    }
  }

  return {
    ownerType: 'oc',
    // canPublish 决定右下角发布按钮是否显示，OC 手机朋友圈用户不可代发。
    canPublish: false,
    // canDelete 决定每条动态右上角删除菜单是否可用，OC 手机朋友圈用户不可删除。
    canDelete: false,
    // canComment 决定是否显示/启用评论入口。
    canComment: true,
    showOcComments: true,
    showUserComments: true
  }
})

const sceneProfile = computed<MomentsProfile>(() => {
  // ownerType 决定封面昵称、头像、mock 数据来源。
  return sceneConfig.value.ownerType === 'user'
    ? { name: '用户昵称昵称', avatar: '/static/home/oc1-avatar.png' }
    : { name: 'OC昵称昵称', avatar: '/static/home/oc1-avatar.png' }
})

const userMoments = ref<MomentItem[]>([
  {
    id: 'user-moment-1',
    authorName: '用户昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    owner: 'self',
    canDelete: true,
    content:
      '用户朋友圈内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容用户朋友圈内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
    comments: [
      {
        id: 'user-moment-1-comment-1',
        authorName: 'OC昵称昵称',
        ownerType: 'oc',
        content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
      }
    ]
  },
  {
    id: 'user-moment-2',
    authorName: '用户昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '昨天12:12',
    owner: 'self',
    canDelete: true,
    content:
      '用户发布的朋友圈内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
    comments: [
      {
        id: 'user-moment-2-comment-1',
        authorName: '用户昵称昵称',
        ownerType: 'user',
        content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
      }
    ]
  }
])

const ocMoments = ref<MomentItem[]>([
  {
    id: 'oc-moment-1',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    owner: 'other',
    canComment: true,
    content:
      '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
    comments: [
      {
        id: 'oc-moment-1-comment-1',
        authorName: '内容内容内',
        ownerType: 'oc',
        content:
          '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
      }
    ]
  },
  {
    id: 'oc-moment-2',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    owner: 'other',
    canComment: true,
    content:
      '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
    comments: [
      {
        id: 'oc-moment-2-comment-1',
        authorName: '内容内容内',
        ownerType: 'oc',
        content: '内容内容内容内容内容内容内容内容内容内容内容内容'
      },
      {
        id: 'oc-moment-2-comment-2',
        authorName: '用户昵称昵称',
        ownerType: 'user',
        content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
      }
    ]
  },
  {
    id: 'oc-moment-3',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    owner: 'other',
    canComment: true,
    content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
  },
  {
    id: 'oc-moment-4',
    authorName: 'OC昵称昵称',
    avatar: '/static/home/oc1-avatar.png',
    createdAt: '10分钟前',
    owner: 'other',
    canComment: true,
    content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
  }
])

const moments = computed(() => (sceneConfig.value.ownerType === 'user' ? userMoments.value : ocMoments.value))

onLoad((query) => {
  scene.value = normalizeScene(query?.scene)
  scheduleMeasureOverflow()
})

onReady(() => {
  scheduleMeasureOverflow()
})

function normalizeScene(value: unknown): MomentsOwnerType {
  const text = Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '')
  return text === 'user' ? 'user' : 'oc'
}

function togglePageMenu() {
  if (!sceneConfig.value.canPublish) return
  activeMomentMenu.value = null
  activeCommentId.value = null
  pageMenuOpen.value = !pageMenuOpen.value
}

function toggleMomentMenu(id: string) {
  pageMenuOpen.value = false
  if (activeCommentId.value !== id) {
    activeCommentId.value = null
    commentText.value = ''
  }
  activeMomentMenu.value = activeMomentMenu.value === id ? null : id
}

function closeMenus() {
  pageMenuOpen.value = false
  activeMomentMenu.value = null
}

function getMomentAction(item: MomentItem): 'delete' | 'comment' | undefined {
  if (item.owner === 'self' && sceneConfig.value.canDelete && item.canDelete) return 'delete'
  if (item.owner === 'other' && sceneConfig.value.canComment && item.canComment) return 'comment'
  return undefined
}

function getVisibleComments(item: MomentItem) {
  return (item.comments ?? []).filter((comment) => {
    if (comment.ownerType === 'oc') return sceneConfig.value.showOcComments
    return sceneConfig.value.showUserComments
  })
}

function isMomentContentExpanded(id: string) {
  return expandedMomentContentIds.value.includes(id)
}

function isCommentExpanded(id: string) {
  return expandedCommentIds.value.includes(id)
}

function shouldShowMomentContentExpand(item: MomentItem) {
  return !isMomentContentExpanded(item.id) && overflowMomentContentIds.value.includes(item.id)
}

function shouldShowCommentExpand(comment: MomentComment) {
  return !isCommentExpanded(comment.id) && overflowCommentIds.value.includes(comment.id)
}

function scheduleMeasureOverflow() {
  nextTick(() => {
    setTimeout(measureOverflow, 0)
  })
}

function measureOverflow() {
  const systemInfo = uni.getSystemInfoSync()
  const rpxToPx = systemInfo.windowWidth / 750
  const momentMaxHeight = MOMENT_CONTENT_LINE_HEIGHT * MOMENT_CONTENT_COLLAPSED_LINES * rpxToPx
  const commentMaxHeight = COMMENT_LINE_HEIGHT * COMMENT_COLLAPSED_LINES * rpxToPx
  const visibleComments = moments.value.flatMap((item) => getVisibleComments(item))
  const query = uni.createSelectorQuery()

  moments.value.forEach((item) => {
    query.select(`#moment-content-measure-${item.id}`).boundingClientRect()
  })
  visibleComments.forEach((comment) => {
    query.select(`#moment-comment-measure-${comment.id}`).boundingClientRect()
  })

  query.exec((rects) => {
    if (!Array.isArray(rects)) return

    const momentRects = rects.slice(0, moments.value.length)
    const commentRects = rects.slice(moments.value.length)

    overflowMomentContentIds.value = moments.value
      .filter((_, index) => isRectOverflow(momentRects[index], momentMaxHeight))
      .map((item) => item.id)

    overflowCommentIds.value = visibleComments
      .filter((_, index) => isRectOverflow(commentRects[index], commentMaxHeight))
      .map((comment) => comment.id)
  })
}

function isRectOverflow(rect: UniApp.NodeInfo | null | undefined, maxHeight: number) {
  return typeof rect?.height === 'number' && rect.height > maxHeight + 1
}

function expandMomentContent(id: string) {
  if (isMomentContentExpanded(id)) return
  expandedMomentContentIds.value = [...expandedMomentContentIds.value, id]
}

function expandComment(id: string) {
  if (isCommentExpanded(id)) return
  expandedCommentIds.value = [...expandedCommentIds.value, id]
}

function handlePublish() {
  if (!sceneConfig.value.canPublish) return
  closeMenus()
  uni.navigateTo({
    url: '/pages/moments-publish/index'
  })
}

function handleDelete(id: string) {
  const item = moments.value.find((moment) => moment.id === id)
  if (!item || getMomentAction(item) !== 'delete') return
  userMoments.value = userMoments.value.filter((item) => item.id !== id)
  ocMoments.value = ocMoments.value.filter((item) => item.id !== id)
  closeMenus()
  uni.showToast({
    title: '已删除',
    icon: 'none'
  })
}

function openComment(id: string) {
  const item = moments.value.find((moment) => moment.id === id)
  if (!item || getMomentAction(item) !== 'comment') return

  activeMomentMenu.value = null
  activeCommentId.value = id
  commentText.value = ''
}

function handleCommentInput(event: Event) {
  commentText.value = (event as unknown as { detail?: { value?: string } }).detail?.value ?? ''
}

function submitComment() {
  const text = commentText.value.trim()
  if (!activeCommentId.value || !text) return
  const item = moments.value.find((moment) => moment.id === activeCommentId.value)
  if (!item) return

  const comments = item.comments ?? []
  comments.push({
    id: `${item.id}-comment-${Date.now()}`,
    authorName: sceneProfile.value.name,
    ownerType: sceneConfig.value.ownerType,
    content: text
  })
  item.comments = comments
  scheduleMeasureOverflow()

  uni.showToast({
    title: '已评论',
    icon: 'none'
  })
  closeComment()
}

function closeComment() {
  activeCommentId.value = null
  commentText.value = ''
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.moments-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
}

.moments-page__menu-mask {
  position: absolute;
  z-index: 18;
  inset: 0;
  background: transparent;
}

.moments-cover {
  position: relative;
  height: 750rpx;
  background: #e5e5e5;
  overflow: visible;
}

.moments-cover__top-space {
  width: 100%;
  height: 1rpx;
}

.moments-cover__image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.moments-cover__profile {
  position: absolute;
  right: 24rpx;
  bottom: 20rpx;
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
}

.moments-cover__name {
  max-width: 260rpx;
  padding-bottom: 24rpx;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 34rpx;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.moments-cover__avatar {
  width: 109rpx;
  height: 109rpx;
  padding: 9rpx;
  box-sizing: border-box;
  border: 2rpx solid #bbbbbb;
}

.moments-cover__avatar-image {
  width: 100%;
  height: 100%;
}

.moments-popover {
  position: absolute;
  z-index: 20;
  padding: 8rpx 0;
  border-radius: 12rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.16);
}

.moments-popover--page {
  right: 28rpx;
  bottom: calc(116rpx + env(safe-area-inset-bottom));
}

.moments-popover--item {
  top: 44rpx;
  right: 0;
}

.moments-popover__item {
  width: 100%;
  margin: 0;
  padding: 12rpx 28rpx;
  border-radius: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #333333;
  font-size: 34rpx;
  line-height: 42rpx;
  font-weight: 600;
  background: transparent;
}

.moments-popover__item::after {
  border: 0;
}

.moments-popover__item--primary {
  color: #ff667a;
}

.moments-popover__icon {
  width: 38rpx;
  height: 38rpx;
}

.moments-popover__comment-icon {
  width: 38rpx;
  height: 38rpx;
  transform: translateY(1rpx);
}

.moments-page__scroll {
  flex: 1;
  min-height: 0;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: #f7f7f7;
}

.moments-list {
  padding: 16rpx 30rpx 28rpx;
  box-sizing: border-box;
}

.moment-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 0 18rpx;
  border-bottom: 1rpx solid rgba(229, 229, 229, 0.98);
  box-sizing: border-box;
}

.moment-item__avatar {
  flex: 0 0 82rpx;
  width: 82rpx;
  height: 82rpx;
  padding: 7rpx;
  border: 2rpx solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.moment-item__avatar-image {
  width: 67rpx;
  height: 67rpx;
  border: 5rpx solid #ffffff;
  border-radius: 50%;
  box-sizing: border-box;
}

.moment-item__body {
  position: relative;
  flex: 1;
  min-width: 0;
  padding-right: 2rpx;
  box-sizing: border-box;
}

.moment-item__head {
  min-height: 45rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14rpx;
}

.moment-item__name {
  flex: 1;
  min-width: 0;
  color: #8bb6ce;
  font-size: 30rpx;
  line-height: 45rpx;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.moment-item__tools {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.moment-item__time {
  color: #9a9a9a;
  font-size: 30rpx;
  line-height: 44rpx;
  white-space: nowrap;
  margin-right: 8rpx;
}

.moment-item__menu {
  width: 45rpx;
  height: 45rpx;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.moment-item__menu::after {
  border: 0;
}

.moment-item__menu-icon {
  width: 45rpx;
  height: 45rpx;
}

.moment-item__content-wrap {
  position: relative;
  color: #333333;
  font-size: 34rpx;
  line-height: 45rpx;
}

.moment-item__content {
  display: block;
  padding-right: 0;
  color: #333333;
  font-size: 30rpx;
  line-height: 45rpx;
  box-sizing: border-box;
}

.moment-item__content--collapsed {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.moment-item__content-measure {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
  box-sizing: border-box;
  visibility: hidden;
  pointer-events: none;
  color: #333333;
  font-size: 34rpx;
  line-height: 45rpx;
}

.moment-item__comments {
  margin-top: 18rpx;
}

.moment-item__comment-wrap {
  position: relative;
  color: #333333;
  font-size: 30rpx;
  line-height: 40rpx;
}

.moment-item__comment {
  display: block;
  padding-right: 0;
  color: #333333;
  font-size: 30rpx;
  line-height: 40rpx;
  box-sizing: border-box;
}

.moment-item__comment--collapsed {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.moment-item__comment-measure {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  z-index: -1;
  box-sizing: border-box;
  visibility: hidden;
  pointer-events: none;
  color: #333333;
  font-size: 30rpx;
  line-height: 40rpx;
}

.moment-item__comment-name {
  color: #2f8fd0;
  font-size: 30rpx;
  line-height: 40rpx;
}

.moment-item__comment-content {
  color: #333333;
  font-size: 30rpx;
  line-height: 40rpx;
}

.moment-item__expand-text {
  display: inline-block;
  margin-top: 4rpx;
  color: #2f8fd0;
  font-size: 30rpx;
  line-height: 38rpx;
}

.moment-item__expand-text--comment {
  margin-top: 2rpx;
  font-size: 28rpx;
  line-height: 36rpx;
}

.moment-comment {
  margin-top: 18rpx;
}

.moment-comment__bar {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.moment-comment__input {
  flex: 1;
  min-width: 0;
  height: 64rpx;
  padding: 0 18rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
  color: #333333;
  font-size: 26rpx;
  line-height: 64rpx;
  background: rgba(255, 255, 255, 0.96);
}

.moment-comment__placeholder {
  color: rgba(51, 51, 51, 0.45);
  font-size: 26rpx;
}

.moment-comment__send {
  width: 54rpx;
  height: 54rpx;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 54rpx;
  background: #ff667a;
}

.moment-comment__send-icon {
  width: 0;
  height: 0;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-left: 20rpx solid #ffffff;
  transform: translateX(2rpx) rotate(-18deg);
}

.moment-comment__send::after {
  border: 0;
}

.moments-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 6;
  height: 100rpx;
}

.moments-page__publish-trigger {
  position: absolute;
  right: 24rpx;
  top: 0;
  width: 92rpx;
  height: 74rpx;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.moments-page__publish-trigger::after {
  border: 0;
}

.moments-page__publish-icon {
  width: 41rpx;
  height: 41rpx;
}

.button-hover {
  opacity: 0.82;
}
</style>
