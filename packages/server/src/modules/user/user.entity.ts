import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
} from 'typeorm';
import { Role } from 'src/modules/role/role.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string; //姓名

  @Column({ length: 100, unique: true })
  userName: string; //用户名

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 30, default: '' })
  phoneNum: string;

  @Column({ length: 10, default: '' })
  countryCode: string;

  @Column({ length: 100, default: '' })
  comments: string;

  @Column({ length: 200, default: '' })
  avator: string;

  @Column({
    default: true,
  })
  enable: boolean;

  @Column({ default: 0 })
  groupId: number;

  @Column({ default: 1 })
  editorId: number;

  @Column({ length: 48 })
  salt: string;

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
  roles: Role[];

  @BeforeInsert()
  async setPassword(password: string) {
    this.password = await bcrypt.hash(password || this.password, this.salt);
  }
  @BeforeUpdate()
  async updatePassword(password: string) {
    this.password = await bcrypt.hash(password || this.password, this.salt);
  }
}
