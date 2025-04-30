import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './comment.entity'; // <-- Ganti nama file dan class entity
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService { // <-- Ganti nama class service
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>, // <-- Ganti entity dan nama repository
  ) {}

  async save(comment: Comment): Promise<Comment> { // <-- Ganti parameter dan return type
    return this.commentRepository.save(comment); // <-- Ganti repository dan parameter
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Comment[]> { // <-- Ganti return type
    return await this.commentRepository.find({ // <-- Ganti repository
      where: { user_id: userId }, // Asumsi Comment punya user_id
      // Ganti relasi: book -> film, book.category -> film.genre
      relations: ['film', 'film.genre'], // <-- Sesuaikan dengan nama relasi di Comment dan Film entity
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC', // Asumsi Comment punya created_at
      },
    });
  }

  // Ganti nama method dan parameter: findByBookId -> findByFilmId
  async findByFilmId(
    filmId: number, // <-- Ganti nama parameter
    page: number,
    limit: number,
  ): Promise<Comment[]> { // <-- Ganti return type
    return await this.commentRepository.find({ // <-- Ganti repository
      // Ganti field where: book_id -> film_id (sesuaikan nama kolom foreign key di Comment entity)
      where: { film_id: filmId }, // <-- Sesuaikan dengan nama foreign key column
      // Ganti relasi
      relations: ['film', 'film.genre'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  // Ganti nama method dan parameter: findByUserIdAndReviewId -> findByUserIdAndCommentId
  async findByUserIdAndCommentId(userId: number, commentId: number): Promise<Comment> { // <-- Ganti nama method, parameter, return type
    const comment = await this.commentRepository.findOne({ // <-- Ganti nama variabel & repository
      where: {
        user_id: userId,
        id: commentId, // <-- Ganti parameter id
      },
      // Ganti relasi
      relations: ['film', 'film.genre'],
    });
    if (!comment) { // <-- Ganti nama variabel
      // Ganti error handling (lebih baik dari return new Entity())
      throw new NotFoundException(`Comment with ID ${commentId} not found for user ${userId}`);
      // return new Comment(); // Pola asli, kurang ideal
    }
    return comment; // <-- Ganti nama variabel
  }

  async deleteById(commentId: number): Promise<void> { // <-- Ganti parameter, return type bisa void
    const result = await this.commentRepository.delete({ id: commentId }); // <-- Ganti repository dan parameter id
    // Tambahkan check jika tidak ada yang terhapus
    if (result.affected === 0) {
        throw new NotFoundException(`Comment with ID ${commentId} not found for deletion.`);
    }
  }
}