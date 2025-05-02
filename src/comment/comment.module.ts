import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { FilmModule } from '../film/film.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    FilmModule
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}