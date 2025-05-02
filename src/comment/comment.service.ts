import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async save(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { user_id: userId },
      relations: ['film', 'film.genre'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByFilmId(
    filmId: number,
    page: number,
    limit: number,
  ): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { film_id: filmId },
      relations: ['film', 'film.genre'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByUserIdAndCommentId(userId: number, commentId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: {
        user_id: userId,
        id: commentId,
      },
      relations: ['film', 'film.genre'],
    });
    if (!comment) {
      return new Comment();
    }
    return comment;
  }

  async deleteById(commentId: number) {
    await this.commentRepository.delete({ id: commentId });
  }
}