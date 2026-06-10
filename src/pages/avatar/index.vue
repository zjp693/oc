<template>
  <view class="avatar-page" :class="{ 'avatar-page--mall': pageMode === 'mall' }">
    <AppTopBar variant="title-action" :title="pageTitle" :inline-padding="topBarPadding">
      <template v-if="pageMode === 'mall'" #leading>
        <view class="mall-top-title">
          <image class="mall-top-title__lingbao" src="/static/avatar/left-top-lingbao.png" mode="aspectFit" />
          <text class="mall-top-title__text">商城</text>
        </view>
      </template>
      <template v-if="pageMode === 'mall'" #trailing>
        <MallBalancePills :diamond="balances.diamond" :star="balances.star" @exchange="handleExchangeOpen" />
      </template>
    </AppTopBar>

    <view v-if="showAvatarPreview" class="hero-section">
      <view class="avatar-preview">
        <view class="avatar-frame">
          <image class="avatar-image" src="/static/home/oc1-avatar.png" mode="aspectFit" />
        </view>
        <button v-if="pageMode === 'owned'" class="change-button" hover-class="button-hover">
          更换头像
        </button>
      </view>
    </view>

    <view v-if="pageMode === 'mall' && mallTab === 'hot'" class="mall-intro">
      <text>共200款 · 头像框简介</text>
    </view>

    <view class="frame-panel" :class="`frame-panel--${contentKind}`">
      <template v-if="contentKind === 'frames'">
        <view v-if="pageMode === 'owned'" class="list-header">
          <view class="all-tab">全部</view>
          <text class="intro-text">· 头像框简介简介简介简介简介简介简介简介 / 200个</text>
        </view>

        <scroll-view
          class="frame-scroll"
          scroll-y
          :scroll-with-animation="false"
        >
          <AvatarFrameGrid
            :items="currentFrameItems"
            :mode="pageMode === 'mall' ? 'mall' : 'owned'"
            :selected-id="selectedFrameId"
            @select="handleSelectFrame"
          />
          <!-- <view class="end-tip"></view> -->
        </scroll-view>
      </template>

      <scroll-view
        v-else-if="contentKind === 'vip'"
        class="mall-scroll"
        scroll-y
      >
        <MallVipPanel
          :rewards="vipRewards"
          :benefits="vipBenefits"
          :expires-at="vipExpiresAt"
          @buy="handleBuy"
        />
      </scroll-view>

      <scroll-view
        v-else
        class="mall-scroll"
        scroll-y
      >
        <MallRechargeGrid
          :items="rechargeItems"
          :selected-id="selectedRechargeId"
          @select="selectedRechargeId = $event"
        />
      </scroll-view>
    </view>

    <MallBuyButton
      v-if="showBuyButton"
      :label="buyButtonLabel"
      :disabled="buyButtonDisabled"
      @click="handleBuy"
    />

    <view v-if="showMallBottomMask" class="mall-bottom-mask"></view>

    <view class="avatar-bottom-bar">
      <BottomSwitchBar
        :model-value="bottomValue"
        :options="bottomOptions"
        @change="handleBottomChange"
        @back="handleBack"
      />
    </view>

    <MallExchangeDialog
      v-model="showExchangeDialog"
      :default-amount="exchangeDefaultAmount"
      :max="balances.diamond"
      @confirm="handleExchangeConfirm"
    />
    <OcConfirmDialog
      v-model="showPurchaseConfirm"
      variant="mall"
      :content="purchaseConfirmText"
      @confirm="handlePurchaseConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import AvatarFrameGrid from '@/components/avatar/AvatarFrameGrid.vue'
import type { AvatarFrameItem } from '@/components/avatar/AvatarFrameCard.vue'
import MallBalancePills from '@/components/mall/MallBalancePills.vue'
import MallBuyButton from '@/components/mall/MallBuyButton.vue'
import MallExchangeDialog from '@/components/mall/MallExchangeDialog.vue'
import MallRechargeGrid, { type MallRechargeItem } from '@/components/mall/MallRechargeGrid.vue'
import MallVipPanel, { type MallVipReward } from '@/components/mall/MallVipPanel.vue'
import OcConfirmDialog from '@/components/oc-detail/OcConfirmDialog.vue'

type PageMode = 'owned' | 'mall'
type MallTab = 'hot' | 'vip' | 'recharge'
type ContentKind = 'frames' | 'vip' | 'recharge'

interface BottomOption {
  label: string
  value: string
}

