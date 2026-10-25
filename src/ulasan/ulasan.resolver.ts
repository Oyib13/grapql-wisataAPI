import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUlasanInput } from './dto/create-ulasan.input.js';
import { UpdateUlasanInput } from './dto/update-ulasan.input.js';
import { Ulasan } from './entities/ulasan.entity.js';
import { UlasanService } from './ulasan.service.js';

@Resolver(() => Ulasan)
export class UlasanResolver {
  constructor(private readonly ulasanService: UlasanService) {}

  @Query(() => [Ulasan], { name: 'ulasan' })
  findAll(
    @Args('destinasiId', { type: () => Int, nullable: true })
    destinasiId?: number,
  ) {
    return this.ulasanService.findAll(destinasiId);
  }

  @Query(() => Ulasan, { name: 'ulasanById' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ulasanService.findOne(id);
  }

  @Mutation(() => Ulasan)
  createUlasan(@Args('input') input: CreateUlasanInput) {
    return this.ulasanService.create(input);
  }

  @Mutation(() => Ulasan)
  updateUlasan(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUlasanInput,
  ) {
    return this.ulasanService.update(id, input);
  }

  @Mutation(() => Boolean)
  removeUlasan(@Args('id', { type: () => Int }) id: number) {
    return this.ulasanService.remove(id);
  }
}
