<template>
  <view class="wallet-page">
    <AppTopBar variant="title-action" title="钱包" inline-padding="30rpx">
      <template #trailing>
        <MallBalancePills :diamond="balances.diamond" :star="balances.star" @exchange="handleExchangeOpen" />
      </template>
    </AppTopBar>

    <!-- 签到奖励视图 -->
    <scroll-view v-if="currentView === 'checkin'" class="wallet-page__scroll" :scroll-y="isVip">
      <view class="wallet-page__content">
        <!-- 每日签到领取奖励 -->
        <view class="wallet-section wallet-section--daily" :class="{ 'wallet-section--card': isVip }">
          <text class="wallet-section__title">每日签到领取奖励</text>
          <text class="wallet-section__subtitle">{{ dailySubtitle }}</text>
          <MallRewardGrid class="wallet-section__reward-grid" :rewards="dailyRewards" />
          <MallBuyButton
            placement="inline"
            :label="dailyCheckinButtonLabel"
            :tone="dailyCheckinButtonTone"
            :icon-src="dailyCheckinButtonIcon"
            icon-size="37rpx"
            :disabled="dailyRewardClaimed"
            @click="handleDailyCheckin"
          />
        </view>

        <!-- VIP额外奖励 -->
        <view v-if="!isVip" class="wallet-section wallet-section--vip">
          <view class="wallet-divider"></view>
          <text class="wallet-section__title">VIP特权每日额外奖励</text>
          <MallRewardGrid class="wallet-section__reward-grid wallet-section__reward-grid--vip" :rewards="vipRewards" />
          <text class="vip-benefits-copy">VIP专属标识 / 专属免费限定头像框</text>
          <MallBuyButton class="wallet-section__vip-button" placement="inline" label="去激活VIP特权"
            @click="handleActivateVip" />
        </view>

        <!-- 购买星钻 -->
        <view v-if="isVip" class="wallet-section wallet-section--recharge">
          <view class="wallet-divider"></view>
          <text class="wallet-section__title">购买星钻</text>
          <MallRechargeGrid class="wallet-section__recharge-grid" :items="rechargeItems"
            :selected-id="selectedRechargeId" @select="handleSelectRecharge" />
        </view>
      </view>
    </scroll-view>

    <!-- 收支明细视图 -->
    <view v-if="currentView === 'history'" class="wallet-history">
      <view class="wallet-history__header">
        <OcTabs
          class="wallet-history__tabs"
          :model-value="currentHistoryTab"
          :tabs="historyTabs"
          inline-padding="0"
          @change="handleHistoryTabChange"
        />
        <view class="wallet-history__filter">
          <text>所有</text>
          <image class="wallet-history__filter-arrow" src="/static/mall/icon-filter-sort-down.png" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="wallet-history__scroll" scroll-y>
        <view class="wallet-history__list">
          <view v-for="item in filteredHistory" :key="item.id" class="history-item">
            <view class="history-item__content">
              <text class="history-item__title">{{ item.title }}</text>
              <view class="history-item__meta">
                <text>{{ item.time }}</text>
                <text v-if="item.expireTime">（有效期:{{ item.expireTime }}）</text>
              </view>
            </view>
            <view class="history-item__amount" :class="{ 'history-item__amount--negative': item.amount < 0 }">
              <text class="history-item__amount-text">{{ item.amount > 0 ? '+' : '' }}{{ item.amount }}</text>
              <MallCurrencyIcon :type="item.currency" size="45rpx" />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="wallet-page__bottom">
      <BottomSwitchBar :options="bottomOptions" :model-value="currentView" @change="handleBottomChange"
        @back="handleBack" />
    </view>

    <MallExchangeDialog v-model="exchangeDialogOpen" :max="balances.diamond" :default-amount="0"
      @confirm="handleExchangeConfirm" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import MallBalancePills from '@/components/mall/MallBalancePills.vue'
import MallBuyButton from '@/components/mall/MallBuyButton.vue'
import MallCurrencyIcon from '@/components/mall/MallCurrencyIcon.vue'
import MallExchangeDialog from '@/components/mall/MallExchangeDialog.vue'
import MallRechargeGrid, { type MallRechargeItem } from '@/components/mall/MallRechargeGrid.vue'
import MallRewardGrid, { type MallRewardItem } from '@/components/mall/MallRewardGrid.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'
import OcTabs from '@/components/oc/OcTabs.vue'

