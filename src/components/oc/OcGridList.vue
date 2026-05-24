<template>
  <view class="oc-grid-list">
    <wd-empty v-if="!items.length" :tip="emptyTip" icon-size="140rpx" />

    <view
      v-else
      class="oc-grid-list__grid"
      :style="gridStyle"
    >
      <OcCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :cover-ratio="coverRatio"
        :description-lines="descriptionLines"
        @click="emit('itemClick', item)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OcCard from './OcCard.vue'
import type { OcItem } from '@/types/oc'

const props = withDefaults(defineProps<{
  items: OcItem[]
  emptyTip?: string
  columns?: number
  columnGap?: string
  rowGap?: string
  coverRatio?: string
  descriptionLines?: number
}>(), {
  emptyTip: '暂无OC',
  columns: 3,
  columnGap: '4rpx',
  rowGap: '13rpx',
  coverRatio: '1 / 1',
  descriptionLines: 1
})

const emit = defineEmits<{
  (event: 'itemClick', item: OcItem): void
}>()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
  columnGap: props.columnGap,
  rowGap: props.rowGap
}))
</script>

<style scoped lang="scss">
.oc-grid-list {
  width: 100%;
}

.oc-grid-list__grid {
  display: grid;
}
</style>
