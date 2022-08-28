import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req
} from '@nestjs/common'
import {
  ApiBasicAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import { Request } from 'express'
import { PostCreateDto } from '../dto/create.dto'
import { PostListDto } from '../dto/list'
import { PostUpdateDto } from '../dto/update.dto'
import { PostService } from '../provider/post.service'
import { PostListResponse, PostResponse } from '../response/post.response'

@ApiTags('Post')
@Controller({
  path: 'post'
})
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOperation({
    summary: '게시글 목록'
  })
  @ApiOkResponse({
    description: '성공',
    type: PostListResponse
  })
  @Get('/')
  list(@Query() query: PostListDto): Promise<PostListResponse> {
    return this.postService.list(query)
  }

  @ApiOperation({
    summary: '게시글 작성'
  })
  @ApiOkResponse({
    description: '성공',
    type: PostResponse
  })
  @Post('/')
  create(@Body() body: PostCreateDto): Promise<PostResponse> {
    return this.postService.create(body)
  }

  @ApiOperation({
    summary: '게시글 수정'
  })
  @ApiOkResponse({
    description: '성공'
  })
  @Patch('/:postId')
  async update(@Param('postId') postId: string, @Body() body: PostUpdateDto) {
    await this.postService.update(postId, body)
  }

  @ApiOperation({
    summary: '게시글 삭제'
  })
  @ApiBasicAuth()
  @ApiOkResponse({
    description: '성공'
  })
  @Delete('/:postId')
  async delete(@Param('postId') postId: string, @Req() request: Request) {
    const password = Buffer.from(
      request.headers.authorization || '',
      'base64'
    ).toString()

    await this.postService.delete(postId, password!)
  }
}
