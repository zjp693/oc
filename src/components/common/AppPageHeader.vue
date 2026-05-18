<template>
  <AppTopBar
    variant="search"
    :title="title"
    :model-value="modelValue"
    :placeholder="placeholder"
    :action-text="createText"
    :inline-padding="inlinePadding"
    @update:model-value="emit('update:modelValue', $event)"
    @search="emit('search', $event)"
    @action="emit('create')"
  />
</template>

<script setup lang="ts">
import AppTopBar from '@/components/common/AppTopBar.vue'

withDefaults(
  defineProps<{
    title: string
    modelValue: string
    placeholder?: string
    createText?: string
    inlinePadding?: string
  }>(),
  {
    placeholder: '请输入',
    createText: '创建',
    inlinePadding: '28rpx'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
  (event: 'create'): void
}>()
</script>
