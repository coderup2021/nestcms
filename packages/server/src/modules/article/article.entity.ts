import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Cate as CateEntity } from 'src/modules/cate/cate.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  content: string;

  @Column('text')
  description: string;

  @Column({ length: 255, default: '' })
  picture: string;

  @Column()
  editorType: number; //编辑器类型，1:markdown, 2:WangEditor

  @Column()
  cateId: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: Date;

  @ManyToOne(() => CateEntity, (cateEntity) => cateEntity.articles)
  cate: CateEntity;
}