type HistoryTabValue = 'all' | 'diamond' | 'star'

interface HistoryItem {
  id: string
  title: string
  time: string
  expireTime?: string
  amount: number
  currency: 'diamond' | 'star'
  type: HistoryTabValue
}

// 当前视图
const currentView = ref<'checkin' | 'history'>('checkin')

// 用户状态
const isVip = ref(false)
const dailyRewardClaimed = ref(false)

// 余额
const balances = ref({
  diamond: 1230,
  star: 200
})

// VIP到期时间
const vipExpiryDate = ref('2026/01/01')
const vipExpiryText = computed(() => vipExpiryDate.value)
const dailySubtitle = computed(() =>
  isVip.value
    ? `当前为VIP版・超级VIP会员将于${vipExpiryText.value}到期`
    : '当前为普通版・VIP每日可额外获取100星钻与100星引'
)
const dailyCheckinButtonLabel = computed(() => (dailyRewardClaimed.value ? '已领取每日奖励' : '领取每日签到奖励'))
const dailyCheckinButtonTone = computed(() => (dailyRewardClaimed.value ? 'muted' : 'primary'))
const dailyCheckinButtonIcon = computed(() => (dailyRewardClaimed.value ? '/static/mall/icon-reward-claimed.png' : ''))

// 每日签到奖励（普通用户）
const dailyRewardsNormal: MallRewardItem[] = [
  { label: '每日可得星引', currency: 'star', value: '+100' }
]

// 每日签到奖励（VIP用户）
const dailyRewardsVip: MallRewardItem[] = [
  { label: '每日可得星钻', currency: 'diamond', value: '+100' },
  { label: '每日可得星引', currency: 'star', value: '额外 +100', highlight: true },
  { label: '即刻获得星钻', currency: 'diamond', value: '+160' }
]

const dailyRewards = computed(() => (isVip.value ? dailyRewardsVip : dailyRewardsNormal))

// VIP额外奖励
const vipRewards: MallRewardItem[] = [
  { label: '每日可得星钻', currency: 'diamond', value: '+100' },
  { label: '每日可得星引', currency: 'star', value: '额外 +100', highlight: true },
  { label: '即刻获得星钻', currency: 'diamond', value: '+160' }
]

// 购买星钻选项
const selectedRechargeId = ref(1)
const rechargeItems: MallRechargeItem[] = [
  { id: 1, amount: 600, bonus: 60, price: 6, stack: 1 },
  { id: 2, amount: 3000, bonus: 300, price: 30, stack: 2 },
  { id: 3, amount: 9800, bonus: 980, price: 98, stack: 3 }
]

// 收支明细标签
const historyTabs: Array<{ label: string; value: HistoryTabValue }> = [
  { label: '全部', value: 'all' },
  { label: '星钻', value: 'diamond' },
  { label: '星引', value: 'star' }
]

const currentHistoryTab = ref<HistoryTabValue>('all')

// 收支明细数据
const historyData: HistoryItem[] = [
  { id: '1', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 100, currency: 'diamond', type: 'diamond' },
  { id: '2', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'star', type: 'star' },
  { id: '3', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '4', title: '限时星引（过期）', time: '2020-20-20 12:12', expireTime: '2020-20-10 12:12', amount: -50, currency: 'star', type: 'star' },
  { id: '5', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '6', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '7', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'star', type: 'star' },
  { id: '8', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '9', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 100, currency: 'star', type: 'star' },
  { id: '10', title: '购买星钻', time: '2020-20-20 12:12', amount: 600, currency: 'diamond', type: 'diamond' },
  { id: '11', title: '兑换星引', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 200, currency: 'star', type: 'star' },
  { id: '12', title: '兑换星引', time: '2020-20-20 12:12', amount: -200, currency: 'diamond', type: 'diamond' },
  { id: '13', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '14', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'star', type: 'star' },
  { id: '15', title: '限时星引（过期）', time: '2020-20-20 12:12', expireTime: '2020-20-10 12:12', amount: -50, currency: 'star', type: 'star' },
  { id: '16', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 100, currency: 'diamond', type: 'diamond' }
]

const filteredHistory = computed(() => {
  if (currentHistoryTab.value === 'all') return historyData
  return historyData.filter((item) => item.type === currentHistoryTab.value)
})

// 兑换弹窗
const exchangeDialogOpen = ref(false)

// 底部按钮
const bottomOptions = [
  { label: '签到奖励', value: 'checkin' },
  { label: '收支明细', value: 'history' }
]

