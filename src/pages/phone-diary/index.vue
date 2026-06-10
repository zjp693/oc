<template>
  <PhoneTextListView
    kind="diary"
    title="日记"
    detail-url="/pages/phone-diary-detail/index"
    inline-padding="30rpx"
    card-background="rgba(255, 255, 255, 0.5)"
    content-line-height="43rpx"
  />
</template>

<script setup lang="ts">
import PhoneTextListView from '@/components/phone/PhoneTextListView.vue'
</script>
