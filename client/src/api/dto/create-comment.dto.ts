export interface PostCommentCreateDto {
  readonly body: string

  readonly author: string
  readonly parentId?: string
}
