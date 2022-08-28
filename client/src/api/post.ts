import { axiosInstance } from '.'
import { PostCreateDto } from './dto/create.dto'
import { PostListDto } from './dto/post-list.dto'
import { PostUpdateDto } from './dto/update.dto'
import { PostListResponse, PostResponse } from './response/post/post.response'

export default {
  /**
   * 게시판 목록 조회
   * @param params Page, Limit
   * @returns Post List Response
   */
  list: async (params: PostListDto) => {
    const res = await axiosInstance.get<PostListResponse>('/post', {
      params
    })

    return res.data
  },

  /**
   * 게시판 상세 조회
   * @param params 게시판 생성 DTO
   * @returns Post Response
   */
  create: async (params: PostCreateDto) => {
    const res = await axiosInstance.post<PostResponse>('/post', params)

    return res.data
  },

  /**
   * 게시판 수정
   * @param postId 게시판 ID
   * @param params 게시판 생성 DTO
   * @returns Post Response
   */
  update: async (postId: string, params: PostUpdateDto) => {
    const res = await axiosInstance.patch<PostResponse>(
      `/post/${postId}`,
      params
    )

    return res.data
  },

  /**
   * 게시판 삭제
   * @param postId 게시판 ID
   * @param password 게시판 비밀번호
   * @returns Post Response
   */
  delete: async (postId: string, password: string) => {
    const res = await axiosInstance.delete<void>(`/post/${postId}`, {
      headers: {
        Authorization: window.btoa(password)
      }
    })

    return res.data
  }
}
