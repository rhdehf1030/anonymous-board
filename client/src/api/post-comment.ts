import { axiosInstance } from '.'
import { PostCommentCreateDto } from './dto/create-comment.dto'
import { PageLimitDto } from './dto/page-limit.dto'
import {
  PostCommentListResponse,
  PostCommentResponse
} from './response/post/post-comment.response'

export default {
  /**
   * Get Post Comment List
   * @param postId post id
   * @param params page limit
   * @returns post comment list
   */
  list: async (postId: string, params: PageLimitDto) => {
    const res = await axiosInstance.get<PostCommentListResponse>(
      `/post/${postId}/comment`,
      {
        params
      }
    )

    return res.data
  },

  /**
   * Create Post Comment
   * @param postId post id
   * @param params create comment dto
   * @returns post comment
   */
  create: async (postId: string, params: PostCommentCreateDto) => {
    const res = await axiosInstance.post<PostCommentResponse>(
      `/post/${postId}/comment`,
      params
    )

    return res.data
  }
}