const pageMode = ref<PageMode>('owned')
const mallTab = ref<MallTab>('hot')
const openedFromDockMall = ref(false)
const selectedOwnedFrameId = ref(1)
const selectedMallFrameId = ref(101)
const selectedRechargeId = ref(1)
const purchasedMallFrameIds = ref<number[]>([])
const vipExpiresAt = ref('')
const showExchangeDialog = ref(false)
const showPurchaseConfirm = ref(false)
const pendingPurchaseKind = ref<'frame' | 'vip' | 'recharge'>('frame')
const exchangeDefaultAmount = ref(200)
const balances = ref({
  diamond: 1230,
  star: 120
})

const ownedBottomOptions: BottomOption[] = [
  { label: '已拥有', value: 'owned' },
  { label: '商城', value: 'mall' }
]
const mallBottomOptions: BottomOption[] = [
  { label: '热卖', value: 'hot' },
  { label: 'VIP', value: 'vip' },
  { label: '充值', value: 'recharge' }
]
const ownedFrameItems: AvatarFrameItem[] = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  name: '相框名称名称'
}))
const mallFrameItems: AvatarFrameItem[] = Array.from({ length: 15 }, (_, index) => ({
  id: index + 101,
  name: '相框名称名称',
  free: index % 3 === 1,
  price: 200,
  currency: index % 3 === 2 ? 'diamond' : 'star',
  badge: index === 1
}))
const vipRewards: MallVipReward[] = [
  { label: '每日可得星钻', value: '+100', currency: 'diamond' },
  { label: '每日可得星引', value: '额外 +100', currency: 'star' },
  { label: '即刻获得星钻', value: '+160', currency: 'diamond' }
]
const vipBenefits = ['VIP专属标识', '专属免费限定头像框', '对话畅聊无限制次数']
const rechargeItems: MallRechargeItem[] = [
  { id: 1, amount: 600, bonus: 60, price: 6, stack: 1 },
  { id: 2, amount: 3000, bonus: 300, price: 30, stack: 2 },
  { id: 3, amount: 9800, bonus: 980, price: 98, stack: 3 }
]

const pageTitle = computed(() => (pageMode.value === 'mall' ? '商城' : '头像框'))
const topBarPadding = computed(() => (pageMode.value === 'mall' ? '30rpx' : '30rpx'))
const showAvatarPreview = computed(() => pageMode.value === 'owned' || mallTab.value === 'hot')
const contentKind = computed<ContentKind>(() => {
  if (pageMode.value === 'owned' || mallTab.value === 'hot') return 'frames'
  return mallTab.value
})
const displayedMallFrameItems = computed<AvatarFrameItem[]>(() =>
  mallFrameItems.map((item) => ({
    ...item,
    free: item.free && !purchasedMallFrameIds.value.includes(item.id),
    owned: purchasedMallFrameIds.value.includes(item.id)
  }))
)
const currentFrameItems = computed(() => (pageMode.value === 'owned' ? ownedFrameItems : displayedMallFrameItems.value))
const selectedFrameId = computed(() => (
  pageMode.value === 'owned' ? selectedOwnedFrameId.value : selectedMallFrameId.value
))
const selectedMallFrame = computed(() => mallFrameItems.find((item) => item.id === selectedMallFrameId.value))
const selectedMallFrameOwned = computed(() => purchasedMallFrameIds.value.includes(selectedMallFrameId.value))
const selectedRecharge = computed(() => rechargeItems.find((item) => item.id === selectedRechargeId.value) || rechargeItems[0])
const bottomOptions = computed(() => (pageMode.value === 'mall' ? mallBottomOptions : ownedBottomOptions))
const bottomValue = computed(() => (pageMode.value === 'mall' ? mallTab.value : pageMode.value))
const showBuyButton = computed(() => pageMode.value === 'mall' && mallTab.value === 'hot')
const showMallBottomMask = computed(() => pageMode.value === 'mall' && mallTab.value === 'hot')
const buyButtonLabel = computed(() => {
  if (mallTab.value === 'vip') return '购买月卡 ¥16'
  if (mallTab.value === 'recharge') return `购买 ${selectedRecharge.value.price}元`
  if (selectedMallFrameOwned.value) return '已拥有'
  return '购买'
})
const buyButtonDisabled = computed(() => mallTab.value === 'hot' && selectedMallFrameOwned.value)
const purchaseConfirmText = computed(() => {
  if (pendingPurchaseKind.value === 'vip') {
    return vipExpiresAt.value ? '续费VIP月卡：消耗16元' : '购买VIP月卡：消耗16元'
  }
  if (pendingPurchaseKind.value === 'recharge') return `购买${selectedRecharge.value.amount}星钻：消耗${selectedRecharge.value.price}元`
  const item = selectedMallFrame.value
  if (!item) return '购买个性头像框：消耗200星引'
  if (item.free) return '领取免费个性头像框？'
  return `购买个性头像框：消耗${item.price || 0}${item.currency === 'diamond' ? '星钻' : '星引'}`
})

