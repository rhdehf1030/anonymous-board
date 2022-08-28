import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('post_comment')
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', {
    name: 'parent_id',
    length: 36,
    nullable: true,
    comment: '부모 댓글 ID'
  })
  parentId: string

  @Column('varchar', { name: 'feed_id', length: 36, comment: '게시글 ID' })
  postId: string

  @Column('varchar', { name: 'body', length: 500, comment: '내용' })
  body: string

  @Column('varchar', { name: 'author', length: 100, comment: '작성자' })
  author: string

  @CreateDateColumn()
  createdAt: string

  @OneToMany(() => PostComment, (postComment) => postComment.parent, {
    createForeignKeyConstraints: false
  })
  childs: PostComment[] | null

  @ManyToOne(() => PostComment, (postComment) => postComment.childs, {
    createForeignKeyConstraints: false
  })
  parent: PostComment | null
}
