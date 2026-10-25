import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Destinasi } from './entities/destinasi.entity.js';
import { DestinasiService } from './destinasi.service.js'; // Sesuaikan dengan service yang sudah ada

@Resolver(() => Destinasi)
export class DestinasiResolver {
  constructor(private readonly destinasiService: DestinasiService) {}

  @Query(() => [Destinasi], { name: 'destinasi' })
  findAll() {
    return this.destinasiService.findAll(); // Sesuaikan dengan method di service Anda
  }

  @Query(() => Destinasi, { name: 'destinasiById' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.destinasiService.findOne(id); // Sesuaikan dengan method di service Anda
  }
}