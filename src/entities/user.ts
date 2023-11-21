import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';

import { Bed } from './bed';
import { UserTask } from './user-task';
import { Product } from './product';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @Column({ nullable: false, unique: true, length: 20 })
  username!: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email!: string;

  @Column({ nullable: false, select: false })
  hashPassword!: string;

  @Column({ nullable: false, select: false })
  salt!: string;

  @OneToMany(() => Bed, (bed) => bed.user)
  beds!: Bed[];

  @Column({ nullable: false, default: 0 })
  ballance!: number;

  @OneToMany(() => UserTask, (task) => task.user)
  tasks!: UserTask[];

  @ManyToMany(() => Product)
  @JoinTable()
  products!: Product[];

  setPassword(password: string) {
    this.salt = bcrypt.genSaltSync(12);
    this.hashPassword = bcrypt.hashSync(password, this.salt);
  }

  verifyPassword(password: string) {
    const hash = bcrypt.hashSync(password, this.salt);
    return hash === this.hashPassword;
  }
}
