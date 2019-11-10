import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text", { nullable: true })
  name: string;

  @Field()
  @Column("text", { nullable: true })
  email: string;

  @Column("text", { nullable: true })
  password: string;
}
