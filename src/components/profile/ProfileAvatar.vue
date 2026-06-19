<template>
  <view class="profile-avatar" :style="avatarStyle" @click="emit('click')">
    <view class="profile-avatar__inner">
      <image v-if="avatarUrl" class="profile-avatar__image" :src="avatarUrl" mode="aspectFill" />
      <wd-icon v-else name="image" :size="iconSize" color="#8aa1ac" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    avatarUrl?: string
    outerSize?: string
    innerSize?: string
    iconSize?: string
  }>(),
  {
    avatarUrl: '',
    outerSize: '127rpx',
    innerSize: '111rpx',
    iconSize: '30rpx'
  }
)

const emit = defineEmits<{
  (event: 'click'): void
}>()

const avatarStyle = computed(() => ({
  '--profile-avatar-outer-size': props.outerSize,
  '--profile-avatar-inner-size': props.innerSize
}))
</script>

<style scoped lang="scss">
.profile-avatar {
  flex: 0 0 var(--profile-avatar-outer-size);
  width: var(--profile-avatar-outer-size);
  height: var(--profile-avatar-outer-size);
  border: 2rpx solid rgba(51, 51, 51, 0.18);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.28);
}

.profile-avatar__inner {
  width: var(--profile-avatar-inner-size);
  height: var(--profile-avatar-inner-size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(217, 217, 217, 0.92);
  overflow: hidden;
}

.profile-avatar__image {
  width: 100%;
  height: 100%;
}
</style>
