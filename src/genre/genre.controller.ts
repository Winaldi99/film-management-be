import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
  } from '@nestjs/common';
  import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
  import { CreateGenreDTO } from './create-genre.dto'; // <-- Ganti nama file dan class DTO
  import { GenreService } from './genre.service'; // <-- Ganti nama service
  import { Genre } from './genre.entity'; // <-- Ganti nama entity
  import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'; // <-- ApiTags ditambahkan untuk kejelasan di Swagger UI
  
  @ApiTags('Genre') // <-- Tambahkan tag untuk Swagger
  @Controller('genre') // <-- Ganti route controller
  export class GenreController { // <-- Ganti nama class controller
    constructor(private readonly genreService: GenreService) {} // <-- Ganti nama service dan variabel
  
    @Post()
    async create(@Req() request: Request, @Body() createGenreDTO: CreateGenreDTO) { // <-- Ganti tipe dan nama DTO
      const genre: Genre = new Genre(); // <-- Ganti tipe dan nama variabel entity
      const userJwtPayload: JwtPayloadDto = request['user'];
      genre.category = createGenreDTO.category; // <-- Ganti variabel DTO
      genre.description = createGenreDTO.description; // <-- Ganti variabel DTO
      genre.user_id = userJwtPayload.sub;
      // Tidak perlu return eksplisit di POST jika status default 201 OK sudah cukup
      await this.genreService.save(genre); // <-- Ganti service dan variabel entity
    }
  
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findAll(
      @Req() request: Request,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ): Promise<Genre[]> { // <-- Ganti return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Asumsi findByUserId sudah diubah di GenreService
      return await this.genreService.findByUserId(userJwtPayload.sub, page, limit); // <-- Ganti service
    }
  
    @Get('all')
    // Mungkin ingin menamai ulang endpoint atau method jika 'all' terlalu generik
    async getAllGenres(): Promise<Genre[]> { // <-- Ganti nama method dan return type
      // Asumsi findAll sudah diubah di GenreService
      return await this.genreService.findAll(); // <-- Ganti service
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the genre' }) // <-- Ganti deskripsi
    async findOne(
      @Req() request: Request,
      @Param('id') id: number,
    ): Promise<Genre> { // <-- Ganti return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Panggil method yang sudah diubah namanya di service
      const genre = await this.genreService.findByUserIdAndGenreId(userJwtPayload.sub, id); // <-- Ganti service dan nama method
      if (!genre || genre.id == null) { // Periksa null atau properti ID jika service mengembalikan instance kosong
          throw new NotFoundException(`Genre with ID ${id} not found for this user.`);
      }
      return genre;
    }
  
    @Put(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the genre' }) // <-- Ganti deskripsi
    async updateOne(
      @Req() request: Request,
      @Param('id') id: number,
      @Body() createGenreDTO: CreateGenreDTO, // <-- Ganti tipe dan nama DTO
    ) {
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Panggil method yang sudah diubah namanya di service
      const genre: Genre = await this.genreService.findByUserIdAndGenreId( // <-- Ganti tipe, nama variabel, service, dan nama method
        userJwtPayload.sub,
        id,
      );
      // Periksa null atau properti ID jika service mengembalikan instance kosong
      if (!genre || genre.id == null) {
        throw new NotFoundException(`Genre with ID ${id} not found for this user.`);
      }
      genre.category = createGenreDTO.category; // <-- Ganti variabel DTO
      genre.description = createGenreDTO.description; // <-- Ganti variabel DTO
      // Tidak perlu return eksplisit di PUT jika status default 200 OK sudah cukup
      await this.genreService.save(genre); // <-- Ganti service dan variabel entity
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the genre' }) // <-- Ganti deskripsi
    async deleteOne(@Req() request: Request, @Param('id') id: number) {
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Panggil method yang sudah diubah namanya di service
      const genre: Genre = await this.genreService.findByUserIdAndGenreId( // <-- Ganti tipe, nama variabel, service, dan nama method
        userJwtPayload.sub,
        id,
      );
      // Periksa null atau properti ID jika service mengembalikan instance kosong
      if (!genre || genre.id == null) {
        throw new NotFoundException(`Genre with ID ${id} not found for this user.`);
      }
      // Panggil method yang sudah diubah namanya di service
      await this.genreService.deleteById(id); // <-- Ganti service
      // Tidak perlu return eksplisit di DELETE jika status default 200 OK sudah cukup
      // Bisa juga return { message: 'Genre deleted successfully' } atau status 204 No Content
    }
  }