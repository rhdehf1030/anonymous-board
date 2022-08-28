import { EntityRepository, Repository } from 'typeorm'

import { NotifyKeyword } from '@/entity/notify-keyword.entity'

@EntityRepository(NotifyKeyword)
export class NotifyKeywordRepository extends Repository<NotifyKeyword> {
  /**
   * Get Keyword Notify List
   * @returns All Keyword Notify List
   */
  list = () => {
    const query = this.createQueryBuilder('nk')

    return query.getMany()
  }
}
