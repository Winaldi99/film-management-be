import { Injectable } from '@nestjs/common';
import { Genre } from './genre.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre) private genreRepository: Repository<Genre>,
  ) {}

  async save(genre: Genre): Promise<Genre> {
    return this.genreRepository.save(genre);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Genre[]> {
    return await this.genreRepository.find({
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAll(): Promise<Genre[]> {
    return await this.genreRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findByUserIdAndGenreId(userId: number, genreId: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: {
        user_id: userId,
        id: genreId,
      },
    });
    if (!genre) {
      return new Genre();
    }
    return genre;
  }

  async findById(genreId: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { id: genreId }
    });
    
    if (!genre) {
      return new Genre();
    }
    
    return genre;
  }

  async deleteById(genreId: number) {
    await this.genreRepository.delete({ id: genreId });
  }
}