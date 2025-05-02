import { Injectable } from '@nestjs/common';
import { Film } from './film.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film) private filmRepository: Repository<Film>,
  ) {}

  async save(film: Film): Promise<Film> {
    return this.filmRepository.save(film);
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Film[]> {
    return await this.filmRepository.find({
      where: { user_id: userId },
      relations: ['genre'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByUserIdAndPostId(userId: number, filmId: number): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: {
        user_id: userId,
        id: filmId,
      },
      relations: ['genre'],
    });
    if (!film) {
      return new Film();
    }
    return film;
  }

  async findById(filmId: number): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['genre'],
    });

    if (!film) {
      return new Film();
    }

    return film;
  }

  async deleteById(filmId: number) {
    await this.filmRepository.delete({ id: filmId });
  }
}
