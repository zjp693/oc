<template>
  <view class="oc-grid-list">
    <wd-empty v-if="!items.length" tip="暂无OC" icon-size="140rpx" />

    <wd-grid
      v-else
      custom-class="oc-grid-list__grid"
      :column="3"
      :gutter="4"
      :border="false"
      :center="false"
      clickable
    >
      <wd-grid-item
        v-for="item in items"
        :key="item.id"
        custom-class="oc-grid-list__item"
        @click="emit('itemClick', item)"
      >
        <OcCard :item="item" />
      </wd-grid-item>
    </wd-grid>
  </view>
</template>

<script setup lang="ts">
import OcCard from './OcCard.vue'
import type { OcItem } from '@/types/oc'

defineProps<{
  items: OcItem[]
}>()

const emit = defineEmits<{
  (event: 'itemClick', item: OcItem): void
}>()
</script>

<style scoped lang="scss">
.oc-grid-list {
  width: 100%;
}

:deep(.oc-grid-list__grid) {
  background: transparent;
}

:deep(.oc-grid-list__item) {
  min-width: 0;
}

:deep(.oc-grid-list__item .wd-grid-item__content) {
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
  background: transparent;
}
</style>
