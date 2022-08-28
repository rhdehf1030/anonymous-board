import { Test } from '@nestjs/testing'
import { NotFoundError } from '../../../error/common'
import { PasswordNotMatch } from '../../../error/post'
import { Post } from '../../../entity/post.entity'
import { PostComment } from '../../../entity/post-comment.entity'
import { NotifyKeyword } from '../../../entity/notify-keyword.entity'
import { PostService } from '../provider/post.service'
import { PostCreateDto } from '../dto/create.dto'
import { PostRepository } from '../repository/post.repository'
import { PostCommentRepository } from '../repository/post-comment.repository'
import { NotifyKeywordRepository } from '../repository/notify-keyword.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy'
import { PostUpdateDto } from '../dto/update.dto'

describe('PostService', () => {
  let postService: PostService

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'better-sqlite3',
            name: uuid(),
            database: ':memory:',
            dropSchema: true,
            entities: [Post, PostComment, NotifyKeyword],
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: true
          })
        }),

        TypeOrmModule.forFeature([
          PostRepository,
          PostCommentRepository,
          NotifyKeywordRepository
        ])
      ],

      providers: [PostService]
    }).compile()

    postService = app.get(PostService)
  })

  it('should be defined', () => {
    expect(postService).toBeDefined()
  })

  const createArgs: PostCreateDto = {
    title: '제목',
    body: '내용',
    author: '작성자',
    password: '비밀번호'
  }

  describe('list', () => {
    it('should list Posts', async () => {
      await Promise.all([
        postService.create(createArgs),
        postService.create(createArgs),
        postService.create(createArgs)
      ])

      const result = await postService.list({ page: 0, limit: 10 })

      expect(result).toBeDefined()
      expect(result.total).toEqual(3)
      expect(result.items).toHaveLength(3)

      expect(result.items[0].title).toEqual(createArgs.title)
      expect(result.items[0].body).toEqual(createArgs.body)
      expect(result.items[0].author).toEqual(createArgs.author)
    })
  })

  describe('create', () => {
    it('should create Posts', async () => {
      const result = await postService.create(createArgs)

      expect(result).toBeDefined()

      expect(result.title).toEqual(createArgs.title)
      expect(result.body).toEqual(createArgs.body)
      expect(result.author).toEqual(createArgs.author)
    })
  })

  describe('update', () => {
    it('should update Posts', async () => {
      const target = await postService.create(createArgs)
      const updateArgs: PostUpdateDto = {
        title: '수정된 제목',
        body: '수정된 내용',
        password: createArgs.password
      }

      const result = await postService.update(target.id, updateArgs)

      expect(result).toBeDefined()

      expect(result.title).toEqual('수정된 제목')
      expect(result.body).toEqual('수정된 내용')

      expect(postService.update('invalid id', updateArgs)).rejects.toEqual(
        NotFoundError
      )
      expect(
        postService.update(target.id, {
          ...updateArgs,
          password: 'invalid password'
        })
      ).rejects.toEqual(PasswordNotMatch)
    })
  })

  describe('delete', () => {
    it('should delete Posts', async () => {
      const target = await postService.create(createArgs)

      expect(target).toBeDefined()

      expect(
        postService.delete('invalid id', createArgs.password)
      ).rejects.toEqual(NotFoundError)
      expect(postService.delete(target.id, 'invalid password')).rejects.toEqual(
        PasswordNotMatch
      )

      await postService.delete(target.id, createArgs.password)

      expect(postService.get(target.id)).rejects.toEqual(NotFoundError)
    })
  })
})
