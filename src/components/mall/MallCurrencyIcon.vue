<template>
  <image
    class="mall-currency-icon"
    :class="`mall-currency-icon--${type}`"
    :src="iconSrc"
    :style="{ '--mall-currency-size': size }"
    mode="aspectFit"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type: 'diamond' | 'star'
    size?: string
  }>(),
  {
    size: '28rpx'
  }
)

const iconSrc = computed(() =>
  props.type === 'diamond' ? '/static/mall/icon-diamond.png' : '/static/mall/icon-star.png'
)
</script>

<style scoped lang="scss">
.mall-currency-icon {
  flex: 0 0 var(--mall-currency-size);
  width: var(--mall-currency-size);
  height: var(--mall-currency-size);
  display: inline-block;
}
</style>
