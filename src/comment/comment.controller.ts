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
import { CreateCommentDTO } from './create-comment.dto';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { FilmService } from '../film/film.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly filmService: FilmService,
  ) {}
  
  @Post()
  async create(@Req() request: Request, @Body() createCommentDTO: CreateCommentDTO) {
    const comment: Comment = new Comment();
    const userJwtPayload: JwtPayloadDto = request['user'];
    
    // Verify that the film exists
    const film = await this.filmService.findById(createCommentDTO.filmId);
    if (!film) {
      throw new NotFoundException('Film not found');
    }
    
    comment.film_id = createCommentDTO.filmId;
    comment.comment = createCommentDTO.comment;
    comment.user_id = userJwtPayload.sub;
    await this.commentService.save(comment);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Comment[]> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.commentService.findByUserId(userJwtPayload.sub, page, limit);
  }

  @Get('film/:filmId')
  @ApiParam({ name: 'filmId', type: Number, description: 'ID of the film' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findByFilmId(
    @Param('filmId') filmId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Comment[]> {
    return await this.commentService.findByFilmId(filmId, page, limit);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the comment' })
  async findOne(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Comment> {
    const userJwtPayload: JwtPayloadDto = request['user'];
    return await this.commentService.findByUserIdAndCommentId(userJwtPayload.sub, id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the comment' })
  async updateOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const comment: Comment = await this.commentService.findByUserIdAndCommentId(
      userJwtPayload.sub,
      id,
    );
    if (comment.id == null) {
      throw new NotFoundException();
    }
    
    // Verify that the film exists
    const film = await this.filmService.findById(createCommentDTO.filmId);
    if (!film) {
      throw new NotFoundException('Film not found');
    }
    
    comment.film_id = createCommentDTO.filmId;
    comment.comment = createCommentDTO.comment;
    await this.commentService.save(comment);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'ID of the comment' })
  async deleteOne(@Req() request: Request, @Param('id') id: number) {
    const userJwtPayload: JwtPayloadDto = request['user'];
    const comment: Comment = await this.commentService.findByUserIdAndCommentId(
      userJwtPayload.sub,
      id,
    );
    if (comment.id == null) {
      throw new NotFoundException();
    }
    await this.commentService.deleteById(id);
  }
}