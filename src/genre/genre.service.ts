import { Injectable } from '@nestjs/common';
import { Genre } from './genre.entity'; // <-- Ganti nama file dan class entity
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GenreService { // <-- Ganti nama class service
  constructor(
    @InjectRepository(Genre) private genreRepository: Repository<Genre>, // <-- Ganti entity dan nama repository
  ) {}

  async save(genre: Genre): Promise<Genre> { // <-- Ganti parameter dan return type
    return this.genreRepository.save(genre); // <-- Ganti repository dan parameter
  }

  async findByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<Genre[]> { // <-- Ganti return type
    return await this.genreRepository.find({ // <-- Ganti repository
      where: { user_id: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findAll(): Promise<Genre[]> { // <-- Ganti return type
    return await this.genreRepository.find({ // <-- Ganti repository
      order: {
        category: 'ASC', // Asumsi 'name' masih relevan untuk Genre
      },
    });
  }

  // Nama method bisa diubah agar lebih deskriptif, tapi mengikuti pola perubahan:
  async findByUserIdAndGenreId(userId: number, genreId: number): Promise<Genre> { // <-- Ganti nama method, parameter, dan return type
    const genre = await this.genreRepository.findOne({ // <-- Ganti nama variabel dan repository
      where: {
        user_id: userId,
        id: genreId, // <-- Ganti parameter
      },
    });
    if (!genre) { // <-- Ganti nama variabel
      // Pertimbangkan cara handle jika tidak ditemukan. Mungkin throw error atau return null.
      // Mengembalikan instance baru mungkin tidak ideal.
      // Untuk konsistensi perubahan, kita ganti ke new Genre(), tapi perhatikan implikasinya.
      return new Genre(); // <-- Ganti entity
    }
    return genre; // <-- Ganti nama variabel
  }

  async findById(genreId: number): Promise<Genre> { // <-- Ganti parameter dan return type
    const genre = await this.genreRepository.findOne({ // <-- Ganti nama variabel dan repository
      where: { id: genreId } // <-- Ganti parameter
    });

    if (!genre) { // <-- Ganti nama variabel
      // Sama seperti di atas, pertimbangkan penanganan jika tidak ditemukan
      return new Genre(); // <-- Ganti entity
    }

    return genre; // <-- Ganti nama variabel
  }

  async deleteById(genreId: number) { // <-- Ganti parameter
    await this.genreRepository.delete({ id: genreId }); // <-- Ganti repository dan parameter
  }
}