import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Survey } from './survey';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne((type) => Survey, (survey) => survey.questions)
  survey!: Survey;

  @Column({ nullable: false })
  question!: string;

  @Column({ nullable: false })
  answer!: string;
}
