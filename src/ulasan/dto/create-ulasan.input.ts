import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';

@InputType()
export class CreateUlasanInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  destinasiId!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @Field()
  @IsString()
  @Length(1, 191)
  komentar!: string;
}