onLoad((query) => {
  const mode = normalizeQueryValue(query?.mode)
  const tab = normalizeQueryValue(query?.tab)
  const entry = normalizeQueryValue(query?.entry)

  if (mode === 'mall') {
    pageMode.value = 'mall'
    openedFromDockMall.value = entry === 'dock'
  }

  if (tab === 'hot' || tab === 'vip' || tab === 'recharge') {
    mallTab.value = tab
  }
})

function handleSelectFrame(id: number) {
  if (pageMode.value === 'owned') {
    selectedOwnedFrameId.value = id
    return
  }
  selectedMallFrameId.value = id
}

function handleBottomChange(value: string) {
  if (pageMode.value === 'owned') {
    if (value === 'mall') {
      pageMode.value = 'mall'
      openedFromDockMall.value = false
      mallTab.value = 'hot'
    }
    return
  }

  if (value === 'hot' || value === 'vip' || value === 'recharge') {
    mallTab.value = value
  }
}

function handleBuy() {
  if (buyButtonDisabled.value) return

  if (mallTab.value === 'vip') {
    pendingPurchaseKind.value = 'vip'
    showPurchaseConfirm.value = true
    return
  }

  if (mallTab.value === 'recharge') {
    pendingPurchaseKind.value = 'recharge'
    showPurchaseConfirm.value = true
    return
  }

  const item = selectedMallFrame.value
  if (!item) return

  pendingPurchaseKind.value = 'frame'

  if (item.free) {
    showPurchaseConfirm.value = true
    return
  }

  const price = item.price || 0

  if (item.currency === 'diamond' && balances.value.diamond < price) {
    showToast('星钻不足')
    return
  }

  if (item.currency === 'star' && balances.value.star < price) {
    showToast('星引不足')
    return
  }

  showPurchaseConfirm.value = true
}

function handleExchangeOpen() {
  exchangeDefaultAmount.value = Math.min(200, balances.value.diamond)
  showExchangeDialog.value = true
}

function handleExchangeConfirm(amount: number) {
  if (amount <= 0 || balances.value.diamond < amount) {
    showToast('星钻不足')
    return
  }

  balances.value.diamond -= amount
  balances.value.star += amount
  showToast('兑换成功')
}

function handlePurchaseConfirm() {
  if (pendingPurchaseKind.value === 'frame') {
    const item = selectedMallFrame.value
    if (!item || item.free) {
      markMallFrameOwned(item?.id)
      showToast('已领取')
      return
    }

    const price = item.price || 0
    if (item.currency === 'diamond') {
      if (balances.value.diamond < price) {
        showToast('星钻不足')
        return
      }
      balances.value.diamond -= price
    } else {
      if (balances.value.star < price) {
        showToast('星引不足')
        return
      }
      balances.value.star -= price
    }

    markMallFrameOwned(item.id)
    showToast('购买成功')
    return
  }

  if (pendingPurchaseKind.value === 'recharge') {
    balances.value.diamond += selectedRecharge.value.amount + selectedRecharge.value.bonus
    showToast('充值成功')
    return
  }

  if (pendingPurchaseKind.value === 'vip') {
    const wasVipActive = Boolean(vipExpiresAt.value)
    vipExpiresAt.value = getNextVipExpiresAt()
    showToast(wasVipActive ? '续费成功' : '购买成功')
    return
  }

  showToast('购买成功')
}

function handleBack() {
  if (pageMode.value === 'mall') {
    if (openedFromDockMall.value) {
      uni.navigateBack()
      return
    }

    pageMode.value = 'owned'
    return
  }

  uni.navigateBack()
}

function showToast(title: string) {
  uni.showToast({
    title,
    icon: 'none'
  })
}

function markMallFrameOwned(id?: number) {
  if (!id || purchasedMallFrameIds.value.includes(id)) return
  purchasedMallFrameIds.value = [...purchasedMallFrameIds.value, id]
}

