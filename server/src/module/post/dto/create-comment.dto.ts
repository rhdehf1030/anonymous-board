import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

export class PostCommentCreateDto {
  @ApiProperty({
    description: '댓글 parent ID',
    example: 'a0afb970-a229-4b0c-b796-909dd7bfca01'
  })
  @IsUUID('4')
  @IsOptional()
  readonly parentId?: string

  @ApiProperty({
    description: '내용',
    example: 'example body'
  })
  @IsString()
  @MaxLength(500)
  readonly body: string

  @ApiProperty({
    description: '작성자',
    example: 'example author'
  })
  @IsString()
  @MaxLength(100)
  readonly author: string
}
