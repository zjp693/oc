export interface ManuscriptItem {
  id: number
  title: string
  chapters: number
  words: string
  editedAt: string
}

export interface ManuscriptChapter {
  id: number
  title: string
  order: number
  words: string
  editedAt: string
}

