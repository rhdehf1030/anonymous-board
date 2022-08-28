import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PageLimitDto } from './page-limit.dto'

export enum PostSearchType {
  // eslint-disable-next-line no-unused-vars
  TITLE = 'title',
  // eslint-disable-next-line no-unused-vars
  AUTHOR = 'author'
}

export class PostSearchDto {
  @ApiProperty({
    description: '검색 타입',
    example: 'title'
  })
  @IsEnum(PostSearchType)
  @IsOptional()
  readonly searchType?: PostSearchType

  @ApiProperty({
    description: '검색어',
    example: 'example'
  })
  @IsString()
  @IsOptional()
  readonly search?: string
}

export class PostListDto extends IntersectionType(
  PostSearchDto,
  PageLimitDto
) {}
