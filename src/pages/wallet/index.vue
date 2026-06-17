<template>
  <view class="wallet-page">
    <AppTopBar variant="title-action" title="钱包" inline-padding="30rpx">
      <template #leading>
        <!-- 开发调试：切换VIP状态 -->
        <button class="debug-vip-toggle" hover-class="button-hover" @click="isVip = !isVip">
          <text>{{ isVip ? 'VIP' : '普通' }}</text>
        </button>
      </template>
      <template #trailing>
        <MallBalancePills :diamond="balances.diamond" :star="balances.star" @exchange="handleExchangeOpen" />
      </template>
    </AppTopBar>

    <!-- 签到奖励视图 -->
    <scroll-view v-if="currentView === 'checkin'" class="wallet-page__scroll" scroll-y>
      <view class="wallet-page__content">
        <!-- 每日签到领取奖励 -->
        <view class="wallet-section wallet-section--daily">
          <text class="wallet-section__title">每日签到领取奖励</text>
          <view class="daily-reward">
            <text class="daily-reward__label">{{ isVip ? 'VIP特权奖励' : '普通用户奖励' }}</text>
            <view class="daily-reward__items">
              <view v-for="item in dailyRewards" :key="item.id" class="daily-reward__item">
                <text v-if="item.label" class="daily-reward__item-label">{{ item.label }}</text>
                <view class="daily-reward__item-amount" :class="{ 'daily-reward__item-amount--bonus': item.isBonus }">
                  <MallCurrencyIcon :type="item.type" size="32rpx" />
                  <text>{{ item.amount }}</text>
                </view>
              </view>
            </view>
          </view>
          <button class="wallet-button wallet-button--primary" hover-class="button-hover" @click="handleDailyCheckin">
            领取奖励
          </button>
        </view>

        <!-- VIP额外奖励 -->
        <view v-if="!isVip" class="wallet-section wallet-section--vip">
          <text class="wallet-section__title">开通VIP，享更多特权</text>
          <text class="wallet-section__subtitle wallet-section__subtitle--center">
            VIP到期时间：{{ vipExpiryText }}
          </text>
          <view class="vip-rewards">
            <view v-for="item in vipRewards" :key="item.id" class="vip-reward__item">
              <text v-if="item.label" class="vip-reward__item-label">{{ item.label }}</text>
              <view class="vip-reward__item-amount" :class="{ 'vip-reward__item-amount--bonus': item.isBonus }">
                <MallCurrencyIcon :type="item.type" size="32rpx" />
                <text>{{ item.amount }}</text>
              </view>
            </view>
          </view>
          <button class="wallet-button wallet-button--vip" hover-class="button-hover" @click="handleActivateVip">
            立即开通VIP
          </button>
        </view>

        <!-- 购买星钻 -->
        <view class="wallet-section wallet-section--recharge">
          <text class="wallet-section__title">购买星钻</text>
          <view class="recharge-grid">
            <view
              v-for="item in rechargeItems"
              :key="item.id"
              class="recharge-item"
              @click="handleSelectRecharge(item.id)"
            >
              <view class="recharge-item__bonus">
                <text>送</text>
                <text class="recharge-item__bonus-value">{{ item.bonus }}</text>
                <MallCurrencyIcon type="diamond" size="24rpx" class="recharge-item__bonus-icon" />
              </view>
              <image class="recharge-item__diamonds" :src="item.image" mode="aspectFit" />
              <text class="recharge-item__total">{{ item.total }}星钻</text>
              <text class="recharge-item__price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 收支明细视图 -->
    <view v-if="currentView === 'history'" class="wallet-history">
      <view class="wallet-history__header">
        <view class="wallet-history__tabs">
          <view
            v-for="tab in historyTabs"
            :key="tab.value"
            class="wallet-history__tab"
            :class="{ 'wallet-history__tab--active': currentHistoryTab === tab.value }"
            @click="currentHistoryTab = tab.value"
          >
            <text>{{ tab.label }}</text>
          </view>
        </view>
        <view class="wallet-history__filter">
          <text>所有</text>
          <text class="wallet-history__filter-arrow">▼</text>
        </view>
      </view>

      <scroll-view class="wallet-history__scroll" scroll-y>
        <view class="wallet-history__list">
          <view v-for="item in filteredHistory" :key="item.id" class="history-item">
            <view class="history-item__content">
              <text class="history-item__title">{{ item.title }}</text>
              <text class="history-item__time">{{ item.time }}</text>
              <text v-if="item.expireTime" class="history-item__expire">（有效期:{{ item.expireTime }}）</text>
            </view>
            <view class="history-item__amount" :class="{ 'history-item__amount--negative': item.amount < 0 }">
              <text class="history-item__amount-text">{{ item.amount > 0 ? '+' : '' }}{{ item.amount }}</text>
              <MallCurrencyIcon :type="item.currency" size="40rpx" />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="wallet-page__bottom">
      <BottomSwitchBar
        :options="bottomOptions"
        :model-value="currentView"
        @change="handleBottomChange"
        @back="handleBack"
      />
    </view>

    <MallExchangeDialog
      v-model="exchangeDialogOpen"
      :max="balances.diamond"
      :default-amount="0"
      @confirm="handleExchangeConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import MallBalancePills from '@/components/mall/MallBalancePills.vue'
