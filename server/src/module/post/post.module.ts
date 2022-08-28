import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostCommentController } from './controller/post-comment.controller'
import { PostController } from './controller/post.controller'
import { PostCommentService } from './provider/post-comment.service'
import { PostService } from './provider/post.service'
import { PostCommentRepository } from '@/module/post/repository/post-comment.repository'
import { PostRepository } from '@/module/post/repository/post.repository'
import { NotifyKeywordRepository } from '@/module/post/repository/notify-keyword.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      PostCommentRepository,
      NotifyKeywordRepository
    ])
  ],
  providers: [PostService, PostCommentService],
  controllers: [PostController, PostCommentController]
})
export class PostModule {}
