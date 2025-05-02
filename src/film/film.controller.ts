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
import { CreateFilmDTO } from './create-film.dto';
import { FilmService } from './film.service';
import { Film } from './film.entity';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { GenreService } from '../genre/genre.service';

@Controller('films')
export class FilmController {
  constructor(
    private readonly filmService: FilmService,
    private readonly genreService: GenreService,
  ) {}
  
  @Post()
  async create(@Req() request: Request, @Body() createFilmDTO: CreateFilmDTO) {
    const film: Film = new Film();
    const userJwtPayload: JwtPayloadDto = request['user'];
    
    // Verify that the genre exists
    const genre = await this.genreService.findById(createFilmDTO.genreId);
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    
    film.title = createFilmDTO.title;
    film.director = createFilmDTO.director;
    film.genre_id = createFilmDTO.genreId;
    film.image_url = createFilmDTO.imageUrl;
    film.user_id = userJwtPayload.sub;
    await this.filmService.save(film);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Film[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.filmService.findByUserId(userJwtPayload.sub, page, limit);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the film' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Film> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.filmService.findByUserIdAndPostId(userJwtPayload.sub, id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the film' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createFilmDTO: CreateFilmDTO,
  ) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const film: Film = await this.filmService.findByUserIdAndPostId(
      userJwtPayload.sub,
      id,
    );
    if (film.id == null) {
      throw new NotFoundException();
    }
    
    // Verify that the genre exists
    const genre = await this.genreService.findById(createFilmDTO.genreId);
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    
    film.title = createFilmDTO.title;
    film.director = createFilmDTO.director;
    film.genre_id = createFilmDTO.genreId;
    film.image_url = createFilmDTO.imageUrl;
    await this.filmService.save(film);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the film' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const film: Film = await this.filmService.findByUserIdAndPostId(
      userJwtPayload.sub,
      id,
    );
    if (film.id == null) {
      throw new NotFoundException();
    }
    await this.filmService.deleteById(id);
  }
}