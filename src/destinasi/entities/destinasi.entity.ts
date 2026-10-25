import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Destinasi {
  @Field(() => Int)
  id!: number;

  @Field()
  nama!: string;

  @Field({ nullable: true })
  deskripsi?: string;

  @Field()
  lokasi!: string;

  @Field(() => Int, { nullable: true })
  harga?: number;
}
