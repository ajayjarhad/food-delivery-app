import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((is) => String)
  @Column()
  name: string;

  @Field((is) => Boolean, { nullable: true })
  @Column()
  isGood?: boolean;

  @Field((is) => Boolean, { nullable: true, defaultValue: true })
  @Column({ default: true })
  @IsOptional()
  isVegan?: boolean;

  @Field((is) => String)
  @Column()
  address: string;

  @Field((is) => String)
  @Column()
  ownerName: string;

  @Field((type) => String)
  @Column()
  categoryName: string;
}
