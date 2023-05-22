import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from 'src/modules/role/role.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  langKey: string;

  @Column({ length: 100, default: '' })
  url: string;

  @Column({ length: 20, default: 'GET' })
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

  @Column()
  parentId: number;

  @Column({ length: 100 })
  path: string;

  @Column({ default: 1 })
  type: number; // 1:目录 2:操作和功能

  @Column({ default: 1 })
  order: number; // 1:目录 2:操作和功能

  @Column()
  show: boolean; // 1:目录 2:操作和功能

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

  @ManyToMany(() => Role)
  @JoinTable()
  admins: Role[];
}
