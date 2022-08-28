export interface PostCommentResponse {
  id: string
  body: string
  author: string
  createdAt: string
  childs: PostCommentResponse[] | null
}

export interface PostCommentListResponse {
  items: PostCommentResponse[]
  total: number
}
