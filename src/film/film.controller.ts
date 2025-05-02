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
    ParseIntPipe, // Import ParseIntPipe for ID validation
  } from '@nestjs/common';
  import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
  import { CreateFilmDTO } from './create-film.dto'; // <-- Ganti nama file dan class DTO
  import { FilmService } from './film.service'; // <-- Ganti nama service
  import { Film } from './film.entity'; // <-- Ganti nama entity
  import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'; // <-- Ditambahkan ApiTags
  import { GenreService } from '../genre/genre.service'; // <-- Ganti nama service terkait
  
  @ApiTags('film') // <-- Tag untuk Swagger
  @Controller('film') // <-- Ganti route controller
  export class FilmController { // <-- Ganti nama class controller
    constructor(
      private readonly filmService: FilmService, // <-- Ganti nama service dan variabel
      private readonly genreService: GenreService, // <-- Ganti nama service dan variabel terkait
    ) {}
  
    @Post()
    async create(@Req() request: Request, @Body() createFilmDTO: CreateFilmDTO) { // <-- Ganti tipe dan nama DTO
      const film: Film = new Film(); // <-- Ganti tipe dan nama variabel entity
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      // Verify that the genre exists using the renamed service
      // Gunakan findById dari GenreService, yang idealnya melempar error jika tidak ditemukan
      try {
          // Asumsikan genreService.findById akan melempar error jika tidak ditemukan
          // atau kembalikan genre yang valid jika ada
          const genre = await this.genreService.findById(createFilmDTO.genreId); // <-- Ganti service, method, dan DTO property
          // Jika findById mengembalikan null/undefined/empty object, tambahkan pengecekan:
          if (!genre || genre.id == null) {
               throw new NotFoundException(`Genre with ID ${createFilmDTO.genreId} not found`);
          }
          film.genre_id = createFilmDTO.genreId; // <-- Tetapkan ID genre
          // Jika Anda ingin melampirkan objek Genre penuh (jika relasi di entity diatur):
          // film.genre = genre;
      } catch (error) {
          // Tangkap error jika findById melempar NotFoundException
          if (error instanceof NotFoundException) {
              throw new NotFoundException(`Genre with ID ${createFilmDTO.genreId} not found`);
          }
          // Tangani error lain jika perlu
          throw error;
      }
  
  
      // Tetapkan properti Film berdasarkan DTO
      film.title = createFilmDTO.title;
      // Asumsikan DTO memiliki 'director' bukan 'author'
      film.director = createFilmDTO.director; // <-- Ganti properti 'author' menjadi 'director' (atau properti relevan lainnya)
      // film.category_id diganti oleh penugasan genre di atas
      // Asumsikan DTO masih memiliki 'imageUrl'
      film.image_url = createFilmDTO.imageUrl;
      film.user_id = userJwtPayload.sub;
  
      // Simpan film menggunakan service yang sudah diubah
      // Return hasil save untuk mendapatkan ID dan data lengkap jika diperlukan (opsional)
      const savedFilm = await this.filmService.save(film); // <-- Ganti service dan variabel
      return savedFilm; // Mengembalikan film yang baru dibuat
    }
  
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findAll(
      @Req() request: Request,
      // Gunakan default value atau ParseIntPipe dengan optional: true jika diperlukan
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
    ): Promise<Film[]> { // <-- Ganti return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Panggil method dari FilmService
      return await this.filmService.findByUserId(userJwtPayload.sub, page, limit); // <-- Ganti service
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the film' }) // <-- Ganti deskripsi
    async findOne(
      @Req() request: Request,
      @Param('id', ParseIntPipe) id: number, // <-- Gunakan ParseIntPipe untuk validasi ID
    ): Promise<Film> { // <-- Ganti return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Panggil method yang sudah diubah di service (findByUserIdAndFilmId)
      // Tangani NotFoundException jika service melemparnya
      try {
          return await this.filmService.findByUserIdAndFilmId(userJwtPayload.sub, id); // <-- Ganti service dan nama method
      } catch (error) {
          if (error instanceof NotFoundException) {
               throw new NotFoundException(`Film with ID ${id} not found for this user.`);
          }
          throw error;
      }
    }
  
    @Put(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the film' }) // <-- Ganti deskripsi
    async updateOne(
      @Req() request: Request,
      @Param('id', ParseIntPipe) id: number, // <-- Gunakan ParseIntPipe
      @Body() createFilmDTO: CreateFilmDTO, // <-- Ganti tipe dan nama DTO
    ): Promise<Film> { // <-- Return Film yang diperbarui
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      // 1. Dapatkan film yang ada atau lempar error jika tidak ditemukan
      let film: Film;
      try {
          film = await this.filmService.findByUserIdAndFilmId( // <-- Ganti service dan nama method
            userJwtPayload.sub,
            id,
          );
      } catch (error) {
           if (error instanceof NotFoundException) {
               throw new NotFoundException(`Film with ID ${id} not found for this user to update.`);
           }
           throw error;
      }
  
      // 2. Verifikasi bahwa genre baru (jika ada di DTO) ada
      if (createFilmDTO.genreId) {
          try {
              const genre = await this.genreService.findById(createFilmDTO.genreId); // <-- Ganti service, method, DTO prop
               if (!genre || genre.id == null) {
                  throw new NotFoundException(`Genre with ID ${createFilmDTO.genreId} not found`);
              }
              film.genre_id = createFilmDTO.genreId; // <-- Update ID genre
              // Jika menggunakan objek: film.genre = genre;
          } catch (error) {
               if (error instanceof NotFoundException) {
                   throw new NotFoundException(`Genre with ID ${createFilmDTO.genreId} not found`);
               }
               throw error;
          }
      }
  
      // 3. Update properti film
      film.title = createFilmDTO.title ?? film.title; // Gunakan nilai baru atau pertahankan yang lama jika null/undefined
      film.director = createFilmDTO.director ?? film.director; // <-- Ganti properti
      film.image_url = createFilmDTO.imageUrl ?? film.image_url;
  
      // 4. Simpan perubahan
      return await this.filmService.save(film); // <-- Ganti service dan variabel
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the film' }) // <-- Ganti deskripsi
    async deleteOne(
        @Req() request: Request,
        @Param('id', ParseIntPipe) id: number // <-- Gunakan ParseIntPipe
      ): Promise<{ message: string }> { // <-- Return pesan sukses atau void
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      // 1. Verifikasi bahwa film milik pengguna sebelum menghapus (opsional tapi bagus)
      // findByUserIdAndFilmId sudah melakukan ini dan akan melempar error jika tidak ditemukan
      try {
          await this.filmService.findByUserIdAndFilmId(userJwtPayload.sub, id); // <-- Ganti service dan nama method
      } catch (error) {
          if (error instanceof NotFoundException) {
               throw new NotFoundException(`Film with ID ${id} not found for this user to delete.`);
          }
          throw error;
      }
  
      // 2. Hapus film menggunakan service (yang idealnya melempar error jika ID tidak ada)
      try {
          await this.filmService.deleteById(id); // <-- Ganti service
          return { message: `Film with ID ${id} deleted successfully.` };
      } catch (error) {
           if (error instanceof NotFoundException) {
               // Ini mungkin redundan jika cek di atas sudah dilakukan,
               // tapi berguna jika deleteById dipanggil langsung tanpa cek sebelumnya
               throw new NotFoundException(`Film with ID ${id} not found for deletion.`);
           }
           throw error; // Tangani error lain
      }
    }
  }