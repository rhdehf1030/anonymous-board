export class PostCommentResponse {
  /**
   * Comment Id
   */
  id: string
  /**
   * Body
   */
  body: string
  /**
   * Author
   */
  author: string
  /**
   * Created At
   */
  createdAt: string
  /**
   * Child Comments
   */
  childs: PostCommentResponse[] | null
}

export class PostCommentListResponse {
  items: PostCommentResponse[]
  total: number
}
