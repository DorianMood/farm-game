import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

export enum CropEnum {
  Carrot,
  Potato,
  Beet,
  Wheat,
  Flower,
}

@Entity()
export class Bed {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  index!: number;

  @ManyToOne((type) => User, (user) => user.beds)
  user!: User;

  @Column({ type: 'timestamptz', nullable: true })
  plantedAt!: string | null;

  @Column({ nullable: false, unique: false })
  content!: string;

  @Column({
    type: 'enum',
    enum: CropEnum,
    default: CropEnum.Carrot,
  })
  crop!: string;
}
