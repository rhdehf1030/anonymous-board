export class PostResponse {
  /**
   * Post Id
   */
  id: string
  /**
   * Title
   */
  title: string
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
   * Updated At
   */
  updatedAt: string
}

export class PostListResponse {
  items: PostResponse[]
  total: number
}
