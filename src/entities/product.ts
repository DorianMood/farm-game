import { Column, Entity, ManyToMany } from "typeorm";

import { User } from "./user";
import { IdDates } from "./helpers";

@Entity()
export class Product extends IdDates {
  @Column({ nullable: false, unique: false })
  name!: string;

  @Column({ nullable: false, unique: false })
  price!: number;

  @Column({ nullable: false, unique: false })
  picture!: string;

  @Column({ nullable: false, unique: false })
  content!: string;

  @ManyToMany(() => User, (user) => user.products)
  users!: User[];
}
