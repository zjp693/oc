export interface CustomAttr {
  id: number
  title: string
  content: string
  placeholder?: boolean
}

export interface CustomGroup {
  id: number
  title: string
  attrs: CustomAttr[]
}
