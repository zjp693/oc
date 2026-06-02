<template>
  <view class="avatar-frame-grid" :class="`avatar-frame-grid--${mode || 'owned'}`">
    <AvatarFrameCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      :mode="mode"
      :selected="item.id === selectedId"
      @select="emit('select', $event)"
    />
  </view>
</template>

<script setup lang="ts">
import AvatarFrameCard, { type AvatarFrameItem } from './AvatarFrameCard.vue'

defineProps<{
  items: AvatarFrameItem[]
  selectedId?: number
  mode?: 'owned' | 'mall'
}>()

const emit = defineEmits<{
  (event: 'select', id: number): void
}>()
</script>

<style scoped lang="scss">
.avatar-frame-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 25rpx;
  row-gap: 17rpx;
}

.avatar-frame-grid--mall {
  column-gap: 30rpx;
}
</style>
