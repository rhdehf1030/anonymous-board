import { Injectable, Logger } from '@nestjs/common'
import { PageLimitDto } from '../dto/page-limit.dto'
import { PostCommentRepository } from '@/module/post/repository/post-comment.repository'
import { PostService } from './post.service'
import { PostCommentCreateDto } from '../dto/create-comment.dto'
import { PostComment } from '@/entity/post-comment.entity'
import {
  PostCommentListResponse,
  PostCommentResponse
} from '../response/post-comment.response'

@Injectable()
export class PostCommentService {
  logger = new Logger(PostCommentService.name)

  constructor(
    private postService: PostService,
    private postCommentRepository: PostCommentRepository
  ) {}

  /**
   * Change PostComment To PostCommentResponse
   * @param postComment Post Comment
   * @returns Post Comment Response
   */
  postCommentConverter = (postComment: PostComment): PostCommentResponse => {
    return {
      id: postComment.id,
      body: postComment.body,
      author: postComment.author,
      createdAt: postComment.createdAt,
      childs:
        postComment.childs?.map((c) => this.postCommentConverter(c)) || null
    }
  }

  /**
   * Get Post Comment List
   * @param postId Post Id
   * @param param Page, Limit
   * @returns Post Comment List
   */
  list = async (
    postId: string,
    param: PageLimitDto
  ): Promise<PostCommentListResponse> => {
    const [comments, total] = await this.postCommentRepository.list(
      postId,
      param
    )
    return {
      items: comments.map((b) => this.postCommentConverter(b)!),
      total
    }
  }

  /**
   * Create Post Comment
   * @param postId Post Id
   * @param param Post Comment Create Dto
   * @returns Post Comment
   */
  create = async (postId: string, param: PostCommentCreateDto) => {
    await this.postService.get(postId)

    const postComment = await this.postCommentRepository.add(postId, param)

    await this.postService.sendNotifyTarget(postComment.body, 'comment', postId)

    return this.postCommentConverter(postComment)
  }
}
