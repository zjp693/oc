<template>
  <scroll-view class="message-list" scroll-y>
    <view class="message-list__inner">
      <MessageItem
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :summary="item.summary"
        :date="item.date"
        :unread="item.unread"
        :icon-type="item.iconType"
        @click="emit('item-click', item)"
      />
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import MessageItem from '@/components/message/MessageItem.vue'
import type { MessageListItem } from '@/types/message'

defineProps<{
  items: MessageListItem[]
}>()

const emit = defineEmits<{
  (event: 'item-click', item: MessageListItem): void
}>()
</script>

<style scoped lang="scss">
.message-list {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
}

.message-list__inner {
  // padding: 4rpx 0 18rpx;
  box-sizing: border-box;
}
</style>