import MallCurrencyIcon from '@/components/mall/MallCurrencyIcon.vue'
import MallExchangeDialog from '@/components/mall/MallExchangeDialog.vue'
import BottomSwitchBar from '@/components/BottomSwitchBar.vue'

interface RewardItem {
  id: string
  label?: string
  type: 'diamond' | 'star'
  amount: string
  isBonus?: boolean
}

interface RechargeItem {
  id: string
  bonus: number
  image: string
  total: number
  price: number
}

interface HistoryItem {
  id: string
  title: string
  time: string
  expireTime?: string
  amount: number
  currency: 'diamond' | 'star'
  type: 'all' | 'diamond' | 'star'
}

// 当前视图
const currentView = ref<'checkin' | 'history'>('checkin')

// 用户状态
const isVip = ref(false)

// 余额
const balances = ref({
  diamond: 1230,
  star: 1230
})

// VIP到期时间
const vipExpiryDate = ref('2026/01/01')
const vipExpiryText = computed(() => vipExpiryDate.value)

// 每日签到奖励（普通用户）
const dailyRewardsNormal: RewardItem[] = [
  { id: 'star', type: 'star', amount: '+100' }
]

// 每日签到奖励（VIP用户）
const dailyRewardsVip: RewardItem[] = [
  { id: 'diamond', label: '每日可得星钻', type: 'diamond', amount: '+100' },
  { id: 'star', label: '每日可得星引', type: 'star', amount: '额外 +100', isBonus: true },
  { id: 'star-extra', label: '即刻获得星钻', type: 'diamond', amount: '+160' }
]

const dailyRewards = computed(() => (isVip.value ? dailyRewardsVip : dailyRewardsNormal))

// VIP额外奖励
const vipRewards: RewardItem[] = [
  { id: 'diamond', label: '每日可得星钻', type: 'diamond', amount: '+100' },
  { id: 'star', label: '每日可得星引', type: 'star', amount: '额外 +100', isBonus: true },
  { id: 'star-extra', label: '即刻获得星钻', type: 'diamond', amount: '+160' }
]

// 购买星钻选项
const rechargeItems: RechargeItem[] = [
  { id: 'r1', bonus: 60, image: '/static/mall/recharge-diamond-30.png', total: 600, price: 6 },
  { id: 'r2', bonus: 300, image: '/static/mall/recharge-diamond-98.png', total: 3000, price: 30 },
  { id: 'r3', bonus: 980, image: '/static/mall/recharge-diamond-98.png', total: 9800, price: 98 }
]

// 收支明细标签
const historyTabs = [
  { label: '全部', value: 'all' },
  { label: '星钻', value: 'diamond' },
  { label: '星引', value: 'star' }
]

const currentHistoryTab = ref<'all' | 'diamond' | 'star'>('all')

