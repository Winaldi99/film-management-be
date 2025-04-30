import { Injectable, NotFoundException } from '@nestjs/common'; // Pertimbangkan NotFoundException
import { Film } from './film.entity'; // <-- Ganti nama file dan class entity
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilmService { // <-- Ganti nama class service
  constructor(
    @InjectRepository(Film) private filmRepository: Repository<Film>, // <-- Ganti entity dan nama repository
  ) {}

  async save(film: Film): Promise<Film> { // <-- Ganti parameter dan return type
    return this.filmRepository.save(film); // <-- Ganti repository dan parameter
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Film[]> { // <-- Ganti return type
    return await this.filmRepository.find({ // <-- Ganti repository
      where: { user_id: userId },
      relations: ['genre'], // <-- Ganti relasi ke 'genre' (sesuai permintaan sebelumnya)
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC', // Asumsi field 'created_at' masih relevan untuk Film
      },
    });
  }

  // Nama method diubah agar lebih konsisten (PostId -> FilmId)
  async findByUserIdAndFilmId(userId: number, filmId: number): Promise<Film> { // <-- Ganti nama method, parameter, dan return type
    const film = await this.filmRepository.findOne({ // <-- Ganti nama variabel dan repository
      where: {
        user_id: userId,
        id: filmId, // <-- Ganti parameter
      },
      relations: ['genre'], // <-- Ganti relasi ke 'genre'
    });
    if (!film) {
      // Mengembalikan instance baru mungkin tidak ideal.
      // Pertimbangkan throw NotFoundException atau return null.
      // return new Film(); // <-- Mengikuti pola asli, tapi kurang ideal
      // Opsi yang lebih baik:
      throw new NotFoundException(`Film with ID ${filmId} not found for user ${userId}`);
      // atau return null; (jika controller akan menangani null)
    }
    return film; // <-- Ganti nama variabel
  }

  async findById(filmId: number): Promise<Film> { // <-- Ganti parameter dan return type
    const film = await this.filmRepository.findOne({ // <-- Ganti nama variabel dan repository
      where: { id: filmId }, // <-- Ganti parameter
      relations: ['genre'], // <-- Ganti relasi ke 'genre'
    });

    if (!film) { // <-- Ganti nama variabel
      // Sama seperti di atas, pertimbangkan penanganan yang lebih baik
      // return new Film(); // <-- Mengikuti pola asli
      // Opsi yang lebih baik:
       throw new NotFoundException(`Film with ID ${filmId} not found`);
      // atau return null;
    }

    return film; // <-- Ganti nama variabel
  }

  async deleteById(filmId: number): Promise<void> { // <-- Ganti parameter, return type bisa void
    const result = await this.filmRepository.delete({ id: filmId }); // <-- Ganti repository dan parameter
    // Optional: Periksa apakah ada baris yang terhapus
    if (result.affected === 0) {
        throw new NotFoundException(`Film with ID ${filmId} not found for deletion.`);
    }
  }
}