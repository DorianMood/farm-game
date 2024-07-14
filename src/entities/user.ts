import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";
import bcrypt from "bcryptjs";

import { Bed } from "./bed";
import { UserTask } from "./user-task";
import { Product } from "./product";
import { Inventory } from "./inventory";
import { IdDates } from "./helpers";

@Entity()
export class User extends IdDates {
  @Column({ nullable: false, unique: true, length: 20 })
  username!: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email!: string;

  @Column({ nullable: false, select: false })
  hashPassword!: string;

  @Column({ nullable: false, select: false })
  salt!: string;

  @OneToMany(() => Bed, (bed) => bed.user, {
    cascade: true,
  })
  beds!: Bed[];

  @Column({ nullable: false, default: 0 })
  ballance!: number;

  @OneToMany(() => UserTask, (task) => task.user, {
    cascade: true,
  })
  tasks!: UserTask[];

  @ManyToMany(() => Product, (product) => product.users, {
    cascade: true,
  })
  products!: Product[];

  @OneToOne(() => Inventory, (inventory) => inventory.user, {
    cascade: true,
  })
  @JoinColumn()
  inventory!: Inventory;

  setPassword(password: string) {
    this.salt = bcrypt.genSaltSync(12);
    this.hashPassword = bcrypt.hashSync(password, this.salt);
  }

  verifyPassword(password: string) {
    const hash = bcrypt.hashSync(password, this.salt);
    return hash === this.hashPassword;
  }
}
