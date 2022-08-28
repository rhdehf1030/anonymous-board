import { EntityRepository, Repository } from 'typeorm'

import { Post } from '@/entity/post.entity'
import { PostCreateDto } from '@/module/post/dto/create.dto'
import { NotFoundError } from '@/error/common'
import { comparePassword, encryptPassword } from '../util/password'
import { PasswordNotMatch } from '@/error/post'
import { PostUpdateDto } from '../dto/update.dto'
import { PostListDto } from '../dto/list'

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  /**
   * Get Post List
   * @returns Post List
   */
  private getBaseQuery = () => {
    return this.createQueryBuilder('b').orderBy('b.created_at', 'DESC')
  }

  /**
   * Get Post List
   * @param param Page, Limit
   * @returns Post List
   */
  list = ({ page, limit, searchType, search }: PostListDto) => {
    const query = this.getBaseQuery().skip(page).take(limit)

    // if search query exists
    if (searchType && search) {
      query.andWhere(`b.${searchType} LIKE :search`, { search: `%${search}%` })
    }

    return query.getManyAndCount()
  }

  /**
   * Get Post Detail
   * @param postId Post Id
   * @returns Post
   */
  get = (postId: string) => {
    const query = this.getBaseQuery().where({ id: postId })

    return query.getOne()
  }

  /**
   * Add Post
   * @param param Post Create Dto
   * @returns Post
   */
  add = (param: PostCreateDto) => {
    // create post with encrypted password
    const post = this.create({
      ...param,
      password: encryptPassword(param.password)
    })

    // create post
    return this.save(post)
  }

  /**
   * Update Post
   * @param postId Post Id
   * @param param Post Create Dto
   * @returns Post
   */
  patch = async (postId: string, param: PostUpdateDto) => {
    // get target post
    const targetPost = await this.get(postId)

    if (!targetPost) {
      throw NotFoundError
    }

    const { password, ...saveParam } = param

    // compare password
    if (!comparePassword(password, targetPost.password)) {
      throw PasswordNotMatch
    }

    // update post
    return this.save({
      ...targetPost,
      ...saveParam
    })
  }

  /**
   * Delete Post
   * @param postId Post Id
   * @param password Password
   * @returns Post
   */
  erase = async (postId: string, password: string) => {
    // get target post
    const targetPost = await this.get(postId)

    if (!targetPost) {
      throw NotFoundError
    }

    // compare password
    if (!comparePassword(password, targetPost.password)) {
      throw PasswordNotMatch
    }

    // delete post
    return this.delete({
      id: postId
    })
  }
}
