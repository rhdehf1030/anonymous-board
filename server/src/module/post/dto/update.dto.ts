import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class PostUpdateDto {
  @ApiProperty({
    description: '제목',
    example: 'example title'
  })
  @IsString()
  @MaxLength(100)
  readonly title: string

  @ApiProperty({
    description: '내용',
    example: 'example body'
  })
  @IsString()
  @MaxLength(500)
  readonly body: string

  @ApiProperty({
    description: '비밀번호',
    example: 'p@ssw0rd1!'
  })
  @IsString()
  @MaxLength(100)
  readonly password: string
}
