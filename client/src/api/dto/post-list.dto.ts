export enum PostSearchType {
  // eslint-disable-next-line no-unused-vars
  TITLE = 'title',
  // eslint-disable-next-line no-unused-vars
  AUTHOR = 'author'
}

export interface PostListDto {
  readonly searchType?: PostSearchType
  readonly search?: string
  readonly page: number
  readonly limit: number
}
