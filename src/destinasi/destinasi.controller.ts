import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DestinasiService } from './destinasi.service.js';
import { CreateDestinasiDto } from './dto/create-destinasi.dto.js';
import { UpdateDestinasiDto } from './dto/update-destinasi.dto.js';

@Controller('destinasi')
@ApiTags('Destinasi')
export class DestinasiController {
  constructor(private readonly destinasiService: DestinasiService) {}

  @Get()
  @ApiOperation({ summary: 'Menampilkan daftar destinasi' })
  @ApiQuery({
    name: 'kategori',
    required: false,
    description: 'Filter destinasi berdasarkan kategori',
  })
  @ApiOkResponse({ description: 'Daftar destinasi berhasil diambil.' })
  findAll(@Query('kategori') kategori?: string) {
    return this.destinasiService.findAll(kategori);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Menampilkan detail destinasi' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Detail destinasi berhasil diambil.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.destinasiService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Menambahkan destinasi' })
  @ApiCreatedResponse({ description: 'Destinasi berhasil dibuat.' })
  create(@Body() dto: CreateDestinasiDto) {
    return this.destinasiService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui destinasi' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Destinasi berhasil diperbarui.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDestinasiDto,
  ) {
    return this.destinasiService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Menghapus destinasi' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Destinasi berhasil dihapus.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.destinasiService.remove(id);
  }
}