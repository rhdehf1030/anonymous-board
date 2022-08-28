import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PostCommentCreateDto } from '../dto/create-comment.dto'
import { PageLimitDto } from '../dto/page-limit.dto'
import { PostCommentService } from '../provider/post-comment.service'
import {
  PostCommentListResponse,
  PostCommentResponse
} from '../response/post-comment.response'

@ApiTags('Post')
@Controller({
  path: 'post'
})
export class PostCommentController {
  constructor(private postCommentService: PostCommentService) {}

  @ApiOperation({
    summary: '댓글 목록'
  })
  @ApiOkResponse({
    description: '성공',
    type: PostCommentListResponse
  })
  @Get('/:postId/comment')
  list(
    @Param('postId') postId: string,
    @Query() query: PageLimitDto
  ): Promise<PostCommentListResponse> {
    return this.postCommentService.list(postId, query)
  }

  @ApiOperation({
    summary: '댓글 생성'
  })
  @ApiOkResponse({
    description: '성공',
    type: PostCommentResponse
  })
  @Post('/:postId/comment')
  create(
    @Param('postId') postId: string,
    @Body() body: PostCommentCreateDto
  ): Promise<PostCommentResponse> {
    return this.postCommentService.create(postId, body)
  }
}
