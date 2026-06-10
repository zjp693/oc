import { ref } from 'vue'

export interface PhoneContact {
  id: string
  name: string
  group: string
  avatar?: string
}

const contacts = ref<PhoneContact[]>([
  { id: 'oc-a-1', name: 'OC昵称昵称', group: 'A' },
  { id: 'oc-a-2', name: 'OC昵称昵称', group: 'A' },
  { id: 'oc-b-1', name: 'OC昵称昵称', group: 'B' },
  { id: 'oc-b-2', name: 'OC昵称昵称', group: 'B' }
])

const candidates = ref<PhoneContact[]>([
  { id: 'oc-a-1', name: 'OC昵称昵称', group: 'A' },
  { id: 'oc-a-2', name: 'OC昵称昵称', group: 'A' },
  { id: 'oc-c-1', name: 'OC名称名称名称', group: 'C' },
  { id: 'oc-c-2', name: 'OC名称名称名称', group: 'C' },
  { id: 'oc-d-1', name: 'OC名称名称名称', group: 'D' }
])

export function usePhoneContacts() {
  function removeContact(id: string) {
    contacts.value = contacts.value.filter((item) => item.id !== id)
  }

  function addContacts(ids: string[]) {
    const existedIds = new Set(contacts.value.map((item) => item.id))
    const nextItems = candidates.value.filter((item) => ids.includes(item.id) && !existedIds.has(item.id))
    contacts.value = [...contacts.value, ...nextItems]
    return nextItems.length
  }

  function hasContact(id: string) {
    return contacts.value.some((item) => item.id === id)
  }

  return {
    contacts,
    candidates,
    addContacts,
    removeContact,
    hasContact
  }
}
