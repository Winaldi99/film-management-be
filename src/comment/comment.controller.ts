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
    ParseIntPipe, // <-- Import ParseIntPipe
  } from '@nestjs/common';
  import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
  import { CreateCommentDTO } from './create-comment.dto'; // <-- Ganti nama file dan class DTO
  import { CommentService } from './comment.service'; // <-- Ganti nama service
  import { Comment } from './comment.entity'; // <-- Ganti nama entity
  import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'; // <-- Ditambahkan ApiTags
  import { FilmService } from '../film/film.service'; // <-- Ganti nama service terkait
  
  @ApiTags('Comment') // <-- Tag untuk Swagger
  @Controller('comment') // <-- Ganti route controller
  export class CommentController { // <-- Ganti nama class controller
    constructor(
      private readonly commentService: CommentService, // <-- Ganti nama service dan variabel
      private readonly filmService: FilmService, // <-- Ganti nama service dan variabel terkait
    ) {}
  
    @Post()
    async create(@Req() request: Request, @Body() createCommentDTO: CreateCommentDTO): Promise<Comment> { // <-- Ganti tipe DTO, return type
      const comment: Comment = new Comment(); // <-- Ganti tipe dan nama variabel entity
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      // Verify that the film exists using the renamed service
      try {
          // Asumsikan filmService.findById akan melempar error jika tidak ditemukan
          const film = await this.filmService.findById(createCommentDTO.filmId); // <-- Ganti service, method, DTO property
          // Jika findById mengembalikan null/undefined/empty object, tambahkan pengecekan:
          if (!film || film.id == null) {
               throw new NotFoundException(`Film with ID ${createCommentDTO.filmId} not found`);
          }
          comment.film_id = createCommentDTO.filmId; // <-- Ganti properti book_id -> film_id, DTO prop bookId -> filmId
      } catch (error) {
          if (error instanceof NotFoundException) {
              throw new NotFoundException(`Film with ID ${createCommentDTO.filmId} not found`);
          }
          throw error;
      }
  
      // Ganti properti 'ulasan' menjadi 'text' atau properti yang relevan di DTO/Entity
      comment.comment = createCommentDTO.comment; // <-- Ganti properti ulasan -> text (atau sesuai DTO)
      comment.user_id = userJwtPayload.sub;
  
      // Simpan comment menggunakan service yang sudah diubah
      return await this.commentService.save(comment); // <-- Ganti service dan variabel
    }
  
    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findAll(
      @Req() request: Request,
      @Query('page', new ParseIntPipe({ optional: true })) page: number = 1, // <-- Gunakan ParseIntPipe (opsional)
      @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10, // <-- Gunakan ParseIntPipe (opsional)
    ): Promise<Comment[]> { // <-- Ganti return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Panggil method dari CommentService
      return await this.commentService.findByUserId(userJwtPayload.sub, page, limit); // <-- Ganti service
    }
  
    // Ubah route untuk mencerminkan film, bukan buku
    @Get('film/:filmId') // <-- Ganti route: book/:bookId -> film/:filmId
    @ApiParam({ name: 'filmId', type: Number, description: 'ID of the film' }) // <-- Ganti nama param & deskripsi
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    async findByFilmId( // <-- Ganti nama method: findByBookId -> findByFilmId
      @Param('filmId', ParseIntPipe) filmId: number, // <-- Ganti nama param, gunakan ParseIntPipe
      @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
      @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ): Promise<Comment[]> { // <-- Ganti return type
      // Panggil method yang sudah diubah namanya di service
      return await this.commentService.findByFilmId(filmId, page, limit); // <-- Ganti service dan nama method
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the comment' }) // <-- Ganti deskripsi
    async findOne(
      @Req() request: Request,
      @Param('id', ParseIntPipe) id: number, // <-- Gunakan ParseIntPipe
    ): Promise<Comment> { // <-- Ganti return type
      const userJwtPayload: JwtPayloadDto = request['user'];
      // Panggil method yang sudah diubah namanya di service (findByUserIdAndCommentId)
      // Tangani NotFoundException jika service melemparnya
      try {
        return await this.commentService.findByUserIdAndCommentId(userJwtPayload.sub, id); // <-- Ganti service dan nama method
      } catch (error) {
         if (error instanceof NotFoundException) {
              throw new NotFoundException(`Comment with ID ${id} not found for this user.`);
         }
         throw error;
      }
    }
  
    @Put(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the comment' }) // <-- Ganti deskripsi
    async updateOne(
      @Req() request: Request,
      @Param('id', ParseIntPipe) id: number, // <-- Gunakan ParseIntPipe
      @Body() createCommentDTO: CreateCommentDTO, // <-- Ganti tipe dan nama DTO
    ): Promise<Comment> { // <-- Return Comment yang diperbarui
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      // 1. Dapatkan comment yang ada atau lempar error jika tidak ditemukan
      let comment: Comment;
      try {
         comment = await this.commentService.findByUserIdAndCommentId( // <-- Ganti service dan nama method
            userJwtPayload.sub,
            id,
         );
      } catch (error) {
          if (error instanceof NotFoundException) {
              throw new NotFoundException(`Comment with ID ${id} not found for this user to update.`);
          }
          throw error;
      }
  
      // 2. Verifikasi bahwa film baru (jika ada di DTO) ada (opsional jika film tidak bisa diubah)
      // Jika Anda memperbolehkan mengubah film yang dikomentari:
      if (createCommentDTO.filmId && createCommentDTO.filmId !== comment.film_id) {
          try {
               const film = await this.filmService.findById(createCommentDTO.filmId); // <-- Ganti service, method, DTO prop
               if (!film || film.id == null) {
                  throw new NotFoundException(`Film with ID ${createCommentDTO.filmId} not found`);
              }
              comment.film_id = createCommentDTO.filmId; // <-- Update ID film
          } catch (error) {
               if (error instanceof NotFoundException) {
                   throw new NotFoundException(`Film with ID ${createCommentDTO.filmId} not found`);
               }
               throw error;
          }
      }
  
      // 3. Update properti comment
      comment.comment = createCommentDTO.comment ?? comment.comment; // <-- Ganti properti ulasan -> text
  
      // 4. Simpan perubahan
      return await this.commentService.save(comment); // <-- Ganti service dan variabel
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID of the comment' }) // <-- Ganti deskripsi
    async deleteOne(
        @Req() request: Request,
        @Param('id', ParseIntPipe) id: number // <-- Gunakan ParseIntPipe
      ): Promise<{ message: string }> { // <-- Return pesan sukses
      const userJwtPayload: JwtPayloadDto = request['user'];
  
      // 1. Verifikasi bahwa comment milik pengguna sebelum menghapus
      try {
         await this.commentService.findByUserIdAndCommentId(userJwtPayload.sub, id); // <-- Ganti service dan nama method
      } catch (error) {
         if (error instanceof NotFoundException) {
              throw new NotFoundException(`Comment with ID ${id} not found for this user to delete.`);
         }
         throw error;
      }
  
      // 2. Hapus comment menggunakan service
      try {
          await this.commentService.deleteById(id); // <-- Ganti service
          return { message: `Comment with ID ${id} deleted successfully.` };
      } catch (error) {
          if (error instanceof NotFoundException) {
               throw new NotFoundException(`Comment with ID ${id} not found for deletion.`);
          }
          throw error;
      }
    }
  }