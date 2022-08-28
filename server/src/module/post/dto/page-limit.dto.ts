import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class PageLimitDto {
  @ApiProperty({
    description: '페이지',
    example: 1
  })
  @Transform(({ value, obj }) => {
    let page = parseInt(value)
    page = (page - 1) * obj.limit
    if (page < 0) page = 0

    return page
  })
  @IsNumber()
  readonly page: number

  @ApiProperty({
    description: '페이지 당 건수',
    example: 10
  })
  @IsNumber()
  readonly limit: number
}
