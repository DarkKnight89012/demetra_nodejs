import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column({ type: 'varchar', length: 1000 })
  description: string;

  @Column()
  password: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    type: 'text',
    nullable: true,
    select: false,
  })
  hashedRefreshToken: string | null;
}
