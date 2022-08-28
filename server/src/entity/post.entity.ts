import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { name: 'title', length: 100, comment: '제목' })
  title: string

  @Column('varchar', { name: 'body', length: 500, comment: '내용' })
  body: string

  @Column('varchar', { name: 'author', length: 100, comment: '작성자' })
  author: string

  @Column('varchar', { name: 'password', length: 100, comment: '비밀번호' })
  password: string

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