// 收支明细数据
const historyData: HistoryItem[] = [
  { id: '1', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 100, currency: 'diamond', type: 'diamond' },
  { id: '2', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'star', type: 'star' },
  { id: '3', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '4', title: '限时星引（过期）', time: '2020-20-20 12:12', expireTime: '2020-20-10 12:12', amount: -50, currency: 'star', type: 'star' },
  { id: '5', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '6', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' },
  { id: '7', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'star', type: 'star' },
  { id: '8', title: '签到奖励', time: '2020-20-20 12:12', expireTime: '2020-20-20 12:12', amount: 50, currency: 'diamond', type: 'diamond' }
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
  console.log('每日签到')
}

function handleActivateVip() {
  console.log('激活VIP')
  uni.navigateTo({
    url: '/pages/avatar/index?mode=mall&tab=vip'
  })
}

function handleSelectRecharge(id: string) {
  console.log('选择充值套餐:', id)
}

function handleBottomChange(value: string) {
  currentView.value = value as 'checkin' | 'history'
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
  padding: 0 30rpx calc(118rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.wallet-section {
  margin-top: 30rpx;
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.92);
  box-sizing: border-box;
}

.wallet-section__title {
  display: block;
  color: #333333;
  font-size: 36rpx;
  line-height: 48rpx;
  font-weight: 600;
}

.wallet-section__subtitle {
  display: block;
  margin-top: 8rpx;
  color: #999999;
  font-size: 26rpx;
  line-height: 36rpx;
}

.wallet-section__subtitle--center {
  margin-top: 24rpx;
  text-align: center;
}

// 每日奖励
.daily-reward {
  margin-top: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.daily-reward__label {
  margin-bottom: 16rpx;
  color: #666666;
  font-size: 28rpx;
  line-height: 38rpx;
}

.daily-reward__items {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
}

.daily-reward__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.daily-reward__item-label {
  color: #666666;
  font-size: 24rpx;
  line-height: 32rpx;
  text-align: center;
}

.daily-reward__item-amount {
  color: #ff667a;
  font-size: 32rpx;
  line-height: 42rpx;
  font-weight: 600;
}

.daily-reward__item-amount--bonus {
  color: #ff667a;
  font-weight: 700;
}

// VIP奖励
.vip-rewards {
  margin-top: 32rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.vip-reward__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.vip-reward__item-label {
  min-height: 32rpx;
  color: #666666;
  font-size: 24rpx;
  line-height: 32rpx;
  text-align: center;
}

.vip-reward__item-amount {
  color: #ff667a;
  font-size: 32rpx;
  line-height: 42rpx;
  font-weight: 600;
}

.vip-reward__item-amount--bonus {
  color: #ff667a;
  font-weight: 700;
}

// 充值网格
.recharge-grid {
  margin-top: 32rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.recharge-item {
  flex: 1;
  min-width: 0;
  padding: 20rpx 12rpx 16rpx;
  border-radius: 16rpx;
  border: 2rpx solid #e5e5e5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
}

.recharge-item__bonus {
  width: 100%;
  height: 40rpx;
  margin-bottom: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: #666666;
  font-size: 22rpx;
  line-height: 30rpx;
}

.recharge-item__bonus-value {
  color: #ff667a;
  font-weight: 600;
}

.recharge-item__bonus-icon {
  width: 24rpx;
  height: 24rpx;
}

.recharge-item__diamonds {
  width: 120rpx;
  height: 120rpx;
  margin: 8rpx 0;
}

.recharge-item__total {
  margin-top: 8rpx;
  color: #333333;
  font-size: 28rpx;
  line-height: 38rpx;
  font-weight: 600;
}

.recharge-item__price {
  margin-top: 4rpx;
  color: #ff667a;
  font-size: 32rpx;
  line-height: 42rpx;
  font-weight: 700;
}

// 按钮
.wallet-button {
  width: 100%;
  height: 88rpx;
  margin: 32rpx 0 0;
  padding: 0;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 32rpx;
  line-height: 88rpx;
  font-weight: 600;
  box-sizing: border-box;
}

.wallet-button::after {
  border: 0;
}

.wallet-button--primary {
  background: #ff667a;
}

.wallet-button--vip {
  background: linear-gradient(90deg, #ff667a 0%, #ff8899 100%);
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
  padding: 24rpx 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wallet-history__tabs {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.wallet-history__tab {
  position: relative;
  padding-bottom: 4rpx;
  color: #999999;
  font-size: 32rpx;
  line-height: 44rpx;
  font-weight: 500;
}

.wallet-history__tab--active {
  color: #333333;
  font-weight: 600;
}

.wallet-history__tab--active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 48rpx;
  height: 6rpx;
  border-radius: 3rpx;
  transform: translateX(-50%);
  background: #ff667a;
}

.wallet-history__filter {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #999999;
  font-size: 28rpx;
  line-height: 38rpx;
}

.wallet-history__filter-arrow {
  font-size: 20rpx;
  transform: scale(0.8);
}

.wallet-history__scroll {
  flex: 1;
  min-height: 0;
  margin-bottom: calc(118rpx + env(safe-area-inset-bottom));
}

.wallet-history__list {
  padding: 4rpx 0;
}

.history-item {
  padding: 24rpx 30rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.history-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.history-item__title {
  color: #333333;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: 500;
}

.history-item__time {
  margin-top: 6rpx;
  color: #999999;
  font-size: 24rpx;
  line-height: 34rpx;
}

.history-item__expire {
  color: #999999;
  font-size: 24rpx;
  line-height: 34rpx;
}

.history-item__amount {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.history-item__amount-text {
  color: #ff667a;
  font-size: 36rpx;
  line-height: 48rpx;
  font-weight: 600;
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

// 开发调试按钮
.debug-vip-toggle {
  height: 50rpx;
  margin: 0;
  padding: 0 20rpx;
  border-radius: 25rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24rpx;
  line-height: 50rpx;
  background: #ff667a;
}

.debug-vip-toggle::after {
  border: 0;
}
</style>