function handleExchangeOpen() {
  exchangeDialogOpen.value = true
}

function handleExchangeConfirm(amount: number) {
  console.log('兑换星引:', amount)
  balances.value.diamond -= amount
  balances.value.star += amount
}

function handleDailyCheckin() {
  if (dailyRewardClaimed.value) return
  console.log('每日签到')
  dailyRewardClaimed.value = true
}

function handleActivateVip() {
  console.log('激活VIP')
}

function handleSelectRecharge(id: number) {
  selectedRechargeId.value = id
  console.log('选择充值套餐:', id)
}

function handleBottomChange(value: string) {
  currentView.value = value as 'checkin' | 'history'
}

function handleHistoryTabChange(value: string) {
  if (value !== 'all' && value !== 'diamond' && value !== 'star') return
  currentHistoryTab.value = value
}

function handleBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.wallet-page {
  position: relative;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  background-image: url('/static/login/page-bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
}

.wallet-page__scroll {
  flex: 1;
  min-height: 0;
}

.wallet-page__content {
  margin: 25rpx 30rpx calc(142rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.1) 100%);
  border-radius: 28rpx;
}

.wallet-section {
  // margin-top: 24rpx;
  padding: 24rpx;
  box-sizing: border-box;
}

.wallet-section--card {
  padding: 32rpx 26rpx 36rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.54);
  box-shadow: 0 14rpx 38rpx rgba(190, 190, 190, 0.08);
}

.wallet-section--vip,
.wallet-section--recharge {
  margin-top: 79rpx;
}

.wallet-section__title {
  display: block;
  color: #111111;
  font-size: 34rpx;
  line-height: 48rpx;
  font-weight: 600;
}

.wallet-section__subtitle {
  display: block;
  margin-top: 15rpx;
  color: #999999;
  font-size: 23rpx;
  line-height: 36rpx;
}

.wallet-divider {
  height: 0;
  margin: 0 8rpx 32rpx;
  border-top: 2rpx dashed rgba(210, 210, 210, 0.78);
}

.wallet-section__reward-grid {
  margin-top: 37rpx;
}

.wallet-section__reward-grid--vip {
  margin-top: 44rpx;
}

.wallet-section :deep(.mall-buy-button--inline) {
  margin: 50rpx auto 0;
}

.wallet-section__vip-button {
  margin-top: 74rpx;
}

.vip-benefits-copy {
  display: block;
  margin: 18rpx 0 70rpx;
  color: #999999;
  font-size: 28rpx;
  line-height: 40rpx;
  text-align: center;
}

.wallet-section__recharge-grid {
  margin-top: 42rpx;
}

// 收支明细
.wallet-history {
  flex: 1;
  min-height: 0;
  padding: 0 30rpx;
  display: flex;
  flex-direction: column;
}

.wallet-history__header {
  padding: 16rpx 0 12rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.wallet-history__tabs {
  flex: 1;
  min-width: 0;
}

.wallet-history__filter {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #999999;
  font-size: 28rpx;
  line-height: 38rpx;
}

.wallet-history__filter-arrow {
  flex: 0 0 37rpx;
  width: 37rpx;
  height: 37rpx;
  opacity: 0.42;
}

.wallet-history__scroll {
  flex: 1;
  min-height: 0;
  margin-bottom: calc(118rpx + env(safe-area-inset-bottom));
}

.wallet-history__list {
  // padding: 8rpx 0 24rpx;
}

.history-item {
  position: relative;
  margin-bottom: 45rpx;
  min-height: 88rpx;
}

.history-item__content {
  display: flex;
  flex-direction: column;
}

.history-item__title {
  color: #333333;
  font-size: 30rpx;
  line-height: 44rpx;
  font-weight: 500;
}

.history-item__meta {
  margin-top: 8rpx;
  color: #333;
  font-size: 23rpx;
  line-height: 36rpx;
  white-space: nowrap;
}

.history-item__amount {
  position: absolute;
  top: 2rpx;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.history-item__amount-text {
  color: #ff667a;
  font-size: 34rpx;
  line-height: 48rpx;
  font-weight: 500;
}

.history-item__amount--negative .history-item__amount-text {
  color: #666666;
}

.wallet-page__bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(env(safe-area-inset-bottom));
  z-index: 5;
  height: 100rpx;
}

.button-hover {
  opacity: 0.82;
}
</style>
