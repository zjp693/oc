export type MessageIconType = 'follow' | 'system' | 'user' | 'oc'
export type MessageConversationType = 'user' | 'oc'
export type ChatMessageSender = 'me' | 'other'
export type ChatMessageStatus = 'sending' | 'sent' | 'failed'

export interface MessageListItem {
  id: string | number
  title: string
  summary: string
  date: string
  unread?: number
  iconType?: MessageIconType
  conversationType?: MessageConversationType
}

export interface ChatMessage {
  id: string
  clientId?: string
  sender: ChatMessageSender
  content: string
  createdAt: number
  status: ChatMessageStatus
}
