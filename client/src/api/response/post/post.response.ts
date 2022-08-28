export interface PostResponse {
  id: string
  title: string
  body: string
  author: string
  createdAt: string
  updatedAt: string
}

export interface PostListResponse {
  items: PostResponse[]
  total: number
}
