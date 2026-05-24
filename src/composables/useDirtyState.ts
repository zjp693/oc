import { computed, ref } from 'vue'

type DirtyStateMode = 'filled' | 'changed'
type ActionTone = 'primary' | 'soft'

interface DirtyStateOptions<T> {
  mode?: DirtyStateMode
  isFilled?: (value: T) => boolean
  serialize?: (value: T) => string
}

export function useDirtyState<T>(getValue: () => T, options: DirtyStateOptions<T> = {}) {
  const mode = options.mode ?? 'changed'
  const serialize = options.serialize ?? serializeValue
  const initialSnapshot = ref(serialize(getValue()))
  const currentValue = computed(getValue)

  const isFilled = computed(() => {
    if (options.isFilled) return options.isFilled(currentValue.value)
    return defaultIsFilled(currentValue.value)
  })

  const isDirty = computed(() => {
    if (mode === 'filled') return isFilled.value
    return serialize(currentValue.value) !== initialSnapshot.value
  })

  const canSubmit = computed(() => (mode === 'filled' ? isFilled.value : isDirty.value))
  const actionTone = computed<ActionTone>(() => (canSubmit.value ? 'primary' : 'soft'))

  function markClean() {
    initialSnapshot.value = serialize(currentValue.value)
  }

  return {
    isDirty,
    canSubmit,
    actionTone,
    markClean
  }
}

function defaultIsFilled(value: unknown) {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined
}

function serializeValue(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value)
}
