import { computed, inject, provide, shallowRef, type ComputedRef, type InjectionKey } from 'vue'

export interface InteractionGateBlocker {
  key: string
  priority?: number
  active: () => boolean
  consume: () => void
}

export interface InteractionGate {
  register: (blocker: InteractionGateBlocker) => () => void
  consume: () => boolean
  hasActiveBlocker: ComputedRef<boolean>
}

interface RegisteredBlocker extends InteractionGateBlocker {
  order: number
  priority: number
}

const interactionGateKey: InjectionKey<InteractionGate> = Symbol('interaction-gate')

export function createInteractionGate(): InteractionGate {
  const blockers = shallowRef<RegisteredBlocker[]>([])
  let nextOrder = 0

  const hasActiveBlocker = computed(() => blockers.value.some((blocker) => blocker.active()))

  function register(blocker: InteractionGateBlocker) {
    const registeredBlocker: RegisteredBlocker = {
      ...blocker,
      priority: blocker.priority ?? 0,
      order: nextOrder
    }
    nextOrder += 1
    blockers.value = [...blockers.value, registeredBlocker]

    return () => {
      blockers.value = blockers.value.filter((item) => item !== registeredBlocker)
    }
  }

  function consume() {
    const activeBlocker = [...blockers.value]
      .sort((left, right) => right.priority - left.priority || left.order - right.order)
      .find((blocker) => blocker.active())

    if (!activeBlocker) return false

    activeBlocker.consume()
    return true
  }

  return {
    register,
    consume,
    hasActiveBlocker
  }
}

export function provideInteractionGate(gate: InteractionGate) {
  provide(interactionGateKey, gate)
}

export function useInteractionGate() {
  return inject(interactionGateKey, createInteractionGate())
}
