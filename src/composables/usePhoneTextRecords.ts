import { computed } from 'vue'

export type PhoneTextKind = 'note' | 'diary'

export interface PhoneTextRecord {
  id: string
  kind: PhoneTextKind
  title: string
  content: string
  timeLabel: string
  dateLabel?: string
  weekday?: string
}

const repeatedContent =
  '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。'

const records: PhoneTextRecord[] = [
  {
    id: 'note-2',
    kind: 'note',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '12:12'
  },
  {
    id: 'note-3',
    kind: 'note',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '昨天12:12'
  },
  {
    id: 'note-4',
    kind: 'note',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12'
  },
  {
    id: 'note-5',
    kind: 'note',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12'
  },
  {
    id: 'diary-1',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-2',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-3',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-4',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-5',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-6',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-7',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-8',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-9',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-10',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-11',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-12',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-13',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-14',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  },
  {
    id: 'diary-15',
    kind: 'diary',
    title: '标题标题标题',
    content: repeatedContent,
    timeLabel: '02-02 12:12',
    dateLabel: '02-02 12:12',
    weekday: '星期日'
  }
]

export function usePhoneTextRecords(kind: PhoneTextKind) {
  const list = computed(() => records.filter((item) => item.kind === kind))

  function getById(id: string) {
    return records.find((item) => item.id === id && item.kind === kind) ?? list.value[0]
  }

  return {
    list,
    getById
  }
}