function normalizeQueryValue(value: unknown) {
  if (Array.isArray(value)) return String(value[0] ?? '')
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

function getNextVipExpiresAt() {
  const startDate = parseVipDate(vipExpiresAt.value)
  const today = new Date()
  const baseDate = startDate && startDate.getTime() > today.getTime() ? startDate : today
  const nextDate = new Date(baseDate)
  nextDate.setMonth(nextDate.getMonth() + 1)
  return formatVipDate(nextDate)
}

function parseVipDate(value: string) {
  if (!value) return null
  const [year, month, day] = value.split('.').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatVipDate(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
</script>

<style scoped lang="scss">
.avatar-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  overscroll-behavior: none;
  display: flex;
  flex-direction: column;
  background-color: #f6fbff;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.mall-top-title {
  position: relative;
  height: 72rpx;
  display: inline-flex;
  align-items: center;
  overflow: visible;
}

.mall-top-title__lingbao {
  position: absolute;
  z-index: 0;
  left: -28rpx;
  top: -14rpx;
  width: 74rpx;
  height: 104rpx;
  opacity: 0.92;
  pointer-events: none;
}

.mall-top-title__text {
  position: relative;
  z-index: 1;
  color: rgba(255, 86, 116, 1);
  font-size: 40rpx;
  line-height: 44rpx;
  font-weight: 500;
  text-shadow: 6rpx 5rpx 0 rgba(255, 86, 116, 0.12);
  white-space: nowrap;
}

.mall-top-title__text::after {
  content: '';
  position: absolute;
  left: calc(100% + 2rpx);
  top: 50%;
  width: 30rpx;
  height: 30rpx;
  background-image: url('/static/home/avatar-title-stars.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%);
}

.hero-section {
  flex: 0 0 auto;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.avatar-page--mall .hero-section {
  margin-top: 10rpx;
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-frame {
  width: 210rpx;
  height: 210rpx;
  border: 2rpx solid rgba(51, 51, 51, 0.18);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.26);
}

.avatar-image {
  width: 178rpx;
  height: 178rpx;
}

.change-button {
  width: 126rpx;
  height: 46rpx;
  margin-top: 14rpx;
  padding: 0;
  border-radius: 20rpx;
  color: #333;
  font-size: 22rpx;
  line-height: 46rpx;
  box-shadow: 0 2rpx 12rpx 0 rgba(190, 190, 190, 0.4);
  background-color: transparent;
}

.change-button::after {
  border: 0;
}

.mall-intro {
  flex: 0 0 auto;
  padding: 24rpx 30rpx 0;
  color: #333333;
  font-size: 26rpx;
  line-height: 36rpx;
  font-weight: 400;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.frame-panel {
  flex: 1;
  min-height: 0;
  margin-top: 38rpx;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 55%, rgba(255, 255, 255, 0) 100%);
  border-radius: 38rpx 38rpx 0 0;
  box-sizing: border-box;
}

.avatar-page--mall .frame-panel {
  margin-top: 20rpx;
  border-radius: 0;
  background: transparent;
}

.list-header {
  flex: 0 0 92rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.all-tab {
  position: relative;
  color: rgba(51, 51, 51, 1);
  font-size: 34rpx;
  line-height: 44rpx;
  font-weight: 500;
}

.all-tab::after {
  content: '';
  position: absolute;
  left: 10rpx;
  right: 10rpx;
  bottom: -8rpx;
  height: 4rpx;
  width: 38rpx;
  border-radius: 2rpx;
  background: rgba(51, 51, 51, 1);
}

.intro-text {
  min-width: 0;
  color: #9a9a9a;
  font-size: 24rpx;
  line-height: 32rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.frame-scroll,
.mall-scroll {
  flex: 1;
  min-height: 0;
  padding: 11rpx 12rpx 0;
  box-sizing: border-box;
}

.avatar-page--mall .frame-scroll,
.avatar-page--mall .mall-scroll {
  padding: 11rpx 30rpx 0;
}

.avatar-page--mall .frame-panel--vip .mall-scroll,
.avatar-page--mall .frame-panel--recharge .mall-scroll {
  padding-left: 22rpx;
  padding-right: 22rpx;
}

// .end-tip {
//   margin-top: 80rpx;
//   padding-bottom: 20rpx;
//   color: #9a9a9a;
//   font-size: 28rpx;
//   line-height: 40rpx;
//   text-align: center;
// }

.avatar-bottom-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 3;
  height: 100rpx;
  animation: none;
  transition: none;
}

.mall-bottom-mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 2;
  height: 220rpx;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.76) 48%,
    rgba(255, 255, 255, 0.96) 100%
  );
}

.button-hover {
  opacity: 0.82;
}
</style>
