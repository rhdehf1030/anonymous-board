import { EntityRepository, IsNull, Repository } from 'typeorm'

import { PostComment } from '@/entity/post-comment.entity'
import { PageLimitDto } from '@/module/post/dto/page-limit.dto'
import { PostCommentCreateDto } from '../dto/create-comment.dto'
import { NotFoundError } from '@/error/common'

@EntityRepository(PostComment)
export class PostCommentRepository extends Repository<PostComment> {
  /**
   * Base Query for Get Post Comment
   * @param postId Post Id
   * @returns Post Comment List
   */
  private getBaseQuery = (postId: string) => {
    return this.createQueryBuilder('bc')
      .leftJoinAndMapMany(
        'bc.childs',
        PostComment,
        'bcc',
        'bcc.parent_id = bc.id'
      )
      .where({
        postId,
        parentId: IsNull()
      })
      .orderBy('bc.createdAt', 'ASC')
      .addOrderBy('bcc.createdAt', 'ASC')
  }

  /**
   * Get Post Comment List
   * @param postId Post Id
   * @param params Page, Limit
   * @returns Post Comment List
   */
  list = (postId: string, { page, limit }: PageLimitDto) => {
    const query = this.getBaseQuery(postId).skip(page).take(limit)

    return query.getManyAndCount()
  }

  /**
   * Add Post Comment
   * @param postId Post Id
   * @param param Post Comment Create Dto
   * @returns Post Comment
   */
  add = async (postId: string, param: PostCommentCreateDto) => {
    // check parent exists
    if (param.parentId) {
      const parent = await this.findOne({ id: param.parentId })

      if (!parent) {
        throw NotFoundError
      }
    }

    // create comment
    const post = this.create({
      postId,
      ...param
    })

    return this.save(post)
  }
}
