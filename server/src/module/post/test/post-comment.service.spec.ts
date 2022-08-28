import { Test } from '@nestjs/testing'
import { NotFoundError } from '../../../error/common'
import { Post } from '../../../entity/post.entity'
import { PostComment } from '../../../entity/post-comment.entity'
import { NotifyKeyword } from '../../../entity/notify-keyword.entity'
import { PostCommentService } from '../provider/post-comment.service'
import { PostCreateDto } from '../dto/create.dto'
import { PostRepository } from '../repository/post.repository'
import { PostCommentRepository } from '../repository/post-comment.repository'
import { NotifyKeywordRepository } from '../repository/notify-keyword.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { SnakeNamingStrategy } from 'typeorm-snake-naming-strategy'
import { PostResponse } from '../response/post.response'
import { PostService } from '../provider/post.service'
import { PostCommentCreateDto } from '../dto/create-comment.dto'

describe('PostCommentService', () => {
  let postService: PostService
  let postCommentService: PostCommentService
  let targetPost: PostResponse

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

      providers: [PostService, PostCommentService]
    }).compile()

    postService = app.get(PostService)
    postCommentService = app.get(PostCommentService)

    const postCreateArgs: PostCreateDto = {
      title: '제목',
      body: '내용',
      author: '작성자',
      password: '비밀번호'
    }
    targetPost = await postService.create(postCreateArgs)
  })

  it('should be defined', () => {
    expect(postCommentService).toBeDefined()
  })

  const createArgs: PostCommentCreateDto = {
    body: '내용',
    author: '작성자'
  }

  describe('list', () => {
    it('should list Post Comments', async () => {
      await Promise.all([
        postCommentService.create(targetPost.id, createArgs),
        postCommentService.create(targetPost.id, createArgs),
        postCommentService.create(targetPost.id, createArgs)
      ])

      const result = await postCommentService.list(targetPost.id, {
        page: 0,
        limit: 10
      })

      expect(result).toBeDefined()
      expect(result.total).toEqual(3)
      expect(result.items).toHaveLength(3)

      expect(result.items[0].body).toEqual(createArgs.body)
      expect(result.items[0].author).toEqual(createArgs.author)
    })
  })

  describe('create', () => {
    it('should create Post Comments', async () => {
      const result = await postCommentService.create(targetPost.id, createArgs)

      expect(result).toBeDefined()

      expect(result.body).toEqual(createArgs.body)
      expect(result.author).toEqual(createArgs.author)

      expect(() =>
        postCommentService.create('invalid id', createArgs)
      ).rejects.toEqual(NotFoundError)
    })
  })

  describe('create child', () => {
    it('should create Post Comments with Parent', async () => {
      const target = await postCommentService.create(targetPost.id, createArgs)
      await postCommentService.create(targetPost.id, {
        ...createArgs,
        parentId: target.id
      })

      const result = await postCommentService.list(targetPost.id, {
        page: 0,
        limit: 10
      })

      expect(result).toBeDefined()
      expect(result.total).toEqual(1)
      expect(result.items).toHaveLength(1)
      expect(result.items[0].childs).toHaveLength(1)

      const child = result.items[0].childs![0]

      expect(child.body).toEqual(createArgs.body)
      expect(child.author).toEqual(createArgs.author)

      expect(() =>
        postCommentService.create(targetPost.id, {
          ...createArgs,
          parentId: 'invalid id'
        })
      ).rejects.toEqual(NotFoundError)
    })
  })
})
