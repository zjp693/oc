<template>
  <view class="oc-grid-list">
    <wd-empty v-if="!items.length" :tip="emptyTip" icon-size="140rpx" />

    <view
      v-else
      class="oc-grid-list__grid"
    >
      <OcCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="emit('itemClick', item)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import OcCard from './OcCard.vue'
import type { OcItem } from '@/types/oc'

withDefaults(defineProps<{
  items: OcItem[]
  emptyTip?: string
}>(), {
  emptyTip: '暂无OC'
})

const emit = defineEmits<{
  (event: 'itemClick', item: OcItem): void
}>()
</script>

<style scoped lang="scss">
.oc-grid-list {
  width: 100%;
}

.oc-grid-list__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 4rpx;
  row-gap: 13rpx;
}
</style>
