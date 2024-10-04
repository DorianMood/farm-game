import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import bcrypt from "bcryptjs";

import { Bed } from "./bed";
import { UserTask } from "./user-task";
import { Inventory } from "./inventory";
import { IdDates } from "./helpers";
import { Barn } from "./barn";
import { UserCharacterEnum } from "../common/enums";

@Entity()
export class User extends IdDates {
  @Column({ nullable: false, unique: true, length: 20 })
  username!: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email!: string;

  @Column({ nullable: false, type: "text", default: "" })
  name!: string;

  @Column({ nullable: true, type: "text", default: null })
  city?: string;

  @Column({ nullable: false, select: false })
  hashPassword!: string;

  @Column({ nullable: false, select: false })
  salt!: string;

  @OneToMany(() => Bed, (bed) => bed.user, {
    cascade: true,
  })
  beds!: Bed[];

  @OneToMany(() => Barn, (barn) => barn.user, {
    cascade: true,
  })
  barns!: Barn[];

  @Column({ nullable: false, default: 0 })
  ballance!: number;

  @OneToMany(() => UserTask, (task) => task.user, {
    cascade: true,
  })
  tasks!: UserTask[];

  @OneToOne(() => Inventory, (inventory) => inventory.user, {
    cascade: true,
  })
  @JoinColumn()
  inventory!: Inventory;

  @Column({
    type: "enum",
    enum: UserCharacterEnum,
    default: UserCharacterEnum.Male,
  })
  character!: UserCharacterEnum;

  setPassword(password: string) {
    this.salt = bcrypt.genSaltSync(12);
    this.hashPassword = bcrypt.hashSync(password, this.salt);
  }

  verifyPassword(password: string) {
    const hash = bcrypt.hashSync(password, this.salt);
    return hash === this.hashPassword;
  }
}
