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
import { CreateGenreDTO } from './create-genre.dto';
import { GenreService } from './genre.service';
import { Genre } from './genre.entity';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() createGenreDTO: CreateGenreDTO,
  ) {
    const genre: Genre = new Genre();
    const userJwtPayload: JwtPayloadDto = request['user'];
    genre.name = createGenreDTO.name;
    genre.description = createGenreDTO.description;
    genre.user_id = userJwtPayload.sub;
    await this.genreService.save(genre);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Genre[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.genreService.findByUserId(
      userJwtPayload.sub,
      page,
      limit,
    );
  }

  @Get('all')
  async getAllGenres(): Promise<Genre[]> {
    return await this.genreService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the genre' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Genre> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.genreService.findByUserIdAndGenreId(
      userJwtPayload.sub,
      id,
    );
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the genre' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createGenreDTO: CreateGenreDTO,
  ) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const genre: Genre = await this.genreService.findByUserIdAndGenreId(
      userJwtPayload.sub,
      id,
    );
    if (genre.id == null) {
      throw new NotFoundException();
    }
    genre.name = createGenreDTO.name;
    genre.description = createGenreDTO.description;
    await this.genreService.save(genre);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the genre' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const genre: Genre = await this.genreService.findByUserIdAndGenreId(
      userJwtPayload.sub,
      id,
    );
    if (genre.id == null) {
      throw new NotFoundException();
    }
    await this.genreService.deleteById(id);
  }
}
