import { Post } from '@/entity/post.entity'
import { Injectable, Logger } from '@nestjs/common'
import { PostCreateDto } from '../dto/create.dto'

import { PostRepository } from '@/module/post/repository/post.repository'
import { NotifyKeywordRepository } from '@/module/post/repository/notify-keyword.repository'
import { PostListResponse, PostResponse } from '../response/post.response'
import { notify, notifyType } from '../util/notify'
import { NotFoundError } from '@/error/common'
import { PostUpdateDto } from '../dto/update.dto'
import { PostListDto } from '../dto/list'

@Injectable()
export class PostService {
  logger = new Logger(PostService.name)

  constructor(
    private postRepository: PostRepository,
    private notifyKeywordRepository: NotifyKeywordRepository
  ) {}

  /**
   * Change Post To PostResponse
   * @param post Post
   * @returns Post Response
   */
  private postConverter = (post: Post): PostResponse => {
    return {
      id: post.id,
      title: post.title,
      body: post.body,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }
  }

  /**
   * Get Post List
   * @param param Page, Limit
   * @returns Post List
   */
  list = async (param: PostListDto): Promise<PostListResponse> => {
    const [posts, total] = await this.postRepository.list(param)
    return {
      items: posts.map((b) => this.postConverter(b)!),
      total
    }
  }

  /**
   * Get Post
   * @param postId Post Id
   * @returns Post
   */
  get = async (postId: string) => {
    const post = await this.postRepository.get(postId)

    if (!post) {
      throw NotFoundError
    }

    return this.postConverter(post)
  }

  /**
   * Create Post
   * @param param Post Create Dto
   * @returns Post
   */
  create = async (param: PostCreateDto) => {
    const post = await this.postRepository.add(param)

    await this.sendNotifyTarget(post.body, 'post', post.id)

    return this.postConverter(post)!
  }

  /**
   * Update Post
   * @param postId Post Id
   * @param param Post Create Dto
   * @returns Post
   */
  update = async (postId: string, param: PostUpdateDto) => {
    const post = await this.postRepository.patch(postId, param)

    return this.postConverter(post)!
  }

  /**
   * Delete Post
   * @param postId Post Id
   * @param pasword Password
   * @returns Post
   */
  delete = (postId: string, pasword: string) => {
    return this.postRepository.erase(postId, pasword)
  }

  /**
   * Send Keyword Notify to Target Author
   * @param body Body for Check Keyword
   * @param notifyTo Notify Target Author
   * @param postId Post Id
   */
  sendNotifyTarget = async (
    body: string,
    notifyTo: notifyType,
    postId: string
  ) => {
    // get notify keyword list
    const notifyTarget = await this.notifyKeywordRepository.list()

    // get distinct keyword list
    const keyword = new Set(notifyTarget.map((n) => n.keyword))

    // filter body includes keyword
    const targetKeywords = Array.from(keyword).filter((k) => body.includes(k))

    // send notify to target author
    notifyTarget
      // filter target author
      .filter((n) => targetKeywords.some((tk) => tk === n.keyword))
      // send notify
      .forEach((n) => {
        notify(n.author, n.keyword, notifyTo, postId)
      })
  }
}
