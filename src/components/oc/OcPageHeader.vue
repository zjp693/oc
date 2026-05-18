<template>
  <AppPageHeader
    title="OC"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @search="emit('search', $event)"
    @create="emit('create')"
  />
</template>

<script setup lang="ts">
import AppPageHeader from '@/components/common/AppPageHeader.vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
  (event: 'create'): void
}>()
</script>

