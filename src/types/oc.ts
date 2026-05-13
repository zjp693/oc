export type OcStatus = 'reviewing' | 'rejected' | 'normal'

export interface OcItem {
  id: number
  title: string
  description: string
  coverUrl?: string
  status?: OcStatus
  locked?: boolean
}
