import { Logger } from '@nestjs/common'

export type notifyType = 'post' | 'comment'

const logger = new Logger('Notify')

export const notify = (
  author: string,
  keyword: string,
  type: notifyType,
  postId: string
) => {
  logger.log(
    `### Notify to ${author}: keyword ${keyword} uploaded on ${type}, post ID: ${postId} ###`
  )
}
