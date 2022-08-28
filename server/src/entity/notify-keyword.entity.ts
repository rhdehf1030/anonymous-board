import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('notify_keyword')
export class NotifyKeyword {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { name: 'author', length: 100, comment: '작성자' })
  author: string

  @Column('varchar', { name: 'keyword', length: 100, comment: '키워드' })
  keyword: string
}
